import React, { useState } from 'react';

const AISummary = ({ points }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!points || points.length === 0) return null;

  return (
    <div className="ai-summary-container">
      <div 
        className={`ai-header ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="ai-title-group">
          <div className="ai-icon-pulse">✨</div>
          <span className="ai-label">AI 3줄 요약</span>
        </div>
        <button className={`ai-arrow ${isOpen ? 'rotated' : ''}`}>
          ▼
        </button>
      </div>

      <div className={`ai-content-wrapper ${isOpen ? 'expanded' : ''}`}>
        <div className="ai-content-inner">
          {points.map((point, index) => (
            <div key={index} className="ai-point">
              <span className="ai-number">{index + 1}</span>
              <p className="ai-text">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISummary;
