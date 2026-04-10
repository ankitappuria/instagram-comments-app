const Comment = require('../models/Comment');

// ✅ Create a top-level comment
const createComment = async ({ postId, userName, content }) => {
  return await Comment.create({
    postId,
    userName,
    content,
    parentId: null
  });
};

// ✅ Create a reply
const createReply = async ({ parentId, replyTo, replyToUserName, userName, content }) => {
  const parent = await Comment.findById(parentId).select('postId parentId');

  if (!parent) {
    throw new Error('Parent comment not found');
  }

  // Always attach to top-level comment
  const topLevelParentId = parent.parentId ? parent.parentId : parent._id;

  // Atomically increment replyCount on the top-level comment
  await Comment.findByIdAndUpdate(topLevelParentId, {
    $inc: { replyCount: 1 }
  });

  return await Comment.create({
    postId: parent.postId,
    parentId: topLevelParentId,
    replyTo: replyTo || null,
    replyToUserName: replyToUserName || null,
    userName,
    content
  });
};

// ✅ Get all comments for a post (tree structure — use only for small datasets)
const getCommentsByPost = async ({ postId }) => {
  const comments = await Comment.find({ postId, isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();

  const map = {};
  const roots = [];

  comments.forEach(c => {
    c.children = [];
    map[c._id.toString()] = c;
  });

  comments.forEach(c => {
    if (c.parentId) {
      const parent = map[c.parentId.toString()];
      if (parent) {
        parent.children.push(c);
      }
    } else {
      roots.push(c);
    }
  });

  return roots;
};

// ✅ Paginated comments with reply preview (production use)
const getCommentsPaginated = async ({ postId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        postId,
        parentId: null,
        isDeleted: false
      }
    },

    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },

    // Preview first 2 replies
    {
      $lookup: {
        from: 'comments',
        let: { commentId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$parentId', '$$commentId'] },
              isDeleted: false
            }
          },
          { $sort: { createdAt: 1 } },
          { $limit: 2 },
          {
            $project: {
              _id: 1,
              userName: 1,
              content: 1,
              createdAt: 1,
              replyToUserName: 1
            }
          }
        ],
        as: 'repliesPreview'
      }
    },

    {
      $addFields: {
        // replyCount already stored on document — no extra lookup needed
        hasMoreReplies: { $gt: ['$replyCount', 2] }
      }
    },

    {
      $project: {
        __v: 0,
        postId: 0,
        parentId: 0
      }
    }
  ];

  return await Comment.aggregate(pipeline);
};

// ✅ Load more replies for a specific top-level comment
const getRepliesPaginated = async ({ parentId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  return await Comment.find({ parentId, isDeleted: false })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .select('-__v -postId')
    .lean();
};

module.exports = {
  createComment,
  createReply,
  getCommentsByPost,
  getCommentsPaginated,
  getRepliesPaginated
};