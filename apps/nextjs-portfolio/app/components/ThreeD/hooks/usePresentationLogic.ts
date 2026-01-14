import { useState, useRef, useEffect, RefObject } from 'react';
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

    // Technical section visibility
    useEffect(() => {
        if (!technicalDeckRef?.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setIsTechnicalSectionVisible(entry.isIntersecting);
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
        return () => observer.disconnect();
    }, [technicalDeckRef]);

    // Slide tracking
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        slideRefs.current.forEach((slide, index) => {
            if (!slide) return;

            const observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                            const newCategory = slides[index]?.category;
                            const previousCategory = previousCategoryRef.current;

                            if (index !== previousSlideIndex) {
                                setPreviousSlideIndex(index);
                            }

                            if (newCategory && newCategory !== previousCategory) {
                                setShowCategoryTransition(true);
                                setTimeout(() => setShowCategoryTransition(false), 2000);
                            }

                            previousCategoryRef.current = newCategory;
                            setCurrentSlide(index);
                        }
                    });
                },
                {
                    threshold: 0.6,
                    rootMargin: '-10% 0px -10% 0px',
                }
            );

            observer.observe(slide);
            observers.push(observer);
        });

        return () => observers.forEach(observer => observer.disconnect());
    }, [slides.length, previousSlideIndex, slides]); // Added slides dep

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

    // Scroll position
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setIsScrolled(container.scrollTop > 50);
        };

        handleScroll();
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

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
