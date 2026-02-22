import Logo from './Logo'; // Add Import
import FocusTimer from './FocusTimer'; // Add Import
import './Header.css'; // Add missing CSS import

const Header = ({ rightContent, user, isDarkMode, toggleTheme, activeCategory, setActiveCategory }) => {
  const interests = ['전체', '경제', 'IT', '예술', '과학', '건강'];

  // Map display names to actual fetching categories if needed, 
  // but NewsService handles exact matches. IT -> IT/기술 mapping maybe needed.
  const handleCategoryClick = (interest) => {
    if (setActiveCategory) {
      // Map shorthand to full name for the news fetching logic if necessary,
      // though 'IT' is fine if NewsService handles it.
      const fetchCategory = interest === 'IT' ? 'IT/기술' : interest;
      setActiveCategory(fetchCategory);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Logo />
      </div>

      <nav className="interest-nav">
        {interests.map((interest) => {
          const fetchCat = interest === 'IT' ? 'IT/기술' : interest;
          const isActive = activeCategory === fetchCat;
          return (
            <button
              key={interest}
              className={`interest-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryClick(interest)}
            >
              {interest}
            </button>
          )
        })}
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
