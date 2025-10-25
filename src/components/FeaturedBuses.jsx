import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FeaturedBuses.css";

const FeaturedBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch("http://localhost:3000/bus/all");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Take first 6 buses for featured section
        setBuses(data.slice(0, 6));
      } catch (err) {
        console.error("Error fetching buses:", err);
        setError("Failed to load buses");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const getBusImage = (busType) => {
    const busImages = {
      "AC Sleeper": "https://images.unsplash.com/photo-1570125479562-d139d12bdcb8?w=400&h=250&fit=crop",
      "AC Semi-Sleeper": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop",
      "Volvo": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
      "Mini": "https://images.unsplash.com/photo-1544620347-c4fd4a1d5957?w=400&h=250&fit=crop",
      "Shuttle": "https://images.unsplash.com/photo-1570125479562-d139d12bdcb8?w=400&h=250&fit=crop",
      "default": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop"
    };
    
    return busImages[busType] || busImages.default;
  };

  if (loading) {
    return (
      <div className="featured-buses">
        <div className="container">
          <h2>Featured Buses</h2>
          <div className="loading-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bus-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-buses">
        <div className="container">
          <h2>Featured Buses</h2>
          <div className="error-message">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-buses">
      <div className="container">
        <div className="section-header">
          <h2>Featured Buses</h2>
          <p>Popular routes and trusted operators</p>
        </div>
        
        <div className="buses-grid">
          {buses.map((bus) => (
            <div key={bus._id} className="featured-bus-card">
              <div className="bus-image">
                <img 
                  src={getBusImage(bus.busType)} 
                  alt={`${bus.busType} Bus`}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop";
                  }}
                />
                <div className="bus-type-badge">
                  {bus.busType}
                </div>
              </div>
              
              <div className="bus-content">
                <h3>{bus.busName}</h3>
                
                <div className="bus-route">
                  <div className="route-point">
                    <span className="city">{bus.source}</span>
                    <span className="time">{bus.departureTime}</span>
                  </div>
                  <div className="route-arrow">→</div>
                  <div className="route-point">
                    <span className="city">{bus.destination}</span>
                    <span className="time">{bus.arrivalTime}</span>
                  </div>
                </div>
                
                <div className="bus-details">
                  <div className="detail-item">
                    <span className="label">Date</span>
                    <span className="value">{new Date(bus.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Price</span>
                    <span className="value price">₹{bus.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Seats</span>
                    <span className="value seats">{bus.seatsAvailable} left</span>
                  </div>
                </div>
                
                <Link 
                  to={`/book-seat?busId=${bus._id}`} 
                  className="book-now-btn"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {buses.length === 0 && (
          <div className="no-buses">
            <p>No buses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedBuses;
