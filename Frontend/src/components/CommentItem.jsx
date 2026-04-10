import Avatar from "./Avatar";
import ReplyList from "./ReplyList";
import { timeAgo } from "../utils/helper";
import "../styles/components.css";

export default function CommentItem({ comment, currentUser }) {
  return (
    <div className="comment-item">
      <Avatar name={comment.userName} size={38} />
      <div className="comment-bubble-content">
        <div className="comment-bubble">
          <div className="comment-username">
            {comment.userName}
          </div>
          <div className="comment-text">
            {comment.content}
          </div>
        </div>
        <div className="comment-meta">
          <span className="comment-timestamp">{timeAgo(comment.createdAt)}</span>
        </div>
        <ReplyList comment={comment} currentUser={currentUser} />
      </div>
    </div>
  );
}