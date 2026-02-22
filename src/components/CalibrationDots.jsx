import React, { useState } from 'react';
import { useEyeTracker } from '../context/EyeTrackerContext';
import './CalibrationDots.css';

const CalibrationDots = ({ onComplete }) => {
  const { addLog } = useEyeTracker(); // Access Logger
  const [step, setStep] = useState(0);
  
  // 5 Points: Center -> corners
  const points = [
    { x: '50%', y: '50%', label: '🔴 점을 응시하고 클릭하세요 (1/9)' },
    { x: '10%', y: '10%', label: '좌측 상단을 보고 클릭하세요 (2/9)' },
    { x: '90%', y: '10%', label: '우측 상단을 보고 클릭하세요 (3/9)' },
    { x: '90%', y: '90%', label: '우측 하단을 보고 클릭하세요 (4/9)' },
    { x: '10%', y: '90%', label: '좌측 하단을 보고 클릭하세요 (5/9)' },
    { x: '50%', y: '10%', label: '상단 중앙을 보고 클릭하세요 (6/9)' },
    { x: '90%', y: '50%', label: '우측 중앙을 보고 클릭하세요 (7/9)' },
    { x: '50%', y: '90%', label: '하단 중앙을 보고 클릭하세요 (8/9)' },
    { x: '10%', y: '50%', label: '좌측 중앙을 보고 클릭하세요 (9/9)' },
  ];

  const handlePointClick = (e) => {
    // Debug Log
    if (addLog) addLog(`Calibrate Click: ${step + 1}/9`);
    else console.log(`Calibrate Click: ${step + 1}/9`);

    // Record calibration in Webgazer
    if (window.webgazer) {
        try {
            window.webgazer.recordScreenPosition(e.clientX, e.clientY, 'click');
        } catch (err) {
            console.error("Calibration Record Failed:", err);
            if (addLog) addLog(`ERR: Record Failed - ${err.message}`);
        }
    } else {
        if (addLog) addLog("ERR: Webgazer missing");
    }

    // Always advance (Don't block UI on engine error)
    if (step < points.length - 1) {
      setStep(step + 1);
    } else {
      if (addLog) addLog("Calibration Complete");
      onComplete();
    }
  };

  const currentPoint = points[step];

  return (
    <div className="calibration-container" style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0, 0, 0, 0.85)', /* Dark overlay */
        backdropFilter: 'blur(10px)', /* Glass effect */
        zIndex: 2147483647,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <h2 style={{ 
          position: 'absolute', top: '20%', fontSize: '1.8rem',
          color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
         아이트래킹 정확도 설정
      </h2>
      <p style={{ 
          position: 'absolute', top: '25%', 
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.1rem'
      }}>
        붉은 원을 응시하며 클릭해주세요.
      </p>

      <div 
        className="calibration-dot"
        style={{ 
            position: 'absolute', /* Fixed relative to container */
            left: currentPoint.x, 
            top: currentPoint.y,
            width: '30px', height: '30px', background: '#FF4444',
            borderRadius: '50%', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255, 68, 68, 0.6)',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease'
        }}
        onClick={handlePointClick}
      />
      
      <div className="calibration-instruction" style={{
          marginTop: '200px', fontWeight: 'bold'
      }}>
        {currentPoint.label}
      </div>
    </div>
  );
};

export default CalibrationDots;
