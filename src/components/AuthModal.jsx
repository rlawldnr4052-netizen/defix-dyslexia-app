import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, checkLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
        setIsLoading(false);
        const mockUser = {
            id: 'user_123',
            name: mode === 'signup' ? name : '김지욱', // Default name for login
            email: email,
            avatar: 'https://ui-avatars.com/api/?name=' + (mode === 'signup' ? name : '김지욱') + '&background=000&color=fff'
        };
        
        checkLogin(mockUser);
        onClose();
    }, 1500);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>&times;</button>
        
        <div className="auth-header">
            <h2 className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                로그인
            </h2>
            <h2 className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
                회원가입
            </h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
                <div className="form-group">
                    <label>이름</label>
                    <input 
                        type="text" 
                        placeholder="이름을 입력하세요" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>
            )}
            
            <div className="form-group">
                <label>이메일</label>
                <input 
                    type="email" 
                    placeholder="example@defix.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>

            <div className="form-group">
                <label>비밀번호</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                    <span className="spinner"></span>
                ) : (
                    mode === 'login' ? '로그인하기' : '회원가입하기'
                )}
            </button>
        </form>
        
        <div className="auth-footer">
            {mode === 'login' ? (
                <p>계정이 없으신가요? <span onClick={() => setMode('signup')}>생성하기</span></p>
            ) : (
                <p>이미 계정이 있으신가요? <span onClick={() => setMode('login')}>로그인</span></p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
