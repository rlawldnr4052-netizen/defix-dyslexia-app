import React from 'react';
import BionicText from './BionicText';
import './NewsFeed.css';

const NewsFeed = ({ articles, onSelect, selectedInterests }) => {

  // Mapping Korean Interests to Database Categories
  const CATEGORY_MAP = {
    'IT/기술': 'Technology',
    '건강': 'Health',
    '과학': 'Science',
    '경제': 'Economy',
    '경제/금융': 'Economy', // Selector uses this
    '예술': 'Art'
  };

  // Determine which categories to show
  const allCategories = ['Technology', 'Health', 'Science', 'Economy', 'Art'];

  const visibleCategories = !selectedInterests || selectedInterests.length === 0 || selectedInterests.includes('전체')
    ? allCategories
    : allCategories.filter(cat => {
      // Find if any selected interest maps to this category
      return selectedInterests.some(interest => CATEGORY_MAP[interest] === cat);
    });

  return (
    <div className="news-feed-container fade-enter">
      <h2 className="feed-title-main">
        <BionicText text={selectedInterests?.length > 0 ? "맞춤 뉴스 피드" : "오늘의 지식"} />
      </h2>

      {/* Group by Category */}
      {visibleCategories.length > 0 ? (
        visibleCategories.map(category => (
          <div key={category} className="category-section">
            <h3 className="category-header">
              <span className="category-icon">
                {category === 'Technology' && '💻'}
                {category === 'Health' && '🌿'}
                {category === 'Science' && '🚀'}
                {category === 'Economy' && '💰'}
                {category === 'Art' && '🎨'}
              </span>
              {category}
            </h3>
            <div className="feed-grid">
              {articles.filter(a => a.category === category).map((article) => (
                <div
                  key={article.id}
                  className="feed-card"
                  onClick={() => onSelect(article.id)}
                >
                  <div className="card-image" style={{ backgroundImage: `url(${article.image})` }}></div>
                  <div className="card-info">
                    <div className="card-meta">
                      <span>{article.date || 'Today'}</span>
                    </div>
                    <h3><BionicText text={article.title} /></h3>
                    <p><BionicText text={article.summary} /></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
          <h3>선택하신 주제의 기사를 불러올 수 없습니다.</h3>
          <p>잠시 후 다시 시도하거나 다른 주제를 선택해주세요.</p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
