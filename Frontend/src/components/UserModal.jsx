import { useState } from "react";
import "../styles/components.css";

export default function UserNameModal({ currentUser, onSave, onClose }) {
  const [input, setInput] = useState(currentUser);

  const handleSave = () => {
    if (input.trim()) { onSave(input.trim()); onClose(); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">
          Set your username
        </div>
        <div className="modal-subtitle">
          This will show on your comments
        </div>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onClose(); }}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button
            onClick={onClose}
            className="modal-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="modal-btn-save"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}