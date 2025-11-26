"use client";

import React from "react";

interface AnimatedBackgroundProps {
  variant?: "gradient" | "orbs" | "particles";
  className?: string;
}

export default function AnimatedBackground({ 
  variant = "orbs", 
  className = "" 
}: AnimatedBackgroundProps) {
  
  if (variant === "gradient") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-royal-900/20 via-navy-900/20 to-royal-800/20 animate-gradient-shift"></div>
      </div>
    );
  }

  if (variant === "particles") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-royal-400/30 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    );
  }

  // Default: floating orbs
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large orb - top right */}
      <div 
        className="absolute w-96 h-96 bg-royal-500/10 rounded-full blur-3xl animate-float-slow"
        style={{ top: '-10%', right: '-5%' }}
      ></div>
      
      {/* Medium orb - bottom left */}
      <div 
        className="absolute w-72 h-72 bg-navy-500/10 rounded-full blur-3xl animate-float-medium"
        style={{ bottom: '-10%', left: '-5%' }}
      ></div>
      
      {/* Small orb - center */}
      <div 
        className="absolute w-48 h-48 bg-royal-400/10 rounded-full blur-2xl animate-float-fast"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      ></div>
      
      {/* Extra small orbs */}
      <div 
        className="absolute w-32 h-32 bg-navy-400/10 rounded-full blur-xl animate-float-slow"
        style={{ top: '20%', left: '20%', animationDelay: '2s' }}
      ></div>
      
      <div 
        className="absolute w-40 h-40 bg-royal-300/10 rounded-full blur-2xl animate-float-medium"
        style={{ bottom: '30%', right: '15%', animationDelay: '1s' }}
      ></div>
    </div>
  );
}
