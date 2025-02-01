// useStoredImages.ts
import { blobToBase64 } from '@/lib/imageUtils';
import { imageDB, StoredImage } from '@/lib/indexDBUtils';
import { useCallback, useEffect, useState } from 'react';

export const useStoredImages = () => {
    const [storedImages, setStoredImages] = useState<StoredImage[]>([]);
    const [latestImage, setLatestImage] = useState<StoredImage | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadLatestImage = useCallback(async () => {
        setIsLoading(true);
        try {
            const image = await imageDB.getLatestImage();
            setLatestImage(image);
        } catch (error) {
            console.error('Error loading latest image:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadStoredImages = useCallback(async () => {
        setIsLoading(true);
        try {
            const images = await imageDB.getAllImages();
            setStoredImages(images);
        } catch (error) {
            console.error('Error loading stored images:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveImageToStore = async (blob: Blob, name: string, type: string = blob.type) => {
        try {
            const base64 = await blobToBase64(blob);
            await imageDB.saveImage({
                name,
                base64,
                type,
                date: new Date(),
            });
            await loadStoredImages();
            await loadLatestImage(); // Perbarui gambar terbaru
        } catch (error) {
            console.error('Error saving image:', error);
            throw error;
        }
    };

    const deleteStoredImage = async (id: number) => {
        try {
            await imageDB.deleteImage(id);
            await loadStoredImages(); // Refresh the list
            await loadLatestImage();
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    };

    // Load stored images on mount
    useEffect(() => {
        loadStoredImages();
        loadLatestImage();
    }, [loadStoredImages, loadLatestImage]);

    return {
        storedImages,
        latestImage,
        isLoading,
        saveImageToStore,
        deleteStoredImage,
        refreshImages: loadStoredImages,
    };
};
