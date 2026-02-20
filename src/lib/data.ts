export interface Photo {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
}

// Generate 500 fake photos
export const ALL_PHOTOS: Photo[] = Array.from({ length: 500 }).map((_, i) => ({
    id: `photo-${i}`,
    src: `https://picsum.photos/seed/${i + 123}/800/${i % 3 === 0 ? 1200 : i % 2 === 0 ? 800 : 1000}`,
    alt: `Wedding Moment ${i + 1}`,
    width: 800,
    height: i % 3 === 0 ? 1200 : i % 2 === 0 ? 800 : 1000,
}));
