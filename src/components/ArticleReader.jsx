import React, { useEffect, useRef, useState, useMemo } from 'react';
import BionicText from './BionicText';
import ReadingRuler from './ReadingRuler';
import GazeRuler from './GazeRuler';
import CalibrationDots from './CalibrationDots';
import DebugStatus from './DebugStatus';
import TooltipOverlay from './TooltipOverlay';
import AISummary from './AISummary';
import { vocabulary } from '../data/vocabulary';
import SoundManager from '../utils/SoundManager';
import { useEyeTracker } from '../context/EyeTrackerContext';
import './ArticleReader.css';

const ArticleReader = ({ article, onBack, allArticles, setHeaderContent }) => {
    // Safety Check: if article is missing, return fallback or null to prevent crash
    if (!article) {
        return (
            <div className="reader-error" style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                <p>글을 불러올 수 없습니다.</p>
                <button
                    onClick={onBack}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '50px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    돌아가기
                </button>
            </div>
        );
    }

    const [displayedArticles, setDisplayedArticles] = useState([article]);
    const [rulerActive, setRulerActive] = useState(true);
    const [showSummary, setShowSummary] = useState(false);
    const [isEasyMode, setIsEasyMode] = useState(false); // New AI Mode
    const [focusedParagraphIndex, setFocusedParagraphIndex] = useState(-1); // Fix: Added missing state

    // Tooltip State
    const [tooltip, setTooltip] = useState({ active: false, term: '', definition: '', x: 0, y: 0 });

    // Context
    const { isActive: isEyeTracking, isLoading, gaze, startTracking, stopTracking, isCalibrating, toggleCalibration } = useEyeTracker();

    // 1. Memoize Header Actions
    const headerAction = useMemo(() => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
                className={`pill-btn ${isEasyMode ? 'active' : 'active'}`}
                onClick={() => setIsEasyMode(prev => !prev)}
            >
                {isEasyMode ? '✨ 원본 보기' : '✨ AI 3줄 요약'}
            </button>

            {isEyeTracking && (
                <button
                    className="pill-btn outline"
                    onClick={toggleCalibration}
                    title="아이트래킹 정확도 재설정"
                >
                    🎯 보정
                </button>
            )}

            <button
                className={`pill-btn ${isEyeTracking ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                onClick={() => isEyeTracking ? stopTracking() : startTracking()}
                disabled={isLoading}
            >
                {isLoading ? '⏳ 로딩...' : (isEyeTracking ? '🔴 끄기' : '👁️ 아이트래킹 켜기')}
            </button>
        </div>
    ), [isEyeTracking, isLoading, showSummary, startTracking, stopTracking, isEasyMode, toggleCalibration]);

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
                // Load next article
                setDisplayedArticles(prev => {
                    // Infinite Loop Logic:
                    // If we have articles in 'allArticles', keep cycling through them to simulate infinite feed.
                    // Only stop if allArticles is empty.
                    if (!allArticles || allArticles.length === 0) {
                        setHasMore(false);
                        return prev;
                    }

                    // Safety cap to prevent memory crash after too many loads (e.g. 50)
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
        }, { threshold: 0.1, rootMargin: '200px' }); // Load sooner (pre-load)

        if (lastArticleRef.current) {
            observer.current.observe(lastArticleRef.current);
        }

        return () => observer.current && observer.current.disconnect();
    }, [displayedArticles, allArticles, isLoading, hasMore]);

    // 5. Gaze Control Logic (Scroll & Focus)
    useEffect(() => {
        if (!isEyeTracking || !gaze || isCalibrating) return;

        const { x, y } = gaze;
        const height = window.innerHeight;

        // --- A. Gaze Scrolling ---
        // Top 20% -> Scroll Up
        // Bottom 20% -> Scroll Down
        const zoneSize = height * 0.2;
        const scrollSpeed = 8; // Pixels per frame

        if (y < zoneSize) {
            // Look Up -> Scroll Up
            window.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
        } else if (y > height - zoneSize) {
            // Look Down -> Scroll Down
            window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
        }

        // --- B. Gaze Focusing ---
        // Highlight paragraph under gaze
        // Optimize with checking every few frames or just direct DOM reading
        const paragraphs = document.querySelectorAll('.paragraph-unit');
        let foundIndex = -1;

        // TODO: optimization - binary search or cached rects? 
        // For < 50 items, linear scan is fine (~1ms)
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

    // 6. Removed Mouse Hover Focus Fallback completely to enforce real EyeTracking
    // Only the 'gaze' effect above will determine focusedParagraphIndex now.

    return (
        <div
            className={`reader-container ${isEasyMode ? 'dyslexia-mode' : ''}`}
        >
            {/* Visual Helpers */}
            <ReadingRuler active={!isEyeTracking && rulerActive && !isEasyMode} />

            {/* Calibration UI - Only visible when calibrating */}
            {isCalibrating && (
                <CalibrationDots onComplete={() => toggleCalibration()} />
            )}

            {/* Gaze Feedback Cursor (Optional - User didn't ask for it specifically, but it helps debug) 
          User said: "When eye tracking is on, remove yellow box... control with eyes"
          We won't show a cursor unless strictly necessary, but highlighting is the feedback.
      */}

            <div className="articles-stream">
                {displayedArticles.map((item, index) => {
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
                                <img src={item.image} alt={item.title} className="article-hero-img" />

                                {/* Inline AI Summary (Toss Style) */}
                                <AISummary points={item.keyPoints} />
                            </header>
                            <div className="article-content">
                                {item.content && Array.isArray(item.content) ? (
                                    item.content.map((ph, idx) => {
                                        const globalId = `p-${index}-${idx}`;
                                        const isFocused = focusedParagraphIndex !== -1 &&
                                            document.querySelectorAll('.paragraph-unit')[focusedParagraphIndex]?.id === globalId;

                                        return (
                                            <p
                                                key={idx}
                                                id={globalId}
                                                className={`reading-paragraph paragraph-unit ${isFocused ? 'focused-paragraph' : ''}`}
                                            >
                                                <BionicText text={ph} />
                                            </p>
                                        );
                                    })
                                ) : (
                                    <p className="reading-paragraph">내용이 없습니다.</p>
                                )}

                                {/* Source Link */}
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
                })}
                {hasMore && <div className="loading-indicator">다음 글을 불러오는 중...</div>}
                {!hasMore && (
                    <div className="loading-indicator" style={{ opacity: 0.5 }}>
                        마지막 글입니다.
                    </div>
                )}
            </div>

            {/* Video Elements hidden but present for logic */}
            {/* ... */}

            {/* Dynamic Tooltip */}
            <TooltipOverlay
                active={tooltip.active}
                x={tooltip.x}
                y={tooltip.y}
                term={tooltip.term}
                definition={tooltip.definition}
            />
        </div>
    );
};

export default ArticleReader;
