'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { photos, type Photo } from '@/data/photos';
import ImageModal from '@/components/ImageModal';
import { useInView } from 'react-intersection-observer';

// Use all real photos
const ALL_PHOTOS = photos;

const CHUNK_SIZE = 20;

export default function Gallery() {
    const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>(ALL_PHOTOS.slice(0, CHUNK_SIZE));
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    // Infinite Scroll Logic
    const loadMore = useCallback(() => {
        if (displayedPhotos.length >= ALL_PHOTOS.length) return;

        setDisplayedPhotos(prev => [
            ...prev,
            ...ALL_PHOTOS.slice(prev.length, prev.length + CHUNK_SIZE)
        ]);
    }, [displayedPhotos.length]);

    useEffect(() => {
        if (inView) {
            const timer = setTimeout(() => {
                loadMore();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [inView, loadMore]);

    useEffect(() => {
        if (selectedPhotoIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedPhotoIndex]);

    const openLightbox = (index: number) => {
        setSelectedPhotoIndex(index);
    };

    const closeLightbox = () => {
        setSelectedPhotoIndex(null);
    };

    const nextImage = () => {
        if (selectedPhotoIndex === null) return;
        setDirection(1);
        setSelectedPhotoIndex((prev) =>
            prev === null ? null : (prev + 1) % displayedPhotos.length
        );
    };

    const prevImage = () => {
        if (selectedPhotoIndex === null) return;
        setDirection(-1);
        setSelectedPhotoIndex((prev) =>
            prev === null ? null : (prev - 1 + displayedPhotos.length) % displayedPhotos.length
        );
    };

    const shareGallery = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: 'Wedding Album',
                    text: 'Check out our wedding photos!',
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            alert('Link copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <main className="min-h-screen bg-white p-2 md:p-4 select-none">

            {/* Masonry Grid */}
            <div className="columns-2 md:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4">
                {displayedPhotos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index < 10 ? index * 0.05 : 0 }}
                        className="break-inside-avoid relative group cursor-zoom-in"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            width={photo.width}
                            height={photo.height}
                            className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-100"
                            priority={index < 10}
                            quality={50} // Optimization for list view
                        />
                    </motion.div>
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="h-24 w-full flex items-center justify-center p-4">
                {displayedPhotos.length < ALL_PHOTOS.length ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                ) : (
                    <p className="text-gray-400 text-sm">End of Album</p>
                )}
            </div>

            {/* Floating Share Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareGallery}
                className="fixed bottom-6 right-6 bg-black/90 text-white p-4 rounded-full shadow-lg z-40 backdrop-blur-sm"
            >
                <Share2 size={24} />
            </motion.button>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhotoIndex !== null && (
                    <ImageModal
                        photo={displayedPhotos[selectedPhotoIndex]}
                        onClose={closeLightbox}
                        onNext={nextImage}
                        onPrev={prevImage}
                        direction={direction}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
