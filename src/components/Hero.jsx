import React from "react";
import HeroBus from "./HeroBus"; 
import Navbar from "./Navbar"; 
import Footer from "./Footer"; 
import SearchBooking from "./SearchBooking"; 
import "./Hero.css"; 

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Navbar */}
      <Navbar />
      
      {/* Bus animation */}
      <HeroBus />
      
      {/* Search Booking Form */}
      <SearchBooking />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Hero;
