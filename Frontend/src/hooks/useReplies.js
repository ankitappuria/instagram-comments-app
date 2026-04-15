import { useState } from "react";
import { fetchReplies, postReply } from "../services/commentService";

export function useReplies(comment) {
  const [replies, setReplies] = useState(comment.repliesPreview || []);
  const [expanded, setExpanded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(comment.hasMoreReplies);
  const [replyCount, setReplyCount] = useState(comment.replyCount || 0);

  const expand = () => setExpanded(true);
  const collapse = () => setExpanded(false);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchReplies(comment._id, nextPage, 2);
      setReplies(prev => [...prev, ...data]);
      setPage(nextPage);
      const totalLoaded = (nextPage-1) * 2+data.length;
      setHasMore(totalLoaded < replyCount);
    } finally {
      setLoadingMore(false);
    }

  };

  const addReply = async ({ userName, content, replyTo, replyToUserName }) => {
    const newReply = await postReply({
      parentId: comment._id,
      userName,
      content,
      replyTo: replyTo || null,
      replyToUserName: replyToUserName || null,
    });
    setReplies(prev => [...prev, newReply]);
    setReplyCount(prev => prev + 1);
    setExpanded(true);
  };

  return { replies, expanded, loadingMore, hasMore, replyCount, expand, collapse, loadMore, addReply };
}