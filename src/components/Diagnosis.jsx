import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diagnosis.css';

const questions = [
  {
    id: 1,
    text: "안녕하세요 반갑습니당",
    typo: "당",
    correct: "다"
  },
  {
    id: 2,
    text: "오늘 날씨가 정말 좃네요",
    typo: "좃",
    correct: "좋"
  },
  {
    id: 3,
    text: "집중력이 필요할 땐 디픽스",
    typo: null, // Trick question or just completion
    correct: null
  }
];

const Diagnosis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAction = (isTypoFound) => {
    // Logic: If typo found when exists -> +1 score
    // Simplification for prototype: Just proceed
    if (isTypoFound) setScore(score + 1);

    if (step < 2) {
      setStep(step + 1);
    } else {
      finishDiagnosis();
    }
  };

  const finishDiagnosis = () => {
    const level = "Shorts Addicted (Level 2)";
    // In a real app, calculate based on score/time
    setTimeout(() => {
      alert(`진단 결과: ${level}\n당신에게 딱 맞는 훈련을 시작합니다.`);
      navigate('/interest');
    }, 500);
  };

  return (
    <div className="diagnosis-container fade-enter">
      <div className="diagnosis-card">
        <div className="micro-label">DIAGNOSIS 0{step + 1}</div>

        <h2 className="test-sentence">
          {step === 0 && "다음 문장에서 오타를 찾아 클릭하세요."}
          {step === 1 && "속독으로 읽어도 글자가 보이나요?"}
          {step === 2 && "마지막 확인입니다."}
        </h2>

        <div className="typo-game-area" onClick={() => handleAction(true)}>
          {step === 0 && (
            <span className="game-text">안녕하세요 반갑습니<span className="typo-highlight">당</span></span>
          )}
          {step === 1 && (
            <span className="game-text">오늘 날씨가 정말 <span className="typo-highlight">좃</span>네요</span>
          )}
          {step === 2 && (
            <span className="game-text">집중력이 필요할 땐 <span className="typo-highlight">디</span>픽스</span>
          )}
        </div>

        <p className="instruction-text">
          * 빠르게 흐르는 텍스트라고 상상해보세요.
        </p>

      </div>
    </div>
  );
};

export default Diagnosis;
