"use server";

import { ALL_PHOTOS, Photo } from "@/lib/data";

const PAGE_SIZE = 20;

export async function fetchPhotos(page: number): Promise<Photo[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return ALL_PHOTOS.slice(start, end);
}
