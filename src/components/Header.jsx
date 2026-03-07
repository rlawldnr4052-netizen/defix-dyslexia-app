import Logo from './Logo'; // Add Import
import FocusTimer from './FocusTimer'; // Add Import
import './Header.css'; // Add missing CSS import

const Header = ({ rightContent, user, isDarkMode, toggleTheme, activeCategory, setActiveCategory }) => {
  // InterestSelector와 동일한 8개 + 전체
  const interests = ['전체', '경제/금융', 'IT/기술', '예술', '과학', '건강', '인문학', '자기계발', '역사'];

  const handleCategoryClick = (interest) => {
    if (setActiveCategory) {
      setActiveCategory(interest);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Logo />
      </div>

      <nav className="interest-nav">
        {interests.map((interest) => {
          const isActive = activeCategory === interest;
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
        ) : null}
      </div>
    </header>
  );
};

export default Header;
