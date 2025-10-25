import React from "react";
import AuthForm from "./AuthForm";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose, mode, onAuth }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-auth-container">
          <AuthForm mode={mode} onAuth={onAuth} />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
