'use client';

import { motion, AnimatePresence } from 'motion/react';

interface PresentationControlsProps {
    currentSlide: number;
    totalSlides: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    onScrollToTop: () => void;
    isScrolled: boolean;
    isVisible: boolean;
}

export function PresentationControls({
    currentSlide,
    totalSlides,
    onNext,
    onPrev,
    onSkip,
    onScrollToTop,
    isScrolled,
    isVisible,
}: PresentationControlsProps) {
    if (!isVisible) return null;

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === totalSlides - 1;

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Navigation Group */}
            <div className="pointer-events-auto flex flex-col items-center bg-surface-elevated border border-border rounded-2xl p-1.5 shadow-xl overflow-hidden">
                <motion.button
                    onClick={onPrev}
                    disabled={isFirstSlide}
                    whileHover={isFirstSlide ? {} : { backgroundColor: 'var(--color-surface-active)' }}
                    whileTap={isFirstSlide ? {} : { scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isFirstSlide
                            ? 'text-foreground/20 cursor-not-allowed'
                            : 'text-foreground hover:text-accent cursor-pointer'
                        }`}
                    aria-label="Previous slide"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m18 15-6-6-6 6" />
                    </svg>
                </motion.button>

                <div className="py-2 text-[10px] font-mono font-medium text-foreground/50 select-none">
                    {String(currentSlide + 1).padStart(2, '0')}<span className="opacity-30">/</span>
                    {String(totalSlides).padStart(2, '0')}
                </div>

                <motion.button
                    onClick={onNext}
                    disabled={isLastSlide}
                    whileHover={isLastSlide ? {} : { backgroundColor: 'var(--color-surface-active)' }}
                    whileTap={isLastSlide ? {} : { scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isLastSlide
                            ? 'text-foreground/20 cursor-not-allowed'
                            : 'text-foreground hover:text-accent cursor-pointer'
                        }`}
                    aria-label="Next slide"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </motion.button>
            </div>

            {/* Actions Group */}
            <div className="flex flex-col gap-3 items-end pointer-events-auto">
                <AnimatePresence>
                    {isScrolled && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onScrollToTop}
                            className="group flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-xl shadow-lg hover:shadow-xl hover:bg-surface-active transition-all cursor-pointer"
                        >
                            <div className="p-1 rounded-full bg-surface group-hover:bg-accent/20 transition-colors">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="group-hover:text-accent transition-colors"
                                >
                                    <path d="m18 15-6-6-6 6" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                                Top
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSkip}
                    className="group flex items-center gap-3 px-5 py-3 bg-accent text-accent-contrast rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all cursor-pointer"
                >
                    <span className="text-sm font-semibold">Skip Intro</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-0.5 transition-transform"
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
}
