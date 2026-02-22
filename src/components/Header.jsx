import Logo from './Logo'; // Add Import

import FocusTimer from './FocusTimer'; // Add Import

const Header = ({ rightContent, user, isDarkMode, toggleTheme }) => {
  const interests = ['경제', 'IT', '예술', '과학', '건강'];

  return (
    <header className="app-header">
      <div className="header-left">
        <Logo />
      </div>

      <nav className="interest-nav">
        {interests.map((interest) => (
          <button key={interest} className="interest-chip">
            {interest}
          </button>
        ))}
      </nav>

      <div className="header-right">
        {/* Helper: Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginRight: '15px',
            padding: '5px'
          }}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>

        {user ? (
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #eee' }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
          </div>
        ) : rightContent ? (
          <div className="custom-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {rightContent}
          </div>
        ) : (
          <FocusTimer />
        )}
      </div>
    </header>
  );
};

export default Header;
