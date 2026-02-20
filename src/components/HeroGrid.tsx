"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Photo {
    id: string;
    src: string;
    alt: string;
}

interface HeroGridProps {
    photos: Photo[];
    onPhotoClick: (id: string) => void;
}

export function HeroGrid({ photos, onPhotoClick }: HeroGridProps) {
    if (photos.length < 4) return null;

    return (
        <div className="grid grid-cols-2 gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-2 rounded-3xl">
            {photos.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative aspect-square overflow-hidden rounded-2xl cursor-zoom-in"
                    onClick={() => onPhotoClick(photo.id)}
                >
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        priority={true} // Critical for LCP
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors" />
                </motion.div>
            ))}
        </div>
    );
}
