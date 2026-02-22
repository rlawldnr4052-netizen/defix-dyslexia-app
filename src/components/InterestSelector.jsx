import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InterestSelector.css';

const interests = [
  '경제/금융', '인문학', 'IT/기술', '예술',
  '과학', '자기계발', '건강', '역사'
];

const InterestSelector = ({ onComplete }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    setSelected(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleStartReading = () => {
    onComplete(selected);
    navigate('/reader');
  };

  return (
    <div className="interest-container fade-enter">
      <div className="interest-card">
        <h2>어떤 글을 읽고 싶으신가요?</h2>
        <p>관심사를 선택하면 맞춤형 지문을 준비해드릴게요.</p>

        <div className="chip-grid">
          {interests.map(item => (
            <button
              key={item}
              className={`chip ${selected.includes(item) ? 'selected' : ''}`}
              onClick={() => toggleInterest(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="confirm-btn"
          disabled={selected.length === 0}
          onClick={handleStartReading}
        >
          독서 시작하기
        </button>
      </div>
    </div>
  );
};

export default InterestSelector;
