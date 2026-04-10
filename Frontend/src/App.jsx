import { useState } from "react";
import PostCard from "./components/PostCard";
import CommentList from "./components/CommentList";
import CommentInput from "./components/CommentInput";
import UserNameModal from "./components/UserModal";
import Avatar from "./components/Avatar";
import { useComments } from "./hooks/useComment";
import "./styles/components.css";

const POST_ID = "post_123";

export default function App() {
  const [currentUser, setCurrentUser] = useState("You");
  const [showModal, setShowModal] = useState(false);
  const { comments, loading, loadingMore, hasMore, loadMore, addComment } = useComments(POST_ID);

  const handlePost = async (content) => {
    await addComment(currentUser, content);
  };

  return (
    <div className="app-container">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {showModal && (
        <UserNameModal
          currentUser={currentUser}
          onSave={setCurrentUser}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="app-header">
        <svg 
          className="app-header-back-icon"
          viewBox="0 0 24 24" 
          fill="none"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        <span className="app-header-title">Comments</span>
        <button
          onClick={() => setShowModal(true)}
          className="app-header-user-btn"
        >
          Posting as <span className="app-header-user-name">{currentUser}</span>
        </button>
      </div>

      <PostCard />

      <div className="app-content">
        <CommentList
          comments={comments}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          currentUser={currentUser}
        />
      </div>

      <div className="app-input-footer">
        <div className="app-input-wrapper">
          <Avatar name={currentUser} size={34} />
          <div style={{ flex: 1 }}>
            <CommentInput onSubmit={handlePost} placeholder="Add a comment..." />
          </div>
        </div>
      </div>
    </div>
  );
}