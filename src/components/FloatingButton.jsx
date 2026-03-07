import React from 'react';
import './FloatingButton.css';

const FloatingButton = ({ isEasyMode, onToggle }) => {
  return (
    <button
      className={`floating-btn ${isEasyMode ? 'active' : ''}`}
      aria-label={isEasyMode ? '원본 모드로 전환' : '쉬운 읽기 모드로 전환'}
      onClick={onToggle}
    >
      <span className="btn-icon">{isEasyMode ? '📖' : '✨'}</span>
      <span className="btn-text">{isEasyMode ? '원본 보기' : '쉬운 읽기'}</span>
    </button>
  );
};

export default FloatingButton;
