const express = require("express");
const {
  getComments,
  getCommentsPaginated,
  getRepliesPaginated,
  createComment
} = require("../contollers/commentController");

const router = express.Router();

// Top-level comments (tree structure — small datasets)
router.get("/:postId", getComments);

// Paginated top-level comments with reply preview
router.get("/paginated/:postId", getCommentsPaginated);

// Load more replies for a top-level comment
router.get("/replies/:parentId", getRepliesPaginated);

// Create comment or reply (unified)
router.post("/", createComment);

module.exports = router;