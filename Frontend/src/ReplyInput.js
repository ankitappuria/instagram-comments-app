import { useState, useEffect, useRef } from "react";
function ReplyInput({ onSubmit, onCancel, replyTo, replyToUserName, placeholder }) {
  const [text, setText] = useState(
    replyToUserName ? `@${replyToUserName} ` : ""
  );
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => { ref.current?.focus(); }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await onSubmit(text.trim());
    setLoading(false);
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "flex-end" }}>
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        background: "#f5f5f5", borderRadius: 20,
        padding: "8px 14px", gap: 8
      }}>
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
          style={{
            flex: 1, border: "none", background: "transparent",
            resize: "none", outline: "none", fontSize: 14,
            fontFamily: "'DM Sans', sans-serif", color: "#111",
            lineHeight: 1.5, maxHeight: 80, overflow: "auto"
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || loading}
        style={{
          background: text.trim() && !loading ? "#0095F6" : "#b2dffc",
          color: "#fff", border: "none", borderRadius: 20,
          padding: "8px 16px", fontSize: 13, fontWeight: 600,
          cursor: text.trim() && !loading ? "pointer" : "default",
          fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
          flexShrink: 0
        }}
      >
        {loading ? "..." : "Post"}
      </button>
      {onCancel && (
        <button onClick={onCancel} style={{
          background: "none", border: "none", color: "#999",
          fontSize: 12, cursor: "pointer", padding: "8px 4px",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          Cancel
        </button>
      )}
    </div>
  );
}