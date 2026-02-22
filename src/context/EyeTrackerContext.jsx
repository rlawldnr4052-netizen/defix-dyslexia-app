import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const EyeTrackerContext = createContext();

export const EyeTrackerProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // UI Loading State
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [lastError, setLastError] = useState(null); // Debug Error
  const [logs, setLogs] = useState([]); // Visual Logs

  const addLog = (msg) => {
      console.log("[EyeTracker]", msg);
      setLogs(prev => [...prev.slice(-4), msg]); // Keep last 5
  };

  // Script Loading State
  const scriptStatus = useRef('idle'); // idle, loading, loaded, error

  // Throttling
  const lastUpdateRef = useRef(0);
  const THROTTLE_MS = 30; // ~33fps

  const loadWebgazer = async () => {
    if (scriptStatus.current === 'loaded' || window.webgazer) {
        scriptStatus.current = 'loaded';
        return true;
    }
    if (scriptStatus.current === 'loading') {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (scriptStatus.current === 'loaded') {
                    clearInterval(check);
                    resolve(true);
                } else if (scriptStatus.current === 'error') {
                    clearInterval(check);
                    resolve(false);
                }
            }, 100);
        });
    }

    scriptStatus.current = 'loading';
    return new Promise((resolve) => {
        const script = document.createElement('script');
        // Use LOCAL version (Bypass network/CORS issues)
        script.src = '/webgazer.js';
        script.onload = () => {
            scriptStatus.current = 'loaded';
            console.log("Webgazer script loaded successfully.");
            resolve(true);
        };
        script.onerror = () => {
            scriptStatus.current = 'error';
            console.error("Failed to load Webgazer script");
            resolve(false);
        };
        document.body.appendChild(script);
    });
  };

  const startTracking = async () => {
    setIsLoading(true);
    setLastError(null);
    addLog("Start Clicked"); 

    try {
      // 1. Dynamic Load
      addLog("Loading Script...");
      const loaded = await loadWebgazer();
      if (!loaded) {
          throw new Error("Script Load Failed");
      }
      addLog("Script Loaded");
      
      // 2. Wait for Object
      if (!window.webgazer) {
        addLog("Waiting for Object...");
        await new Promise(r => setTimeout(r, 500));
        if (!window.webgazer) throw new Error("Webgazer Object Missing");
      }

      // 3. Initialize (Clean Slate Protocol)
      addLog("Cleanup Old DOM...");
      const oldVideo = document.getElementById('webgazerVideoContainer');
      if (oldVideo) oldVideo.remove();
      
      addLog("Setting Regression...");
      // Re-enable setRegression (Required for model selection)
      const wg = window.webgazer;
      try {
         // Force clear first
         if (wg.clearGazeListener) wg.clearGazeListener();
      } catch(e) {}

      // Configure listener
      wg.setGazeListener((data, clock) => {
          if (data) {
            const now = Date.now();
            // Throttle to 60fps (approx 16ms) for smoother UI
            if (now - lastUpdateRef.current > 16) {
                // SMOOTHING ALGORITHM (Heavy Low-Pass Filter)
                // New = Old * 0.9 + Current * 0.1
                // This creates a "gliding" effect rather than "jumping"
                setGaze(prev => {
                    const alpha = 0.08; // Very Low Alpha for maximum smoothness
                    return {
                        x: prev.x * (1 - alpha) + data.x * alpha,
                        y: prev.y * (1 - alpha) + data.y * alpha
                    };
                });
                lastUpdateRef.current = now;
            }
          }
      });

      // Try setting regression explicitly to fix "t is not a function" (missing model)
      if (wg.setRegression) {
          addLog("Setting Model: ridge");
          await wg.setRegression('ridge'); 
      }

      addLog("Beginning Tracker...");
      await wg.begin();

      // 4. PRODUCTION MODE: Hide Video/Overlays for Performance
      // User reported site is "heavy" -> Disabling video canvas reduces CPU usage significantly
      // 4. PRODUCTION MODE: Hide Video/Overlays for Performance
      window.webgazer.showVideoPreview(false)
        .showPredictionPoints(false) 
        .showFaceOverlay(false)
        .showFaceFeedbackBox(false);

      const hideStyle = document.createElement('style');
      hideStyle.id = 'webgazer-hide-style';
      // FORCE HIDE EVERYTHING (Backup for "t is not a function" or API failures)
      // User requested: "If you can't remove it, make it transparent"
      hideStyle.innerHTML = `
        #webgazerVideoFeed, #webgazerVideoCanvas, #webgazerFaceOverlay, #webgazerFaceFeedbackBox, #webgazerVideoContainer, #webgazerGazeDot {
          display: none !important;
          opacity: 0 !important; 
          pointer-events: none !important;
        }
      `;
      if (!document.getElementById('webgazer-hide-style')) {
          document.head.appendChild(hideStyle);
      }
      
      // Inline Force
      setTimeout(() => {
          const ids = ['webgazerVideoContainer', 'webgazerVideoFeed', 'webgazerVideoCanvas'];
          ids.forEach(id => {
              const el = document.getElementById(id);
              if (el) el.style.pointerEvents = 'none';
          });
      }, 1000);

      addLog("Webgazer Started");
      setIsActive(true);
      setIsCalibrating(true); 
    } catch (err) {
      console.error("Tracking Init Failed:", err);
      const errMsg = err.message || String(err);
      setLastError(errMsg);
      addLog("ERR: " + errMsg);
      setIsActive(false);
    } finally {
        setIsLoading(false);
    }
  };

  const stopTracking = () => {
    try {
        if (window.webgazer) {
            window.webgazer.end();
        }
    } catch (e) {
        console.warn("Stop error:", e);
    }
    
    // Cleanup
    const hideStyle = document.getElementById('webgazer-hide-style');
    if (hideStyle) hideStyle.remove();

    const ids = ['webgazerVideoContainer', 'webgazerVideoFeed', 'webgazerVideoCanvas', 'webgazerFaceOverlay', 'webgazerFaceFeedbackBox'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    setIsActive(false);
    setIsCalibrating(false);
  };

  const toggleCalibration = () => setIsCalibrating(!isCalibrating);

  // Debug Status
  useEffect(() => {
    if (isLoading) console.log("Webgazer Loading...");
    if (isActive) console.log("Webgazer Active. Calibrating:", isCalibrating);
    
    // Global Click Listener to find blockers
    const handleClick = (e) => {
        const target = e.target;
        const msg = `Click: ${target.tagName}#${target.id}.${target.className}`;
        console.log(msg);
        // Only log to visual debug if it seems suspicious (not the dot)
        if (!target.className.includes('calibration-dot')) {
             // Accessing addLog here is tricky due to closure/scope, 
             // but we can rely on console for now or use a ref if needed.
             // For now, let's just console it.
        }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isLoading, isActive, isCalibrating]);

  // Enforce Red Dot Visibility Logic (Context Aware)
  useEffect(() => {
    const styleId = 'webgazer-hide-style-context';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        // logic: Only hide ID when body has class .hide-webgazer-cursor
        style.innerHTML = `
            body.hide-webgazer-cursor #webgazerGazeDot {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            /* Always hide video face overlay elements in production */
            #webgazerVideoFeed, #webgazerVideoCanvas, #webgazerFaceOverlay, #webgazerFaceFeedbackBox {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Toggle Body Class
    if (isCalibrating) {
        document.body.classList.remove('hide-webgazer-cursor');
    } else {
        document.body.classList.add('hide-webgazer-cursor');
    }

    // Cleanup Observer (We don't need to delete nodes anymore)
    // Just ensure the class is correct.

  }, [isCalibrating]);

  return (
    <EyeTrackerContext.Provider value={{ isActive, isLoading, gaze, startTracking, stopTracking, isCalibrating, toggleCalibration, lastError, scriptStatus: scriptStatus.current, logs }}>
      {children}
    </EyeTrackerContext.Provider>
  );
};

export const useEyeTracker = () => useContext(EyeTrackerContext);
