import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:3000/api/comments";
const POST_ID = "post_123";

const COLORS = [
  "#E8D5FF", "#FFD5E8", "#D5E8FF", "#D5FFE8",
  "#FFE8D5", "#E8FFD5", "#F5D5FF", "#D5F5FF"
];

function getAvatarColor(name = "") {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

function Avatar({ name, size = 36 }) {
  const bg = getAvatarColor(name);
  const text = (name?.[0] || "?").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 600,
      fontSize: size * 0.38, color: "#333",
      flexShrink: 0, fontFamily: "'DM Sans', sans-serif"
    }}>
      {text}
    </div>
  );
}

function TimeAgo({ date }) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  const str = diff < 60 ? "just now"
    : diff < 3600 ? `${Math.floor(diff / 60)}m`
    : diff < 86400 ? `${Math.floor(diff / 3600)}h`
    : `${Math.floor(diff / 86400)}d`;
  return <span style={{ fontSize: 12, color: "#999" }}>{str}</span>;
}







let currentUser = "You";

export default function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userName, setUserName] = useState("You");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("You");
  const bottomRef = useRef();

  const fetchComments = async (p = 1, append = false) => {
    if (p === 1) setLoading(true);
    const res = await fetch(`${API_BASE}/paginated/${POST_ID}?page=${p}&limit=10`);
    const data = await res.json();
    if (data.success) {
      setComments(prev => append ? [...prev, ...data.data] : data.data);
      setHasMore(data.data.length === 10);
    }
    setLoading(false);
  };

  useEffect(() => { fetchComments(1); }, []);

  const handleCommentPost = async (content) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: POST_ID, userName: currentUser, content })
    });
    const data = await res.json();
    if (data.success) {
      fetchComments(1);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchComments(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const saveName = () => {
    if (nameInput.trim()) {
      currentUser = nameInput.trim();
      setUserName(nameInput.trim());
    }
    setEditingName(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        maxWidth: 600, margin: "0 auto", padding: "0 0 80px",
        fontFamily: "'DM Sans', sans-serif", background: "#fff", minHeight: "100vh"
      }}>

        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "#fff", borderBottom: "1px solid #efefef",
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{ width: 28, height: 28, cursor: "pointer" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>Comments</span>
          <span style={{
            marginLeft: "auto", fontSize: 13, color: "#999", cursor: "pointer"
          }}
            onClick={() => setEditingName(true)}
          >
            Posting as <span style={{ color: "#0095F6", fontWeight: 600 }}>{userName}</span>
          </span>
        </div>

        {editingName && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#fff", borderRadius: 16, padding: 24,
              width: 300, boxShadow: "0 8px 40px rgba(0,0,0,0.15)"
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#111" }}>
                Set your username
              </div>
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveName()}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  border: "1.5px solid #ddd", fontSize: 15, outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                  marginBottom: 12
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setEditingName(false)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #ddd",
                    background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", color: "#666"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveName}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10, border: "none",
                    background: "#0095F6", color: "#fff", fontSize: 14,
                    cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: "16px 16px 0" }}>
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f0f0f0" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 14, width: "40%", background: "#f0f0f0", borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 14, width: "80%", background: "#f0f0f0", borderRadius: 6 }} />
                </div>
              </div>
            ))
          ) : comments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>No comments yet</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>Be the first to comment</div>
            </div>
          ) : (
            <>
              {comments.map(comment => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReplyAdded={() => fetchComments(1)}
                />
              ))}

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    width: "100%", padding: "12px", background: "none",
                    border: "1px solid #efefef", borderRadius: 12,
                    fontSize: 14, fontWeight: 600, color: "#0095F6",
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 16
                  }}
                >
                  {loadingMore ? "Loading..." : "Load more comments"}
                </button>
              )}
            </>
          )}
        </div>

        <div ref={bottomRef} />

        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 600, background: "#fff",
          borderTop: "1px solid #efefef", padding: "10px 16px 16px",
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <Avatar name={userName} size={34} />
            <div style={{ flex: 1 }}>
              <ReplyInput
                onSubmit={handleCommentPost}
                placeholder="Add a comment..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}