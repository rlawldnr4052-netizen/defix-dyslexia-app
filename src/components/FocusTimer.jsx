import React, { useState, useEffect } from 'react';
import './FocusTimer.css';

const FocusTimer = () => {
    // Default 5 minutes (300 seconds)
    const initialTime = 300;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer = null;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
            setIsActive(false);
            // Optional: Play a sound or show a notification when time is up
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress for a circular indicator or progress bar if desired
    const progress = ((initialTime - timeLeft) / initialTime) * 100;

    return (
        <div className={`focus-timer-container ${isActive ? 'active' : ''}`}>
            <div className="timer-display">
                <span className="timer-icon">⏱️</span>
                <span className="time-text">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="timer-controls">
                <button 
                    className={`control-btn ${isActive ? 'pause' : 'play'}`} 
                    onClick={toggleTimer}
                    title={isActive ? "일시정지" : "시작"}
                >
                    {isActive ? (
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>
                <button 
                    className="control-btn reset" 
                    onClick={resetTimer}
                    title="초기화"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                </button>
            </div>
            {/* Optional Progress Bar 
            <div className="timer-progress-bar" style={{ width: `${progress}%` }}></div>
            */}
        </div>
    );
};

export default FocusTimer;
