"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import type { Photo } from "@/data/photos";

interface ImageModalProps {
    photo: Photo;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    direction: number;
}

export default function ImageModal({
    photo,
    onClose,
    onNext,
    onPrev,
    direction,
}: ImageModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onNext, onPrev]);

    // Swipe logic
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50 bg-black/20 rounded-full"
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Navigation Buttons (Desktop) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute left-4 p-3 hidden md:flex items-center justify-center text-white/70 hover:text-white transition-colors z-50 hover:bg-white/10 rounded-full"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute right-4 p-3 hidden md:flex items-center justify-center text-white/70 hover:text-white transition-colors z-50 hover:bg-white/10 rounded-full"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div
                className="relative w-full h-full max-w-7xl max-h-screen p-4 flex items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={photo.id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                onNext();
                            } else if (swipe > swipeConfidenceThreshold) {
                                onPrev();
                            }
                        }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-contain pointer-events-none select-none"
                            sizes="100vw"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
