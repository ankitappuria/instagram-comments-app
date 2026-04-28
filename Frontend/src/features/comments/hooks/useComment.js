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
      const commentsNew = data[0]?.comments;
      setComments(prev => append ? [...prev, ...commentsNew] : commentsNew);
      const totalComments = data[0]?.totalCount || 0;
      console.log("Total comments:", totalComments, "Loaded:", (p-1)*2 + commentsNew.length);
      setHasMore(totalComments > (p * 2));
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
    await postComment({ postId, userName, content });
    //setComments(prev => [{ ...newComment, repliesPreview: [], replyCount: 0, hasMoreReplies: false }, ...prev]);
  };

  return { comments, loading, loadingMore, hasMore, error, loadMore, addComment };
}