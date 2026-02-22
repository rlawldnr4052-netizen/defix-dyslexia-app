import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ReadingRuler.css';

const ReadingRuler = ({ active }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for performance
      requestAnimationFrame(() => {
          setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active]);

  if (!active) return null;

  // Render outside of main app flow to ensure top z-index and fixed positioning
  return createPortal(
    <div 
      className="reading-ruler" 
      style={{ 
        top: position.y 
      }}
    >
        <div className="ruler-highlight"></div>
    </div>,
    document.body
  );
};

export default ReadingRuler;
