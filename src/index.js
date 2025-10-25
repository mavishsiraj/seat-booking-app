import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import SeatBooking from "./components/SeatBooking";
import Booking from "./components/Booking";
import AdminPanel from "./components/AdminPanel";
import AuthForm from "./components/AuthForm";

const container = document.getElementById("root");
const root = createRoot(container);


function AuthPage({ mode }) {
  // Save JWT to localStorage and redirect on success
  const onAuth = (data) => {
    localStorage.setItem("token", data.token);
    window.location.href = "/";
  };
  return <AuthForm mode={mode} onAuth={onAuth} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/booking" element={<SeatBooking />} />
        <Route path="/book-seat" element={<Booking />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Routes>
    </Router>
  );
}

root.render(<App />);