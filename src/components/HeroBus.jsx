import React from "react";
import "./Hero.css";

const HeroBus = () => {
  return (
    <div className="hero-stage">
      <svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        {/* Clouds */}
        <g className="clouds" transform="translate(-200,10)">
          <g transform="translate(80,20) scale(0.9)">
            <ellipse cx="80" cy="30" rx="34" ry="18" fill="#fff" />
            <ellipse cx="106" cy="30" rx="26" ry="16" fill="#fff" />
            <ellipse cx="56" cy="30" rx="24" ry="14" fill="#fff" />
          </g>
          <g transform="translate(420,40) scale(1.1)">
            <ellipse cx="80" cy="30" rx="40" ry="20" fill="#fff" />
            <ellipse cx="116" cy="30" rx="30" ry="18" fill="#fff" />
            <ellipse cx="56" cy="30" rx="28" ry="16" fill="#fff" />
          </g>
        </g>

        {/* Road */}
        <rect x="0" y="180" width="1500" height="100" fill="#444" />
        <g className="road-stripes">
          {[...Array(10)].map((_, i) => (
            <rect key={i} x={i * 120} y="205" width="80" height="6" fill="#ffd" rx="3" />
          ))}
        </g>

        {/* Bus + wheels fixed inside bus-body */}
        <g className="bus" transform="translate(0,0)">
          {/* Shadow */}
          <ellipse className="bus-shadow" cx="300" cy="190" rx="120" ry="18" fill="#000" />

          {/* Bus body with wheels inside */}
          <g id="bus-body" transform="translate(160,80) scale(0.9)">
            <rect x="0" y="0" width="520" height="120" rx="18" ry="18" fill="#ff6b00" stroke="#c65200" strokeWidth="4"/>
            
            {/* Windows */}
            <g fill="#fff" opacity="0.95">
              <rect x="20" y="16" width="88" height="60" rx="6"/>
              <rect x="118" y="16" width="88" height="60" rx="6"/>
              <rect x="216" y="16" width="88" height="60" rx="6"/>
              <rect x="314" y="16" width="88" height="60" rx="6"/>
              <rect x="412" y="16" width="88" height="60" rx="6"/>
            </g>

            {/* Door */}
            <rect x="450" y="28" width="48" height="88" rx="6" fill="#e8e8e8"/>

            {/* Headlight */}
            <circle cx="520" cy="62" r="10" fill="#fff9b8" stroke="#ffeb6b" strokeWidth="2"/>

            {/* Wheels fixed: bus ke sath move karenge, separate rotate nahi */}
            <circle cx="80" cy="120" r="22" fill="#222"/>
            <circle cx="80" cy="120" r="10" fill="#999"/>
            <circle cx="400" cy="120" r="22" fill="#222"/>
            <circle cx="400" cy="120" r="10" fill="#999"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default HeroBus;
