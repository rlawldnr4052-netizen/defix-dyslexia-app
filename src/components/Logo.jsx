const Logo = () => {
  return (
    <div className="fixed-logo logo-glow-container">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>DeFix - From Chaos to Clarity</title>
        {/* Concept: The Alignment Stack. 
            Visualizes visual distortion (top) settling into focus (bottom). */}
            
        {/* Top: High Distortion (Visual Stress) */}
        <path 
            d="M6 10C6 10 14 4 22 10C30 16 38 10 38 10" 
            stroke="var(--text-color)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
        
        {/* Middle: Reducing Distortion (Processing) */}
        <path 
            d="M6 22C6 22 14 20 22 22C30 24 38 22 38 22" 
            stroke="var(--text-color)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.8" 
        />
        
        {/* Bottom: Clarity (Focus) */}
        <line 
            x1="6" y1="34" x2="38" y2="34" 
            stroke="var(--text-color)" 
            strokeWidth="5" 
            strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};

export default Logo;
