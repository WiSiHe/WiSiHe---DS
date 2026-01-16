import { useState, useRef, useEffect, RefObject, useCallback } from 'react';
import { PresentationSlide } from '../../../three-d/types';

interface UsePresentationLogicProps {
    slides: PresentationSlide[];
    technicalDeckRef?: RefObject<HTMLDivElement | null>;
    technicalSeparatorRef?: RefObject<HTMLElement | null>;
}

export const usePresentationLogic = ({
    slides,
    technicalDeckRef,
    technicalSeparatorRef,
}: UsePresentationLogicProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showCategoryTransition, setShowCategoryTransition] = useState(false);
    const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
    const [isTechnicalSectionVisible, setIsTechnicalSectionVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const previousCategoryRef = useRef<string | undefined>(undefined);
    
    // Use refs to track current values and prevent unnecessary state updates
    const currentSlideRef = useRef(0);
    const previousSlideIndexRef = useRef(0);
    const isScrolledRef = useRef(false);
    const isTechnicalSectionVisibleRef = useRef(false);
    
    // RAF-based throttling for state updates
    const rafIdRef = useRef<number | null>(null);
    const pendingUpdatesRef = useRef<{
        currentSlide?: number;
        previousSlideIndex?: number;
        showCategoryTransition?: boolean;
        isTechnicalSectionVisible?: boolean;
        isScrolled?: boolean;
    }>({});

    // Batch state updates using requestAnimationFrame
    const flushPendingUpdates = useCallback(() => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
        }
        
        rafIdRef.current = requestAnimationFrame(() => {
            const updates = pendingUpdatesRef.current;
            let hasUpdates = false;
            
            if (updates.currentSlide !== undefined && updates.currentSlide !== currentSlideRef.current) {
                currentSlideRef.current = updates.currentSlide;
                setCurrentSlide(updates.currentSlide);
                hasUpdates = true;
            }
            
            if (updates.previousSlideIndex !== undefined && updates.previousSlideIndex !== previousSlideIndexRef.current) {
                previousSlideIndexRef.current = updates.previousSlideIndex;
                setPreviousSlideIndex(updates.previousSlideIndex);
                hasUpdates = true;
            }
            
            if (updates.showCategoryTransition !== undefined) {
                setShowCategoryTransition(updates.showCategoryTransition);
                hasUpdates = true;
            }
            
            if (updates.isTechnicalSectionVisible !== undefined && updates.isTechnicalSectionVisible !== isTechnicalSectionVisibleRef.current) {
                isTechnicalSectionVisibleRef.current = updates.isTechnicalSectionVisible;
                setIsTechnicalSectionVisible(updates.isTechnicalSectionVisible);
                hasUpdates = true;
            }
            
            if (updates.isScrolled !== undefined && updates.isScrolled !== isScrolledRef.current) {
                isScrolledRef.current = updates.isScrolled;
                setIsScrolled(updates.isScrolled);
                hasUpdates = true;
            }
            
            pendingUpdatesRef.current = {};
            rafIdRef.current = null;
        });
    }, []);

    // Technical section visibility - optimized with throttling
    useEffect(() => {
        if (!technicalDeckRef?.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const isVisible = entry.isIntersecting;
                    // Only update if value actually changed
                    if (isVisible !== isTechnicalSectionVisibleRef.current) {
                        pendingUpdatesRef.current.isTechnicalSectionVisible = isVisible;
                        flushPendingUpdates();
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-20% 0px -20% 0px',
            }
        );

        if (technicalDeckRef?.current) {
            observer.observe(technicalDeckRef.current);
        }
        return () => {
            observer.disconnect();
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [technicalDeckRef, flushPendingUpdates]);

    // Slide tracking - optimized with throttling and change detection
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        let categoryTransitionTimeout: NodeJS.Timeout | null = null;

        slideRefs.current.forEach((slide, index) => {
            if (!slide) return;

            const observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        // Only process if significantly intersecting to reduce callback frequency
                        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                            const newCategory = slides[index]?.category;
                            const previousCategory = previousCategoryRef.current;

                            // Only update state if values actually changed
                            if (index !== currentSlideRef.current) {
                                pendingUpdatesRef.current.currentSlide = index;
                                
                                if (index !== previousSlideIndexRef.current) {
                                    pendingUpdatesRef.current.previousSlideIndex = index;
                                }

                                // Handle category transition
                                if (newCategory && newCategory !== previousCategory) {
                                    pendingUpdatesRef.current.showCategoryTransition = true;
                                    
                                    // Clear existing timeout
                                    if (categoryTransitionTimeout) {
                                        clearTimeout(categoryTransitionTimeout);
                                    }
                                    
                                    categoryTransitionTimeout = setTimeout(() => {
                                        pendingUpdatesRef.current.showCategoryTransition = false;
                                        flushPendingUpdates();
                                    }, 2000);
                                }

                                previousCategoryRef.current = newCategory;
                                flushPendingUpdates();
                            }
                        }
                    });
                },
                {
                    // Increased threshold to reduce callback frequency
                    threshold: [0.5, 0.6, 0.7],
                    // Reduced rootMargin to be less sensitive
                    rootMargin: '-15% 0px -15% 0px',
                }
            );

            observer.observe(slide);
            observers.push(observer);
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
            if (categoryTransitionTimeout) {
                clearTimeout(categoryTransitionTimeout);
            }
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [slides.length, slides, flushPendingUpdates]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
                e.preventDefault();
                if (currentSlide < slides.length - 1) {
                    slideRefs.current[currentSlide + 1]?.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
                e.preventDefault();
                if (currentSlide > 0) {
                    slideRefs.current[currentSlide - 1]?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, slides.length]);

    // Scroll position - optimized with throttling and change detection
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrolled = container.scrollTop > 50;
            // Only update if value actually changed
            if (scrolled !== isScrolledRef.current) {
                pendingUpdatesRef.current.isScrolled = scrolled;
                flushPendingUpdates();
            }
        };

        handleScroll();
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [flushPendingUpdates]);

    const handleSkipToCoolPart = () => {
        if (technicalSeparatorRef?.current) {
            technicalSeparatorRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            technicalDeckRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevSlide = () => {
        if (currentSlide > 0) {
            slideRefs.current[currentSlide - 1]?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNextSlide = () => {
        if (currentSlide < slides.length - 1) {
            slideRefs.current[currentSlide + 1]?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return {
        currentSlide,
        showCategoryTransition,
        previousSlideIndex,
        isTechnicalSectionVisible,
        isScrolled,
        containerRef,
        slideRefs,
        handleSkipToCoolPart,
        handleScrollToTop,
        handlePrevSlide,
        handleNextSlide,
    };
};
