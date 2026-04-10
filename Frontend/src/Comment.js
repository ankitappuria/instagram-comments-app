import React, { useState } from "react";

function Comment({ comment, onReplyAdded }) {
  const [replying, setReplying] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replies, setReplies] = useState(comment.repliesPreview || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(comment.hasMoreReplies);
  const [expanded, setExpanded] = useState(false);

  const handleReplyToReply = (reply) => {
    setReplyTarget(reply);
    setReplying(true);
    setExpanded(true);
  };

  const handleReplySubmit = async (content) => {
    const body = {
      parentId: comment._id,
      userName: currentUser,
      content,
      ...(replyTarget && {
        replyTo: replyTarget._id,
        replyToUserName: replyTarget.userName
      })
    };

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (data.success) {
      setReplies(prev => [...prev, data.data]);
      setReplying(false);
      setReplyTarget(null);
      onReplyAdded?.();
    }
  };

  const loadMoreReplies = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetch(`${API_BASE}/replies/${comment._id}?page=${nextPage}&limit=5`);
    const data = await res.json();
    if (data.success) {
      setReplies(prev => [...prev, ...data.data]);
      setPage(nextPage);
      setHasMore(data.data.length === 5);
    }
    setLoadingMore(false);
  };

  return (
    <div style={{ display: "flex", gap: 12, paddingBottom: 16 }}>
      <Avatar name={comment.userName} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: "#f8f8f8", borderRadius: 18,
          padding: "10px 14px", display: "inline-block", maxWidth: "100%"
        }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#111", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>
            {comment.userName}
          </div>
          <div style={{ fontSize: 14, color: "#222", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
            {comment.content}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 6, paddingLeft: 4, alignItems: "center" }}>
          <TimeAgo date={comment.createdAt} />
          <button
            onClick={() => { setReplyTarget(null); setReplying(true); setExpanded(true); }}
            style={{
              background: "none", border: "none", fontSize: 12,
              fontWeight: 600, color: "#999", cursor: "pointer",
              padding: 0, fontFamily: "'DM Sans', sans-serif"
            }}
          >
            Reply
          </button>
          {comment.replyCount > 0 && (
            <span style={{ fontSize: 12, color: "#bbb" }}>
              {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
            </span>
          )}
        </div>

        {comment.replyCount > 0 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            style={{
              background: "none", border: "none", fontSize: 13,
              fontWeight: 600, color: "#0095F6", cursor: "pointer",
              padding: "6px 0 0", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6
            }}
          >
            <div style={{ width: 24, height: 1, background: "#0095F6" }} />
            View {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
          </button>
        )}

        {expanded && (
          <div style={{ marginTop: 4, paddingLeft: 4 }}>
            {replies.map(reply => (
              <Reply key={reply._id} reply={reply} onReplyToReply={handleReplyToReply} />
            ))}

            {hasMore && (
              <button
                onClick={loadMoreReplies}
                disabled={loadingMore}
                style={{
                  background: "none", border: "none", fontSize: 13,
                  fontWeight: 600, color: "#0095F6", cursor: "pointer",
                  padding: "8px 0 0", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 6
                }}
              >
                <div style={{ width: 24, height: 1, background: "#0095F6" }} />
                {loadingMore ? "Loading..." : "Load more replies"}
              </button>
            )}

            {expanded && (
              <button
                onClick={() => setExpanded(false)}
                style={{
                  background: "none", border: "none", fontSize: 13,
                  fontWeight: 600, color: "#999", cursor: "pointer",
                  padding: "8px 0 0", fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: 6
                }}
              >
                <div style={{ width: 24, height: 1, background: "#ccc" }} />
                Hide replies
              </button>
            )}
          </div>
        )}

        {replying && (
          <div style={{ marginTop: 8 }}>
            <ReplyInput
              replyTo={replyTarget?._id}
              replyToUserName={replyTarget?.userName || comment.userName}
              onSubmit={handleReplySubmit}
              onCancel={() => { setReplying(false); setReplyTarget(null); }}
              placeholder={`Reply to ${replyTarget?.userName || comment.userName}...`}
            />
          </div>
        )}
      </div>
    </div>
  );
}