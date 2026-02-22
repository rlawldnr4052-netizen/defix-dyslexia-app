import React from 'react';

// Precision Bionic: Only FIRST letter of word is Bold (900)
// Rest is Normal (400)
const BionicText = ({ text, className = "" }) => {
  if (!text) return null;
  
  // Handle newlines if text contains \n, otherwise just split by space
  // Ensure NFC normalization to prevent Hangul Jamo separation
  const normalizedText = text.normalize('NFC');
  const lines = normalizedText.split('\n');
  
  return (
    <span className={`bionic-text-wrapper ${className}`}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <React.Fragment key={lineIndex}>
            {words.map((word, index) => (
              <React.Fragment key={index}>
                <span className="bionic-word">
                  <span style={{ fontWeight: 600 }}>{word.charAt(0)}</span>
                  <span style={{ fontWeight: 400 }}>{word.slice(1)}</span>
                </span>
                {index < words.length - 1 && ' '}
              </React.Fragment>
            ))}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default BionicText;
