import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEyeTracker } from '../context/EyeTrackerContext';
import './ReadingRuler.css';

const ReadingRuler = ({ active }) => {
  const { gaze, isCalibrating } = useEyeTracker();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // When active, position the ruler exactly where the webcam gaze is currently pointing
  useEffect(() => {
    if (!active || isCalibrating) return;

    // Use the true gaze position from context instead of mouse
    if (gaze && gaze.y) {
      // Use requestAnimationFrame for smooth repositioning
      requestAnimationFrame(() => {
        setPosition({ x: gaze.x, y: gaze.y });
      });
    }
  }, [active, gaze, isCalibrating]);

  if (!active) return null;

  // Render outside of main app flow to ensure top z-index and fixed positioning
  return createPortal(
    <div
      className="reading-ruler"
      style={{
        top: position.y
      }}
    >
      <div className="ruler-highlight"></div>
    </div>,
    document.body
  );
};

export default ReadingRuler;
