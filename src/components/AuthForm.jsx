import React, { useState, useEffect } from "react";

const AuthForm = ({ mode, onAuth, prefillEmail }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(mode === "login");

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  useEffect(() => {
    setEmail(prefillEmail || "");
  }, [prefillEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `http://localhost:3001/auth/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isLogin ? { email, password } : { name, email, password }
          ),
        }
      );

      const data = await res.json();

      if (!isLogin && res.status === 400 && data.message?.toLowerCase().includes("exists")) {
        alert("User already exists. Please log in instead.");
        setIsLogin(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isLogin && data.token) {
        onAuth(data, "login");
        return;
      }

      if (!isLogin) {
        onAuth(data, "register");
        setName("");
        setPassword("");
        return;
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">{isLogin ? "Login" : "Register"}</button>

      {error && <div className="error-message">{error}</div>}

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </form>
  );
};

export default AuthForm;
