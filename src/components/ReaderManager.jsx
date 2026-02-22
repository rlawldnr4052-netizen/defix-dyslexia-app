import React, { useState, useEffect } from 'react';
import NewsFeed from './NewsFeed';
import ArticleReader from './ArticleReader';
// import { newsData } from '../data/newsData'; // Removed static data
import { NewsService } from '../services/newsService';
import './ReaderManager.css';

const ReaderManager = ({ setHeaderContent, interests }) => {
  const [view, setView] = useState('feed'); // 'feed' or 'article'
  const [activeArticleId, setActiveArticleId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch News on Mount or Interest Change
  useEffect(() => {
    const loadNews = async () => {
        setLoading(true);
        try {
            // Default to ALL categories if no interests selected
            const queryInterests = interests && interests.length > 0 
                ? interests 
                : ['IT/기술', '건강', '과학', '경제', '예술'];
            const fetched = await NewsService.fetchArticles(queryInterests);
            setArticles(fetched);
        } catch (e) {
            console.error("Failed to load news", e);
        } finally {
            setLoading(false);
        }
    };
    
    loadNews();
  }, [interests]);

  const handleArticleSelect = (id) => {
    setActiveArticleId(id);
    setView('article');
  };

  const handleBack = () => {
    setView('feed');
    setActiveArticleId(null);
  };

  if (loading && articles.length === 0) {
      return (
          <div className="reader-loading">
              <div className="loading-spinner"></div>
              <p>최신 뉴스를 불러오고 있습니다...</p>
          </div>
      );
  }

  return (
    <div className="reader-manager">
      {view === 'feed' ? (
        <NewsFeed 
            articles={articles} 
            onSelect={handleArticleSelect} 
            selectedInterests={interests}
        />
      ) : (
        <ArticleReader 
          article={articles.find(a => a.id === activeArticleId)} 
          onBack={handleBack}
          allArticles={articles}
          setHeaderContent={setHeaderContent}
        />
      )}
    </div>
  );
};

export default ReaderManager;
