"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageCardProps extends Omit<ImageProps, "onClick"> {
    index: number;
    onClick: () => void;
    priority?: boolean;
}

export function ImageCard({
    src,
    alt,
    index,
    onClick,
    className,
    priority = false,
    ...props
}: ImageCardProps) {
    const [isLoading, setLoading] = useState(true);

    return (
        <motion.div
            layoutId={`image-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={cn(
                "relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 cursor-zoom-in group mb-4 break-inside-avoid shadow-sm hover:shadow-md transition-shadow",
                className
            )}
            onClick={onClick}
        >
            <Image
                src={src}
                alt={alt}
                width={800} // Basic width for aspect ratio inference defaults, but we use w-full
                height={600} // Just a default, layout usually handles it or we use 'sizes'
                className={cn(
                    "w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105",
                    isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0"
                )}
                onLoad={() => setLoading(false)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={80} // Performance optimization
                priority={priority}
                {...props}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </motion.div>
    );
}
