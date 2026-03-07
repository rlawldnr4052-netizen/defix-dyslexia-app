import React, { useEffect, useRef, useState, useMemo } from 'react';
import BionicText from './BionicText';
import ReadingRuler from './ReadingRuler';
import CalibrationDots from './CalibrationDots';
import TooltipOverlay from './TooltipOverlay';
import AISummary from './AISummary';
import FocusTimer from './FocusTimer';
import { useEyeTracker } from '../context/EyeTrackerContext';
import { NewsService } from '../services/newsService';
import './ArticleReader.css';

const ArticleReader = ({ article, onBack, allArticles, setHeaderContent, isEasyMode }) => {
    // Safety Check: if article is missing, return fallback
    if (!article) {
        return (
            <div className="reader-error">
                <p>글을 불러올 수 없습니다.</p>
                <button className="pill-btn outline" onClick={onBack} style={{ marginTop: '1rem' }}>
                    돌아가기
                </button>
            </div>
        );
    }

    const [displayedArticles, setDisplayedArticles] = useState([article]);
    const [focusedParagraphIndex, setFocusedParagraphIndex] = useState(-1);
    const [showEyeIntro, setShowEyeIntro] = useState(false);

    // Google News 기사 원문 콘텐츠 (id → paragraphs[])
    const [fetchedContents, setFetchedContents] = useState({});

    useEffect(() => {
        displayedArticles.forEach(a => {
            if (!a.needsContentFetch) return;
            if (fetchedContents[a.id] !== undefined) return;

            // 모듈 공유 캐시 먼저 확인 (hover 프리페치 결과)
            const cached = NewsService.getCachedContent(a.id);
            if (cached !== undefined) {
                setFetchedContents(prev => ({ ...prev, [a.id]: cached }));
                return;
            }

            // 캐시 없으면 직접 fetch (fallback)
            NewsService.prefetchArticleContent(a);

            // 완료 감지를 위해 폴링 (prefetch가 완료되면 반영)
            const poll = setInterval(() => {
                const result = NewsService.getCachedContent(a.id);
                if (result !== undefined) {
                    clearInterval(poll);
                    setFetchedContents(prev => ({ ...prev, [a.id]: result }));
                }
            }, 300);

            // 15초 후 타임아웃
            setTimeout(() => clearInterval(poll), 15000);
        });
    }, [displayedArticles]);

    // Tooltip State
    const [tooltip, setTooltip] = useState({ active: false, term: '', definition: '', x: 0, y: 0 });

    // Context
    const { isActive: isEyeTracking, isLoading, gaze, startTracking, stopTracking, isCalibrating, toggleCalibration } = useEyeTracker();

    const handleStartTracking = () => {
        setShowEyeIntro(true);
    };

    const confirmStartTracking = () => {
        setShowEyeIntro(false);
        startTracking();
    };

    // 1. Memoize Header Actions (아이트래킹 버튼만 - easy mode는 FloatingButton 담당)
    const headerAction = useMemo(() => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isEyeTracking && (
                <button
                    className="pill-btn outline"
                    onClick={toggleCalibration}
                    title="아이트래킹 정확도 재설정"
                >
                    🎯 재보정
                </button>
            )}

            <button
                className={`pill-btn ${isEyeTracking ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                onClick={() => isEyeTracking ? stopTracking() : handleStartTracking()}
                disabled={isLoading}
            >
                {isLoading ? '⏳ 로딩...' : (isEyeTracking ? '🔴 끄기' : '👁️ 아이트래킹')}
            </button>
        </div>
    ), [isEyeTracking, isLoading, startTracking, stopTracking, toggleCalibration]);

    // 2. Inject Header safely
    useEffect(() => {
        if (!setHeaderContent) return;
        setHeaderContent(headerAction);
        return () => setHeaderContent(null);
    }, [setHeaderContent, headerAction]);

    // 3. Infinite Scroll Implementation
    const observer = useRef();
    const lastArticleRef = useRef();
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (isLoading) return;
        if (!hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setDisplayedArticles(prev => {
                    if (!allArticles || allArticles.length === 0) {
                        setHasMore(false);
                        return prev;
                    }

                    if (prev.length >= 50) {
                        setHasMore(false);
                        return prev;
                    }

                    const nextIndex = prev.length % allArticles.length;
                    const nextArticle = allArticles[nextIndex];

                    if (!nextArticle) return prev;

                    return [...prev, nextArticle];
                });
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (lastArticleRef.current) {
            observer.current.observe(lastArticleRef.current);
        }

        return () => observer.current && observer.current.disconnect();
    }, [displayedArticles, allArticles, isLoading, hasMore]);

    // 4. Gaze Focus Logic (스크롤은 GazeCursor.jsx가 처리, 여기서는 단락 포커스만)
    useEffect(() => {
        if (!isEyeTracking || !gaze || isCalibrating) return;

        const { y } = gaze;

        const paragraphs = document.querySelectorAll('.paragraph-unit');
        let foundIndex = -1;

        paragraphs.forEach((p, idx) => {
            const rect = p.getBoundingClientRect();
            if (y >= rect.top && y <= rect.bottom) {
                foundIndex = idx;
            }
        });

        if (foundIndex !== -1 && foundIndex !== focusedParagraphIndex) {
            setFocusedParagraphIndex(foundIndex);
        }
    }, [gaze, isEyeTracking, isCalibrating, focusedParagraphIndex]);

    return (
        <div
            className={`reader-container ${isEasyMode ? 'dyslexia-mode' : ''} ${isEyeTracking ? 'eye-tracking-mode' : ''}`}
        >
            {/* 아이트래킹 시작 전 안내 모달 */}
            {showEyeIntro && (
                <div className="eye-intro-overlay">
                    <div className="eye-intro-card">
                        <div className="eye-intro-icon">👁️</div>
                        <h3>아이트래킹 시작</h3>
                        <p>카메라를 사용해 시선을 추적합니다.</p>
                        <ul className="eye-intro-steps">
                            <li>📷 카메라 권한 허용 필요</li>
                            <li>🎯 9개 지점 캘리브레이션 진행</li>
                            <li>👀 시선으로 스크롤 및 단락 포커스</li>
                        </ul>
                        <div className="eye-intro-actions">
                            <button className="pill-btn" onClick={confirmStartTracking}>시작하기</button>
                            <button className="pill-btn outline" onClick={() => setShowEyeIntro(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Helpers */}
            <ReadingRuler active={!isEyeTracking && !isEasyMode} />

            {/* Calibration UI */}
            {isCalibrating && (
                <CalibrationDots onComplete={() => toggleCalibration()} />
            )}

            <div className="articles-stream">
                {(() => {
                    // 버그B 수정: render 밖에서 전역 단락 카운터로 정확한 인덱스 추적
                    let globalParagraphCounter = 0;
                    return displayedArticles.map((item, index) => {
                        const isLast = index === displayedArticles.length - 1;

                        return (
                            <article
                                key={`${item.id}-${index}`}
                                className="article-unit"
                                ref={isLast ? lastArticleRef : null}
                            >
                                <header className="article-header">
                                    <div className="article-meta">
                                        <span>{item.category || 'Focus'}</span> • <span>{item.date || 'Today'}</span>
                                    </div>
                                    <h1><BionicText text={item.title} /></h1>
                                    <img src={item.image} alt={item.title} className="article-hero-img" loading="lazy" />

                                    <AISummary points={item.keyPoints} />
                                </header>
                                <div className="article-content">
                                    {(() => {
                                        // Google News 기사: 원문 콘텐츠 우선, 로딩 중 표시
                                        let paragraphs = item.content;
                                        if (item.needsContentFetch) {
                                            const fetched = fetchedContents[item.id];
                                            if (fetched === undefined) {
                                                // 아직 로딩 중
                                                return (
                                                    <div className="article-content-loading">
                                                        <div className="loading-spinner" style={{ margin: '2rem auto' }}></div>
                                                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>원문 불러오는 중...</p>
                                                    </div>
                                                );
                                            }
                                            if (fetched !== null) paragraphs = fetched;
                                            // fetched === null → 실패, title로 폴백
                                            else paragraphs = [item.title, `이 기사의 원문은 아래 링크에서 확인하세요.`];
                                        }

                                        return paragraphs && Array.isArray(paragraphs)
                                            ? paragraphs.map((ph, idx) => {
                                                const myIndex = globalParagraphCounter++;
                                                const isFocused = isEyeTracking && focusedParagraphIndex === myIndex;
                                                return (
                                                    <p
                                                        key={idx}
                                                        className={`reading-paragraph paragraph-unit ${isFocused ? 'focused-paragraph' : ''}`}
                                                    >
                                                        <BionicText text={ph} />
                                                    </p>
                                                );
                                            })
                                            : <p className="reading-paragraph">내용이 없습니다.</p>;
                                    })()}

                                    {item.originalLink && (
                                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                            <a
                                                href={item.originalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pill-btn outline"
                                                style={{ textDecoration: 'none', display: 'inline-block' }}
                                            >
                                                🔗 원문 전체 보기
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    });
                })()}
                {hasMore && <div className="loading-indicator">다음 글을 불러오는 중...</div>}
                {!hasMore && (
                    <div className="loading-indicator" style={{ opacity: 0.5 }}>
                        모든 글을 읽었습니다 ✓
                    </div>
                )}
            </div>

            <TooltipOverlay
                active={tooltip.active}
                x={tooltip.x}
                y={tooltip.y}
                term={tooltip.term}
                definition={tooltip.definition}
            />

            <div className="floating-timer-container">
                <FocusTimer />
            </div>
        </div>
    );
};

export default ArticleReader;
