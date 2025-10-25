import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./SeatBooking.css";

export default function SeatBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const busId = searchParams.get('busId');

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  
  const totalSeats = bus ? (bus.bookedSeats.length + bus.seatsAvailable) : 30;
  const seatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

  useEffect(() => {
    if (!busId) {
      navigate('/');
      return;
    }

    // Fetch bus details including booked seats
    axios.get(`http://localhost:3001/bus/${busId}`)
      .then(res => {
        setBus(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bus details:", err);
        setMessage("Error loading bus details");
        setLoading(false);
      });
  }, [busId, navigate]);

  const toggleSeatSelection = (seatNum) => {
    if (bus?.bookedSeats?.includes(seatNum)) {
      return; 
    }

    setSelectedSeats(prev => 
      prev.includes(seatNum)
        ? prev.filter(seat => seat !== seatNum)
        : [...prev, seatNum]
    );
  };

  const handleBooking = async () => {
    if (!name) {
      setMessage("Please enter your name");
      return;
    }
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/booking", {
        busId,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * bus.price
      });

      setMessage("Booking successful!");
      setTimeout(() => navigate('/'), 2000); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="app">
      <h2>Seat Booking</h2>
      {loading ? (
        <p>Loading bus details...</p>
      ) : bus ? (
        <>
          <div className="seats">
            {seatNumbers.map(num => {
              const isBooked = bus.bookedSeats.includes(num);
              const isSelected = selectedSeats.includes(num);
              let seatClass = "seat";
              if (isBooked) seatClass += " booked";
              else if (isSelected) seatClass += " selected";
              else seatClass += " available";
              return (
                <div
                  key={num}
                  onClick={() => !isBooked && toggleSeatSelection(num)}
                  className={seatClass}
                  style={{
                    backgroundColor: isBooked
                      ? "#4caf50" // green
                      : isSelected
                        ? "#2196f3" // blue
                        : "#ccc", // grey
                    color: isBooked || isSelected ? "#fff" : "#333",
                    cursor: isBooked ? "not-allowed" : "pointer"
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginTop: 20 }}
          />
          <button onClick={handleBooking} style={{ marginLeft: 10 }}>
            Book Selected Seats
          </button>
          <p>{message}</p>
        </>
      ) : (
        <p>Bus not found.</p>
      )}
    </div>
  );
}