import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diagnosis.css';

const questions = [
  {
    id: 1,
    text: '안녕하세요 반갑습니당',
    typo: '당',
    correct: '다',
    hasTypo: true,
  },
  {
    id: 2,
    text: '오늘 날씨가 정말 좃네요',
    typo: '좃',
    correct: '좋',
    hasTypo: true,
  },
  {
    id: 3,
    text: '집중력이 필요할 땐 디픽스',
    typo: null,
    correct: null,
    hasTypo: false, // 오타 없는 문장 (함정 문제)
  },
];

const LEVELS = [
  { label: '입문자', emoji: '🌱', desc: '빠른 텍스트에 적응 중이에요. 바이오닉 리딩이 도움이 될 거예요!' },
  { label: '성장 중', emoji: '🔥', desc: '집중력이 발전하고 있어요. 조금 더 연습하면 훨씬 좋아질 거예요.' },
  { label: '집중력 강함', emoji: '⚡', desc: '훌륭해요! 빠른 텍스트도 잘 파악하는 편이에요.' },
];

const Diagnosis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleTypoClick = () => {
    const q = questions[step];
    // 오타 있는 문장에서 클릭하면 정답
    if (q.hasTypo) {
      setScore(prev => prev + 1);
    }
    advance(q.hasTypo ? score + 1 : score);
  };

  const handleNoTypoClick = () => {
    const q = questions[step];
    // 오타 없는 문장에서 "오타 없음" 선택하면 정답
    if (!q.hasTypo) {
      setScore(prev => prev + 1);
      advance(score + 1);
    } else {
      advance(score);
    }
  };

  const advance = (currentScore) => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinalScore(currentScore);
      setDone(true);
    }
  };

  const getLevel = (s) => {
    if (s === 0) return LEVELS[0];
    if (s === 1) return LEVELS[1];
    return LEVELS[2];
  };

  if (done) {
    const level = getLevel(finalScore);
    return (
      <div className="diagnosis-container fade-enter">
        <div className="diagnosis-card result-card">
          <div className="result-emoji">{level.emoji}</div>
          <div className="micro-label">진단 결과</div>
          <h2 className="result-level">{level.label}</h2>
          <p className="result-desc">{level.desc}</p>
          <div className="result-score">
            {finalScore} / {questions.length} 정답
          </div>
          <button
            className="start-btn"
            onClick={() => navigate('/interest')}
          >
            맞춤 독서 시작하기 →
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="diagnosis-container fade-enter">
      <div className="diagnosis-card">
        <div className="micro-label">DIAGNOSIS 0{step + 1} / 0{questions.length}</div>

        <h2 className="test-sentence">
          {step === 0 && '다음 문장에서 오타를 찾아 클릭하세요.'}
          {step === 1 && '속독으로 읽어도 글자가 보이나요?'}
          {step === 2 && '이번 문장에 오타가 있나요?'}
        </h2>

        <div className="typo-game-area">
          {step === 0 && (
            <span className="game-text">
              안녕하세요 반갑습니<span className="typo-highlight" onClick={handleTypoClick}>당</span>
            </span>
          )}
          {step === 1 && (
            <span className="game-text">
              오늘 날씨가 정말 <span className="typo-highlight" onClick={handleTypoClick}>좃</span>네요
            </span>
          )}
          {step === 2 && (
            <span className="game-text">집중력이 필요할 땐 디픽스</span>
          )}
        </div>

        {/* 오타 없음 선택지 (마지막 함정 문제에서 중요) */}
        <div className="diagnosis-actions">
          {q.hasTypo ? (
            <p className="instruction-text">* 오타 글자를 직접 클릭하세요</p>
          ) : (
            <>
              <p className="instruction-text">* 오타가 있나요?</p>
              <div className="action-buttons">
                <button className="action-btn typo-btn" onClick={handleTypoClick}>오타 있음</button>
                <button className="action-btn ok-btn" onClick={handleNoTypoClick}>오타 없음 ✓</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
