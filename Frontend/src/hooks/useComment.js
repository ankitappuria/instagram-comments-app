import { useState, useEffect, useCallback } from "react";
import { fetchCommentsPaginated, postComment } from "../services/commentService";

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (p = 1, append = false) => {
    try {
      if (p === 1) setLoading(true);
      const data = await fetchCommentsPaginated(postId, p, 2);
      setComments(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === 2);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { load(1); }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    await load(page + 1, true);
    setLoadingMore(false);
  };

  const addComment = async (userName, content) => {
    const newComment = await postComment({ postId, userName, content });
    //setComments(prev => [{ ...newComment, repliesPreview: [], replyCount: 0, hasMoreReplies: false }, ...prev]);
  };

  return { comments, loading, loadingMore, hasMore, error, loadMore, addComment };
}