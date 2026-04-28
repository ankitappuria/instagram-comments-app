import { useState, useEffect, useRef } from "react";
import "../../../styles/components.css";

export default function CommentInput({ onSubmit, onCancel, replyToUserName, placeholder }) {
  const [text, setText] = useState(replyToUserName ? `@${replyToUserName} ` : "");
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => { ref.current?.focus(); }, []);

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-input-container">
      <div className="comment-input-wrapper">
        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder || "Add a comment..."}
          rows={1}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
            if (e.key === "Escape") onCancel?.();
          }}
          className="comment-textarea"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        className="comment-submit-btn"
      >
        Post
      </button>
    </div>
  );
}