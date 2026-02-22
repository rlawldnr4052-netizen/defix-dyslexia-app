import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FloatingButton from './components/FloatingButton';
import LandingPage from './components/LandingPage';
import InterestSelector from './components/InterestSelector';
import Diagnosis from './components/Diagnosis';
import Logo from './components/Logo';
import ReaderManager from './components/ReaderManager';
import AuthModal from './components/AuthModal'; // Added
import { EyeTrackerProvider } from './context/EyeTrackerContext';
import GazeCursor from './components/GazeCursor';
import ErrorBoundary from './components/ErrorBoundary'; // Added Error Boundary
import './App.css';

function App() {
  const [step, setStep] = useState('landing'); // landing -> diagnosis -> interest -> reader
  const [headerContent, setHeaderContent] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]); 
  
  // Auth State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('defix_theme');
    return saved === 'dark';
  });

  // Apply Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('defix_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('defix_theme', 'light');
    }
  }, [isDarkMode]);

  // Check LocalStorage on Mount for User
  useEffect(() => {
     const storedUser = localStorage.getItem('defix_user');
     if (storedUser) {
         setUser(JSON.parse(storedUser));
     }
  }, []);

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('defix_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('defix_user');
      setStep('landing'); // Go back to landing if logged out? Optional.
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <EyeTrackerProvider>
      <ErrorBoundary>
        <GazeCursor />
        <div className="grain-overlay"></div>
      {/* Logo moved to Header */}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        checkLogin={handleLogin}
      />
      
      {step === 'landing' && (
        <LandingPage 
            onStart={() => setStep('diagnosis')} 
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
        />
      )}

      {step === 'diagnosis' && (
        <Diagnosis onComplete={() => setStep('interest')} />
      )}

      {step === 'interest' && (
        <InterestSelector onComplete={(topics) => {
            setSelectedTopics(topics);
            setStep('reader');
        }} />
      )}

      {step === 'reader' && (
        <div className="fade-enter">
          <Header 
            rightContent={headerContent} 
            user={user} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
          <ReaderManager setHeaderContent={setHeaderContent} interests={selectedTopics} />
          <FloatingButton />
        </div>
      )}
      </ErrorBoundary>
    </EyeTrackerProvider>
  );
}

export default App;
