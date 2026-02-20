"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Download, Share2 } from "lucide-react";
import { fetchPhotos } from "@/app/actions"; // Server Action
import { ImageCard } from "./ImageCard";
import { Lightbox } from "./Lightbox";
import type { Photo } from "@/lib/data";

interface GalleryClientProps {
    initialPhotos: Photo[];
}

export function GalleryClient({ initialPhotos }: GalleryClientProps) {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [direction, setDirection] = useState(0);

    // Infinite Scroll Trigger
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "200px",
    });

    useEffect(() => {
        const loadMorePhotos = async () => {
            setIsLoading(true);
            try {
                const newPhotos = await fetchPhotos(page);
                if (newPhotos.length === 0) {
                    setHasMore(false);
                } else {
                    setPhotos((prev) => [...prev, ...newPhotos]);
                    setPage((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Failed to load photos", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (inView && hasMore && !isLoading) {
            loadMorePhotos();
        }
    }, [inView, hasMore, isLoading, page]);

    // Lightbox Navigation
    const selectedPhotoIndex = photos.findIndex((p) => p.id === selectedId);
    const handleNext = () => {
        if (selectedPhotoIndex < photos.length - 1) {
            setDirection(1);
            setSelectedId(photos[selectedPhotoIndex + 1].id);
        }
    };
    const handlePrev = () => {
        if (selectedPhotoIndex > 0) {
            setDirection(-1);
            setSelectedId(photos[selectedPhotoIndex - 1].id);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="select-none touch-pan-y">
            <main className="container mx-auto px-2 py-2 pb-20">

                {/* Masonry Layout */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {photos.map((photo, index) => (
                        <div key={photo.id} className="break-inside-avoid">
                            <ImageCard
                                index={index}
                                src={photo.src}
                                alt={photo.alt}
                                onClick={() => setSelectedId(photo.id)}
                                priority={index < 10}
                            />
                        </div>
                    ))}
                </div>

                {/* Loading Indicator / Trigger */}
                <div ref={ref} className="h-20 flex justify-center items-center mt-8">
                    {isLoading && (
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                    )}
                    {!hasMore && (
                        <p className="text-gray-400 text-sm">You have reached the end.</p>
                    )}
                </div>
            </main>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedId && photos[selectedPhotoIndex] && (
                    <Lightbox
                        photo={photos[selectedPhotoIndex]}
                        index={selectedPhotoIndex}
                        total={photos.length}
                        onClose={() => setSelectedId(null)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        direction={direction}
                    />
                )}
            </AnimatePresence>

            {/* Floating Actions */}
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
                                title: 'Our Wedding Album',
                                url: window.location.href,
                            });
                        }
                    }}
                >
                    <Share2 size={24} />
                </motion.button>

                <motion.button
                    className="p-3 rounded-full bg-blue-600 text-white shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                        alert("Starting download...");
                    }}
                >
                    <Download size={24} />
                </motion.button>

                <motion.button
                    className="p-3 rounded-full bg-black/80 text-white shadow-xl backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    onClick={scrollToTop}
                >
                    <ArrowUp size={24} />
                </motion.button>
            </div>
        </div>
    );
}
