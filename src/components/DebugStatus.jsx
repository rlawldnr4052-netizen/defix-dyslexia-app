import React from 'react';
import { useEyeTracker } from '../context/EyeTrackerContext';

const DebugStatus = () => {
    const { isActive, isCalibrating, gaze, isLoading, lastError, scriptStatus, logs } = useEyeTracker();
    
    // ALWAYS RENDER
    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.9)',
            color: '#00FF00',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            zIndex: 2147483647,
            pointerEvents: 'none',
            border: '2px solid #00FF00',
            maxWidth: '300px'
        }}>
            <div style={{ borderBottom: '1px solid #333', marginBottom: '5px', paddingBottom: '5px' }}>
                DEBUG PANEL (v32)
            </div>
            <div>STATUS: {isActive ? '🟢 ACTIVE' : '🔴 INACTIVE'}</div>
            <div>LOADING: {isLoading ? '⏳ YES' : 'NO'}</div>
            <div>SCRIPT: {scriptStatus || 'unknown'}</div>
            <div>MODE: {isCalibrating ? '🎯 CALIBRATION' : '👀 TRACKING'}</div>
            <div>X: {Math.round(gaze.x)}</div>
            <div>Y: {Math.round(gaze.y)}</div>
            
            <div style={{ marginTop: '10px', borderTop: '1px solid #333', paddingTop: '5px', fontSize: '11px', color: '#AAA' }}>
                {logs && logs.map((log, i) => (
                    <div key={i}>&gt; {log}</div>
                ))}
            </div>

            {lastError && (
                <div style={{ color: 'red', marginTop: '5px', fontWeight: 'bold' }}>
                    ERR: {lastError}
                </div>
            )}
        </div>
    );
};

export default DebugStatus;
