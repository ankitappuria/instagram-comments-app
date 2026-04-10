function Reply({ reply, onReplyToReply }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
      <Avatar name={reply.userName} size={28} />
      <div style={{ flex: 1 }}>
        <div style={{
          background: "#f8f8f8", borderRadius: 14,
          padding: "8px 12px", display: "inline-block", maxWidth: "100%"
        }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>
            {reply.userName}
          </span>
          {"  "}
          <span style={{ fontSize: 14, color: "#333", fontFamily: "'DM Sans', sans-serif" }}>
            {reply.replyToUserName && (
              <span style={{ color: "#0095F6", fontWeight: 500 }}>@{reply.replyToUserName} </span>
            )}
            {reply.replyToUserName
              ? reply.content.replace(`@${reply.replyToUserName} `, "")
              : reply.content}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 4, paddingLeft: 4, alignItems: "center" }}>
          <TimeAgo date={reply.createdAt} />
          <button
            onClick={() => onReplyToReply(reply)}
            style={{
              background: "none", border: "none", fontSize: 12,
              fontWeight: 600, color: "#999", cursor: "pointer",
              padding: 0, fontFamily: "'DM Sans', sans-serif"
            }}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}