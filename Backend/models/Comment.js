const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      index: true
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },

    replyToUserName: {
      type: String,
      default: null
    },

    // username is the unique user identifier here
    userName: {
      type: String,
      required: true,
      index: true
    },

    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2200
    },

    likeCount: {
      type: Number,
      default: 0
    },

    replyCount: {
      type: Number,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, parentId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);