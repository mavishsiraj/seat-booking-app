import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      setIsLoggedIn(!!token);
      setUserName(user.name || "User");
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("authChange", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authChange", checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("redirectAfterLogin");
    
    setIsLoggedIn(false);
    setUserName("");
    
    window.dispatchEvent(new Event("authChange"));
    
    alert("Logged out successfully!");
    navigate("/");
  };

  const openLoginModal = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleAuth = (data, mode) => {
    if (mode === "register") {
      alert("Registration successful! Please log in.");
      setAuthMode("login");
    } else if (mode === "login") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setIsLoggedIn(true);
      setUserName(data.user.name);
      
      window.dispatchEvent(new Event("authChange"));
      
      setShowAuthModal(false);
      
      alert("Login successful!");

      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2 onClick={() => navigate("/")}>BusBooking</h2>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <button className="nav-btn home-btn">HOME</button>
          </Link>
          <Link to="/admin" className="nav-link">
            <button className="nav-btn admin-btn">ADMIN</button>
          </Link>
          
          {isLoggedIn ? (
            <>
              <span className="user-greeting">👤 {userName}</span>
              <button onClick={handleLogout} className="nav-btn logout-btn">
                LOGOUT
              </button>
            </>
          ) : (
            <button onClick={openLoginModal} className="nav-btn login-btn">
              LOGIN / SIGNUP
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onAuth={handleAuth}
      />
    </>
  );
};

export default Navbar;
