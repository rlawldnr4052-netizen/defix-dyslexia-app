import React from 'react';

const TooltipOverlay = ({ active, x, y, term, definition }) => {
  if (!active || !term) return null;

  // Prevent tooltip from going off-screen
  const safeX = Math.min(Math.max(x, 20), window.innerWidth - 320);
  const safeY = y + 40 > window.innerHeight ? y - 100 : y + 40;

  return (
    <div style={{
      position: 'fixed',
      left: safeX,
      top: safeY,
      backgroundColor: 'rgba(33, 33, 33, 0.95)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '16px',
      maxWidth: '300px',
      zIndex: 10000,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <h4 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '1.1rem', 
        color: '#FFD700',
        fontWeight: 'bold'
      }}>
        {term}
      </h4>
      <p style={{ 
        margin: 0, 
        fontSize: '0.95rem', 
        lineHeight: '1.5', 
        color: '#eee' 
      }}>
        {definition}
      </p>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TooltipOverlay;
