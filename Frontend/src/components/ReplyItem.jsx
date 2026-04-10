import Avatar from "./Avatar";
import { timeAgo, stripMention } from "../utils/helper";
import "../styles/components.css";

export default function ReplyItem({ reply, onReply }) {
  return (
    <div className="reply-item">
      <Avatar name={reply.userName} size={28} />
      <div>
        <div className="reply-bubble">
          <span className="reply-username">
            {reply.userName}
          </span>
          {"  "}
          <span className="reply-content">
            {reply.replyToUserName && (
              <span className="reply-mention">
                @{reply.replyToUserName}{" "}
              </span>
            )}
            {stripMention(reply.content, reply.replyToUserName)}
          </span>
        </div>
        <div className="reply-meta">
          <span className="reply-timestamp">{timeAgo(reply.createdAt)}</span>
          <button
            onClick={() => onReply(reply)}
            className="reply-btn"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}