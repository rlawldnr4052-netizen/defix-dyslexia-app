import React from 'react';

const GazeRuler = ({ active, y, x }) => {
  if (!active) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: y,
        left: x,
        width: '12px',
        height: '12px',
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2147483647, /* Max Z-Index */
        boxShadow: '0 0 15px rgba(255,0,0,0.8)',
        border: '2px solid rgba(255,255,255,0.8)',
        transition: 'top 0.1s linear, left 0.1s linear' // Smooth move
      }}
    />
  );
};

export default GazeRuler;
