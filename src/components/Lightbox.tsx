"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Photo {
    id: string;
    src: string;
    alt: string;
}

interface LightboxProps {
    photo: Photo;
    index: number;
    total: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    direction: number;
}

export function Lightbox({
    photo,
    index,
    total,
    onClose,
    onNext,
    onPrev,
    direction,
}: LightboxProps) {
    const [isZoomed, setZoomed] = useState(false);

    // Drag logic for closing (swipe down)
    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, 200], [1, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 100) {
            onClose();
        } else if (info.offset.x < -100) {
            onNext();
        } else if (info.offset.x > 100) {
            onPrev();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm touch-none"
        >
            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 z-50 flex justify-between px-4 text-white">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10 transition-colors"
                >
                    <X size={24} />
                </button>
                <span className="py-2 px-4 rounded-full bg-black/20 backdrop-blur-md text-sm font-medium">
                    {index + 1} / {total}
                </span>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Wedding Album',
                                text: 'Check out this photo!',
                                url: window.location.href,
                            });
                        }
                    }}
                    className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10 transition-colors"
                >
                    <Share2 size={24} />
                </button>
            </div>

            {/* Navigation Buttons (Desktop) */}
            <button
                className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hidden md:block"
                onClick={onPrev}
            >
                <ChevronLeft size={32} />
            </button>
            <button
                className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hidden md:block"
                onClick={onNext}
            >
                <ChevronRight size={32} />
            </button>

            {/* Main Image */}
            <motion.div
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }} // Only free drag when zoomed? No, for swipe gestures.
                dragElastic={0.2} // Feeling of resistance
                onDragEnd={handleDragEnd}
                style={{ y, opacity }}
                className="relative w-full h-full flex items-center justify-center p-2 md:p-8"
                onClick={() => setZoomed(!isZoomed)}
            >
                <motion.div
                    key={photo.id}
                    custom={direction}
                    variants={{
                        enter: (direction: number) => ({
                            x: direction > 0 ? 500 : -500,
                            opacity: 0,
                            scale: 0.9
                        }),
                        center: {
                            zIndex: 1,
                            x: 0,
                            opacity: 1,
                            scale: isZoomed ? 2 : 1,
                            transition: { type: "spring", stiffness: 300, damping: 30 }
                        },
                        exit: (direction: number) => ({
                            zIndex: 0,
                            x: direction < 0 ? 500 : -500,
                            opacity: 0,
                            scale: 0.9,
                            transition: { duration: 0.2 }
                        })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center pointer-events-none" // pointer-events-none on wrapper to let parent drag work, but image needs to be visible
                >
                    {/* We use a regular img for the lightbox to avoid some Next.js Image complexity with strict sizing in full screen flex containers, or purely relative */}
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-contain pointer-events-auto" // Re-enable pointer events
                        sizes="100vw"
                        priority
                        quality={90}
                    />
                </motion.div>
            </motion.div>

            {/* Caption/Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white z-40">
                <p className="text-center text-sm/relaxed font-medium text-white/90">
                    {photo.alt}
                </p>
                <div className="mt-2 flex justify-center">
                    <div className="h-1 w-12 bg-white/30 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
}
