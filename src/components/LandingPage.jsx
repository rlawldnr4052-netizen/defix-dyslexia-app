import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = ({ user, onOpenAuth, onLogout }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index) => {
    if (sectionsRef.current[index]) {
      sectionsRef.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStart = () => {
    if (user) navigate('/interest');
    else navigate('/diagnosis');
  };

  return (
    <div className="cosmos-container">
      {/* Auth Navigation */}
      <nav className="landing-auth-nav">
        {user ? (
          <>
            <span style={{ fontWeight: 600, color: '#000' }}>반갑습니다, {user.name}님</span>
            <button className="auth-link" onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button className="auth-link" onClick={onOpenAuth}>로그인</button>
            <button className="auth-btn" onClick={onOpenAuth}>회원가입</button>
          </>
        )}
      </nav>

      {/* 01. Hero Section */}
      <section
        className="cosmos-section snap-area"
        data-index="0"
        ref={el => sectionsRef.current[0] = el}
      >
        <div className="card-content hero-content">
          <div className="micro-label">01 Start Line</div>
          <h1 className="cosmos-hero-title">
            <span className="bold-first">당</span>신의 <br />
            <span className="bold-first">읽</span>는 <br />
            <span className="bold-first">뇌</span>를 <br />
            <span className="bold-first">깨</span>우세요
          </h1>
          <div className="scroll-indicator" onClick={() => scrollToSection(1)}>
            <span>Scroll</span>
            <div className="line"></div>
          </div>
        </div>
      </section>

      {/* 02. Feature 1 - Detox */}
      <section
        className="cosmos-section snap-area"
        data-index="1"
        ref={el => sectionsRef.current[1] = el}
      >
        <div className="card-content feature-content" style={{
          opacity: activeSection >= 1 ? 1 : 0,
          transform: `translateY(${activeSection >= 1 ? 0 : '50px'}) scale(${activeSection >= 1 ? 1 : 0.95})`
        }}>
          <div className="micro-label">02 Detox</div>
          <h2>
            <span className="bold-first">도</span>파민 <br />
            <span className="bold-first">디</span>톡스
          </h2>
          <p>쇼츠에 절여진 뇌가 다시 숨을 쉽니다.</p>
        </div>
      </section>

      {/* 03. Feature 2 - Bionic */}
      <section
        className="cosmos-section snap-area"
        data-index="2"
        ref={el => sectionsRef.current[2] = el}
      >
        <div className="card-content feature-content" style={{
          opacity: activeSection >= 2 ? 1 : 0,
          transform: `translateY(${activeSection >= 2 ? 0 : '50px'}) scale(${activeSection >= 2 ? 1 : 0.95})`
        }}>
          <div className="micro-label">03 Bionic Reading</div>
          <h2>
            <span className="bold-first">바</span>이오닉 <br />
            <span className="bold-first">리</span>딩
          </h2>
          <p>눈이 아닌 뇌로 읽는 압도적 몰입감.</p>
        </div>
      </section>

      {/* 04. Final CTA */}
      <section
        className="cosmos-section snap-area"
        data-index="3"
        ref={el => sectionsRef.current[3] = el}
      >
        <div className="card-content cta-content" style={{
          opacity: activeSection >= 3 ? 1 : 0,
          transform: `translateY(${activeSection >= 3 ? 0 : '50px'}) scale(${activeSection >= 3 ? 1 : 0.95})`
        }}>
          <div className="micro-label">04 Ready?</div>
          <h2><span className="bold-first">지</span>금 바로<br />시작하세요</h2>
          <button className="cosmos-btn" onClick={handleStart}>
            내 읽기 능력 진단하기
          </button>
        </div>
      </section>

      <div className="progress-bar">
        <div className="progress-fill" style={{ height: `${(activeSection + 1) * 25}%` }}></div>
      </div>
    </div>
  );
};

export default LandingPage;
