"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function StickyHeader() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 100], [0, 1]);
    const y = useTransform(scrollY, [0, 100], [-50, 0]);

    return (
        <>
            {/* Initial Static Header for when at top */}
            <div className="pt-8 pb-4 text-center">
                <h1 className="text-3xl font-serif text-gray-900 dark:text-gray-100 tracking-tight">
                    Sarah & James
                </h1>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">
                    September 14, 2024
                </p>
            </div>

            {/* Sticky Floating Header */}
            <motion.header
                style={{ opacity, y }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-center h-14"
            >
                <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-white">
                    Sarah & James
                </h2>
            </motion.header>
        </>
    );
}
