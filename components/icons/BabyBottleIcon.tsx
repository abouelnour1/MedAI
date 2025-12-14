
import React from 'react';

const BabyBottleIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-full w-full" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={2}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Nipple (Teat) */}
    <path d="M9 6h6" />
    <path d="M10 6V4.5a2 2 0 1 1 4 0V6" />
    
    {/* Bottle Body */}
    <path d="M8 6h8v11a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4V6z" />
    
    {/* Measurement Lines */}
    <path d="M11 10h2" />
    <path d="M11 13h2" />
    <path d="M11 16h2" />
  </svg>
);

export default BabyBottleIcon;
