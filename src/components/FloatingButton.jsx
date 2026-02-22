import React from 'react';
import './FloatingButton.css';

const FloatingButton = () => {
  return (
    <button className="floating-btn" aria-label="쉬운 말로 읽기모드">
      <span className="btn-icon">✨</span>
      <span className="btn-text">쉬운 말로 읽기</span>
    </button>
  );
};

export default FloatingButton;
