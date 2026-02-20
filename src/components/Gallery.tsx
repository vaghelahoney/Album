"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Share2 } from "lucide-react";
import { ImageCard } from "./ImageCard";
import { Lightbox } from "./Lightbox";
import { HeroGrid } from "./HeroGrid";

// Sample Data (Replace with real API/DB data)
const PHOTOS = Array.from({ length: 20 }).map((_, i) => ({
    id: `photo-${i}`,
    src: `https://picsum.photos/seed/${i + 1}/800/${i % 2 === 0 ? 1200 : 800}`, // Mix of portrait/landscape
    alt: `Wedding Moment ${i + 1}`,
    width: 800,
    height: i % 2 === 0 ? 1200 : 800,
}));

export function Gallery() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [direction, setDirection] = useState(0);

    const selectedPhotoIndex = PHOTOS.findIndex((p) => p.id === selectedId);

    const handleNext = () => {
        if (selectedPhotoIndex < PHOTOS.length - 1) {
            setDirection(1);
            setSelectedId(PHOTOS[selectedPhotoIndex + 1].id);
        }
    };

    const handlePrev = () => {
        if (selectedPhotoIndex > 0) {
            setDirection(-1);
            setSelectedId(PHOTOS[selectedPhotoIndex - 1].id);
        }
    };

    // Back to Top Logic

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                        Our Forever
                    </h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        A collection of moments from our special day.
                    </p>
                </header>

                <HeroGrid photos={PHOTOS.slice(0, 4)} onPhotoClick={(id) => setSelectedId(id)} />

                <div className="flex items-center justify-center my-8">
                    <span className="h-px w-16 bg-gray-300 dark:bg-gray-700"></span>
                    <span className="px-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Full Gallery</span>
                    <span className="h-px w-16 bg-gray-300 dark:bg-gray-700"></span>
                </div>

                {/* Masonry Layout using CSS Columns */}
                {/* 'columns-1' (mobile), 'md:columns-3' (tablet), 'lg:columns-4' (desktop) */}
                {/* 'space-y-4' adds gap between items vertically */}
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {PHOTOS.slice(4).map((photo, index) => (
                        <div key={photo.id} className="break-inside-avoid">
                            <ImageCard
                                index={index + 4}
                                src={photo.src}
                                alt={photo.alt}
                                onClick={() => setSelectedId(photo.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedId && (
                    <Lightbox
                        photo={PHOTOS[selectedPhotoIndex]}
                        index={selectedPhotoIndex}
                        total={PHOTOS.length}
                        onClose={() => setSelectedId(null)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        direction={direction}
                    />
                )}
            </AnimatePresence>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
                <motion.button
                    className="p-3 rounded-full bg-white text-gray-900 shadow-xl backdrop-blur-sm dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Our Forever - Wedding Album',
                                url: window.location.href,
                            });
                        } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied!");
                        }
                    }}
                >
                    <Share2 size={24} />
                </motion.button>

                <motion.button
                    className="p-3 rounded-full bg-black/80 text-white shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={scrollToTop}
                >
                    <ArrowUp size={24} />
                </motion.button>
            </div>
        </>
    );
}
