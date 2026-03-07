import React, { useState, useEffect } from 'react';
import NewsFeed from './NewsFeed';
import ArticleReader from './ArticleReader';
import { NewsService } from '../services/newsService';

import './ReaderManager.css';

const ReaderManager = ({ setHeaderContent, interests, isEasyMode }) => {
  const [view, setView] = useState('feed');
  const [activeArticleId, setActiveArticleId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const queryInterests = interests && interests.length > 0
        ? interests
        : ['IT/기술', '건강', '과학', '경제', '예술'];
      const fetched = await NewsService.fetchArticles(queryInterests);
      setArticles(fetched);
    } catch (e) {
      console.error('Failed to load news', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (error) {
    return (
      <div className="reader-error-state">
        <div className="reader-error-icon">📡</div>
        <h3>뉴스를 불러오지 못했어요</h3>
        <p>네트워크 상태를 확인하고 다시 시도해주세요.</p>
        <button className="reader-retry-btn" onClick={loadNews}>
          다시 시도
        </button>
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
          onHover={(article) => NewsService.prefetchArticleContent(article)}
        />
      ) : (
        <ArticleReader
          article={articles.find(a => a.id === activeArticleId)}
          onBack={handleBack}
          allArticles={articles}
          setHeaderContent={setHeaderContent}
          isEasyMode={isEasyMode}
        />
      )}
    </div>
  );
};

export default ReaderManager;
