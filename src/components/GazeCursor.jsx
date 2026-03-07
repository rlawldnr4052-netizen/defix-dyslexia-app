import React from 'react';
import { useEyeTracker } from '../context/EyeTrackerContext';

const GazeCursor = () => {
    const { gaze, isActive, isCalibrating } = useEyeTracker();


    // Continuous Scroll Logic (Frame-based for smoothness)
    // 스크롤 구간: 상단 20% / 하단 20% (중간 60%는 안전 구간 - 읽기에 적합)
    React.useEffect(() => {
        if (!isActive || isCalibrating) return;

        let animationFrameId;

        const scrollLoop = () => {
            const screenH = window.innerHeight;
            const scrollThresholdBottom = screenH * 0.80; // 하단 20% 진입 시 아래로 스크롤
            const scrollThresholdTop = screenH * 0.20;    // 상단 20% 진입 시 위로 스크롤
            const baseSpeed = 2; // 속도 완화 (기존 4)

            if (gaze.y > scrollThresholdBottom) {
                // Scroll Down - 구간 내 깊이에 비례한 속도
                const ratio = (gaze.y - scrollThresholdBottom) / (screenH - scrollThresholdBottom);
                const speed = baseSpeed + (ratio * 10); // max 12px/frame (기존 19)
                window.scrollBy(0, speed);
            } else if (gaze.y < scrollThresholdTop) {
                // Scroll Up
                const ratio = (scrollThresholdTop - gaze.y) / scrollThresholdTop;
                const speed = -(baseSpeed + (ratio * 10));
                window.scrollBy(0, speed);
            }

            animationFrameId = requestAnimationFrame(scrollLoop);
        };

        // Start Loop
        animationFrameId = requestAnimationFrame(scrollLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [gaze.y, isActive, isCalibrating]);

    if (!isActive) return null;

    // MODE 1: CALIBRATION (RED DOT)
    if (isCalibrating) {
        return (
            <div
                style={{
                    position: 'fixed',
                    left: gaze.x,
                    top: gaze.y,
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#FF0000',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 999999, // Above calibration overlay
                    boxShadow: '0 0 15px rgba(255, 0, 0, 0.8)',
                    border: '2px solid white',
                    transition: 'all 0.1s ease-out' // Smooth dot
                }}
            />
        );
    }

    // MODE 2: READING (YELLOW RULER)
    return (
        <div
            style={{
                position: 'fixed',
                top: gaze.y,
                left: 0,
                width: '100vw', // Fixed Full Width
                height: '40px',
                background: 'linear-gradient(90deg, rgba(255, 235, 59, 0.1) 0%, rgba(255, 235, 59, 0.25) 50%, rgba(255, 235, 59, 0.1) 100%)', // Softer gradient
                borderTop: '1px solid rgba(255, 215, 0, 0.2)', // More subtle border
                borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translateY(-50%)', // Center vertically
                transition: 'top 0.4s cubic-bezier(0.25, 1, 0.5, 1)', // "Floating" physics
                mixBlendMode: 'multiply' 
            }}
        />
    );
};

export default GazeCursor;
