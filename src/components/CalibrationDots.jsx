import React, { useState } from 'react';
import { useEyeTracker } from '../context/EyeTrackerContext';
import './CalibrationDots.css';

const CLICKS_PER_POINT = 3; // 정확도 향상을 위해 포인트당 3회 클릭

const points = [
    { x: '50%', y: '50%', label: '화면 중앙' },
    { x: '10%', y: '10%', label: '좌측 상단' },
    { x: '90%', y: '10%', label: '우측 상단' },
    { x: '90%', y: '90%', label: '우측 하단' },
    { x: '10%', y: '90%', label: '좌측 하단' },
    { x: '50%', y: '10%', label: '상단 중앙' },
    { x: '90%', y: '50%', label: '우측 중앙' },
    { x: '50%', y: '90%', label: '하단 중앙' },
    { x: '10%', y: '50%', label: '좌측 중앙' },
];

const CalibrationDots = ({ onComplete }) => {
    const { addLog } = useEyeTracker();
    const [step, setStep] = useState(0);
    const [clickCount, setClickCount] = useState(0);

    const handlePointClick = (e) => {
        e.stopPropagation();
        if (addLog) addLog(`Calibrate: ${step + 1}/9 (${clickCount + 1}/${CLICKS_PER_POINT})`);

        if (window.webgazer) {
            try {
                window.webgazer.recordScreenPosition(e.clientX, e.clientY, 'click');
            } catch (err) {
                console.error('Calibration Record Failed:', err);
            }
        }

        const nextClick = clickCount + 1;

        if (nextClick < CLICKS_PER_POINT) {
            setClickCount(nextClick);
        } else {
            setClickCount(0);
            if (step < points.length - 1) {
                setStep(step + 1);
            } else {
                if (addLog) addLog('Calibration Complete');
                onComplete();
            }
        }
    };

    const currentPoint = points[step];
    const totalSteps = points.length;
    const progress = ((step * CLICKS_PER_POINT + clickCount) / (totalSteps * CLICKS_PER_POINT)) * 100;

    return (
        <div className="calibration-overlay">
            {/* 상단 안내 패널 */}
            <div className="calibration-header">
                <div className="calibration-title">아이트래킹 캘리브레이션</div>
                <div className="calibration-subtitle">
                    붉은 점을 응시하며 <strong>{CLICKS_PER_POINT}번</strong> 클릭해주세요
                </div>
                <div className="calibration-progress-bar">
                    <div
                        className="calibration-progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="calibration-step-label">
                    {step + 1} / {totalSteps} — {currentPoint.label}
                </div>
            </div>

            {/* 캘리브레이션 도트 */}
            <div
                className="calibration-dot"
                style={{
                    position: 'absolute',
                    left: currentPoint.x,
                    top: currentPoint.y,
                    transform: 'translate(-50%, -50%)',
                }}
                onClick={handlePointClick}
            >
                {/* 클릭 횟수 표시 */}
                <div className="click-indicators">
                    {Array.from({ length: CLICKS_PER_POINT }).map((_, i) => (
                        <span key={i} className={`click-pip ${i < clickCount ? 'filled' : ''}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalibrationDots;
