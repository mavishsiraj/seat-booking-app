import React, { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";

const AuthPage = ({ mode: initialMode = "login" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);

  // Pre-fill email if redirected from "user exists"
  const params = new URLSearchParams(location.search);
  const prefillEmail = params.get("email") || "";

  const handleAuth = (data, authMode, email = "") => {
    if (authMode === "register") {
      alert("Registration successful! Please log in.");
      setMode("login");
    } else if (authMode === "login") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Dispatch custom event to update Navbar
      window.dispatchEvent(new Event("authChange"));

      alert("Login successful!");

      const redirectUrl = localStorage.getItem("redirectAfterLogin");

      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-container">
        <AuthForm
          mode={mode}
          onAuth={handleAuth}
          prefillEmail={prefillEmail}
        />

        <div className="toggle-auth">
          {mode === "login" ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="toggle-link"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="toggle-link">
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
