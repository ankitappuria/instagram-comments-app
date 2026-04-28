import { useState } from "react";
import ReplyItem from "./ReplyItem";
import CommentInput from "./CommentInput";
import { useReplies } from "../hooks/useReplies";
import "../../../styles/components.css";

export default function ReplyList({ comment, currentUser }) {
  const { replies, expanded, loadingMore, hasMore, replyCount, expand, collapse, loadMore, addReply } = useReplies(comment);
  const [replyTarget, setReplyTarget] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const handleReply = (target = null) => {
    setReplyTarget(target);
    setShowInput(true);
    if (!expanded) expand();
  };

  const handleSubmit = async (content) => {
    await addReply({
      userName: currentUser,
      content,
      replyTo: replyTarget?._id,
      replyToUserName: replyTarget?.userName,
    });
    setShowInput(false);
    setReplyTarget(null);
  };

  return (
    <div>
      <div className="reply-list-header">
        <button
          onClick={() => handleReply()}
          className="reply-btn"
          style={{ padding: 0, fontSize: 12, fontWeight: 600, marginTop: 0 }}
        >
          Reply
        </button>
        {replyCount > 0 && (
          <span className="reply-count">
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </span>
        )}
      </div>

      {replyCount > 0 && !expanded && (
        <button
          onClick={expand}
          className="view-replies-btn"
        >
          <div className="divider-line" />
          View {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </button>
      )}

      {expanded && (
        <div className="replies-container">
          {replies.map(reply => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              onReply={() => handleReply(reply)}
            />
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="load-more-replies-btn"
            >
              <div className="divider-line" />
              {loadingMore ? "Loading..." : "Load more replies"}
            </button>
          )}

          <button
            onClick={collapse}
            className="hide-replies-btn"
          >
            <div className="divider-line-gray" />
            Hide replies
          </button>
        </div>
      )}

      {showInput && (
        <div style={{ marginTop: 12, paddingLeft: 4 }}>
          <CommentInput 
            onSubmit={handleSubmit}
            onCancel={() => setShowInput(false)}
            replyToUserName={replyTarget?.userName}
            placeholder={`Reply to ${replyTarget?.userName || "comment"}...`}
          />
        </div>
      )}
    </div>
  );
}