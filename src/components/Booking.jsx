import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ Token check with redirect URL saved
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Save the current URL so we can redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLogin", currentPath);

      setTimeout(() => {
        alert("Please log in to continue booking seats.");
        navigate("/login");
      }, 100);
    }
  }, [navigate]);



  const busId = new URLSearchParams(location.search).get("busId");

  // ✅ Fetch bus details only if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!busId) {
      setError("No bus selected");
      setLoading(false);
      return;
    }

    const fetchBusDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/bus/${busId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBus(data);
      } catch (err) {
        console.error("Error fetching bus details:", err);
        setError("Failed to load bus details");
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Save redirect URL before going to login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLogin", currentPath);

      alert("Please log in or register before booking a seat!");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          busId: busId,
          seats: selectedSeats,
          totalAmount: selectedSeats.length * bus.price,
        }),
      });

      if (response.status === 401) {
        // Save redirect URL
        const currentPath = window.location.pathname + window.location.search;
        localStorage.setItem("redirectAfterLogin", currentPath);

        alert("Your session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      await response.json();
      setBookingSuccess(true);
      setError("");
    } catch (err) {
      console.error("Error booking seats:", err);
      setError("Failed to book seats. Please try again.");
    }
  };


  if (loading) {
    return (
      <div className="booking-container">
        <p>Loading bus details...</p>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="booking-container">
        <div className="error-message">{error || "Bus not found"}</div>
        <button onClick={() => navigate("/")} className="back-btn">
          ← Back to Home
        </button>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-container">
        <div className="success-message">
          <h2>🎉 Booking Successful!</h2>
          <p>Seats booked: {selectedSeats.join(", ")}</p>
          <button onClick={() => navigate("/")} className="back-btn">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const generateSeats = () => {
    const seats = [];
    const rows = 10;
    const seatsPerRow = 4;
    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${String.fromCharCode(64 + row)}${seat}`;
        const isBooked = bus.bookedSeats?.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        seats.push({ number: seatNumber, isBooked, isSelected });
      }
    }
    return seats;
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>{bus.busName}</h2>
        <div className="seat-grid">
          {generateSeats().map((seat) => (
            <div
              key={seat.number}
              className={`seat ${seat.isBooked ? "booked" : seat.isSelected ? "selected" : "available"}`}
              onClick={() => !seat.isBooked && handleSeatClick(seat.number)}
            >
              {seat.number}
            </div>
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleBooking} className="book-btn">
          Book Seats ({selectedSeats.length})
        </button>
      </div>
    </div>
  );
};

export default Booking;
