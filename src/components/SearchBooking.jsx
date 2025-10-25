import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SearchBooking.css";

const SearchBooking = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await fetch(`/bus/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.message && data.message.includes("No buses found")) {
        setError("No buses found for your search criteria");
      } else {
        setSearchResults(data);
        console.log("Search results:", data);
      }
    } catch (err) {
      console.error("Error searching buses:", err);
      setError("Failed to search buses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-booking-container">
      <div className="search-card">
        <div className="search-header">
          <h2>Find Your Bus</h2>
          <p>Book tickets in just a few clicks</p>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="from">From</label>
              <div className="input-wrapper">
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  id="from"
                  placeholder="Enter departure city"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="to">To</label>
              <div className="input-wrapper">
                <span className="input-icon">🎯</span>
                <input
                  type="text"
                  id="to"
                  placeholder="Enter destination city"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="search-btn" disabled={loading}>
              <span className="btn-icon">🔍</span>
              {loading ? "Searching..." : "Search Bus"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching for buses...</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Available Buses ({searchResults.length})</h3>
            <div className="bus-list">
              {searchResults.map((bus, index) => (
                <div key={index} className="bus-card">
                  <div className="bus-info">
                    <h4>{bus.busName}</h4>
                    <p className="bus-type">{bus.busType}</p>
                  </div>
                  <div className="bus-route">
                    <div className="route-point">
                      <strong>{bus.source}</strong>
                      <span>{bus.departureTime}</span>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="route-point">
                      <strong>{bus.destination}</strong>
                      <span>{bus.arrivalTime}</span>
                    </div>
                  </div>
                  <div className="bus-details">
                    <div className="price">₹{bus.price}</div>
                    <div className="seats">{bus.seatsAvailable} seats left</div>
                  </div>
                  <Link to={`/book-seat?busId=${bus._id}`} className="book-btn">
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="search-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Instant Booking</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💰</span>
            <span>Best Prices</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🛡️</span>
            <span>Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBooking;
