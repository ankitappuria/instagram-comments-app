const commentService = require("../services/commentServices");
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/apiError');

// ✅ Get comments (non-paginated)
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      throw new ApiError('postId is required', 400, 'VALIDATION_ERROR');
    }

    const comments = await commentService.getCommentsByPost({ postId });

    res.json(ApiResponse.success(comments, 'Comments fetched successfully'));
  } catch (err) {
    next(err);
  }
};

// ✅ Get paginated comments
const getCommentsPaginated = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!postId) {
      throw new ApiError('postId is required', 400, 'VALIDATION_ERROR');
    }

    const result = await commentService.getCommentsPaginated({ postId, page, limit });

    res.json(ApiResponse.success(result, 'Paginated comments fetched'));
  } catch (err) {
    next(err);
  }
};

// ✅ Get paginated replies for a top-level comment
const getRepliesPaginated = async (req, res, next) => {
  try {
    const { parentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!parentId) {
      throw new ApiError('parentId is required', 400, 'VALIDATION_ERROR');
    }

    const result = await commentService.getRepliesPaginated({ parentId, page, limit });

    res.json(ApiResponse.success(result, 'Replies fetched successfully'));
  } catch (err) {
    next(err);
  }
};

// ✅ Create top-level comment
// ✅ Create comment or reply (unified)
const createComment = async (req, res, next) => {
  try {
    const { postId, parentId, replyTo, replyToUserName, userName, content } = req.body;

    if (!userName) {
      throw new ApiError('userName is required', 400, 'VALIDATION_ERROR');
    }
    if (!content) {
      throw new ApiError('content is required', 400, 'VALIDATION_ERROR');
    }

    let result;

    if (parentId) {
      // Reply flow
      result = await commentService.createReply({
        parentId,
        replyTo: replyTo || null,
        replyToUserName: replyToUserName || null,
        userName,
        content
      });
    } else {
      // Top-level comment flow
      if (!postId) {
        throw new ApiError('postId is required for a comment', 400, 'VALIDATION_ERROR');
      }

      result = await commentService.createComment({ postId, userName, content });
    }

    res.status(201).json(ApiResponse.success(result, 'Created successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComments,
  getCommentsPaginated,
  getRepliesPaginated,
  createComment,
};