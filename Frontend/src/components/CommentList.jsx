import CommentItem from "./CommentItem";
import "../styles/components.css";

function Skeleton() {
  return (
    <div className="comment-list-skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-text">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--long" />
      </div>
    </div>
  );
}

export default function CommentList({ comments, loading, loadingMore, hasMore, onLoadMore, currentUser }) {
  if (loading) {
    return <>{[1, 2, 3].map(i => <Skeleton key={i} />)}</>;
  }

  if (comments.length === 0) {
    return (
      <div className="comment-list-empty">
        <div className="comment-list-empty-icon">💬</div>
        <div className="comment-list-empty-title">No comments yet</div>
        <div className="comment-list-empty-subtitle">Be the first to comment</div>
      </div>
    );
  }

  return (
    <>
      {comments.map(comment => (
        <CommentItem key={comment._id} comment={comment} currentUser={currentUser} />
      ))}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="load-more-btn"
        >
          {loadingMore ? "Loading..." : "Load more comments"}
        </button>
      )}
    </>
  );
}