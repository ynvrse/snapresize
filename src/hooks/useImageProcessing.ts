// hooks/useImageProcessing.ts
import { useCallback, useState } from 'react';
import { ProcessedImage, getImageDimensions, processImage } from '../lib/imageUtils';

interface ImageState {
    original: {
        file: File;
        url: string;
        width: number;
        height: number;
    } | null;
    processed: ProcessedImage | null;
    isProcessing: boolean;
    error: string | null;
}

export const useImageProcessing = () => {
    const [imageState, setImageState] = useState<ImageState>({
        original: null,
        processed: null,
        isProcessing: false,
        error: null,
    });

    const handleImage = useCallback(async (file: File) => {
        try {
            setImageState((prev) => ({ ...prev, isProcessing: true, error: null }));

            // Get original dimensions
            const { width, height } = await getImageDimensions(file);

            // Set original image
            setImageState((prev) => ({
                ...prev,
                original: {
                    file,
                    url: URL.createObjectURL(file),
                    width,
                    height,
                },
            }));
        } catch (err) {
            setImageState((prev) => ({
                ...prev,
                error: 'Error loading image',
            }));
        } finally {
            setImageState((prev) => ({ ...prev, isProcessing: false }));
        }
    }, []);

    const processImageWithOptions = useCallback(
        async (options: {
            targetWidth: number;
            quality: number;
            format: 'image/jpeg' | 'image/png' | 'image/webp';
        }) => {
            if (!imageState.original) return;

            try {
                setImageState((prev) => ({ ...prev, isProcessing: true, error: null }));

                const processed = await processImage(imageState.original.file, options);

                setImageState((prev) => ({
                    ...prev,
                    processed,
                    isProcessing: false,
                }));
            } catch (err) {
                setImageState((prev) => ({
                    ...prev,
                    error: 'Error processing image',
                    isProcessing: false,
                }));
            }
        },
        [imageState.original],
    );

    return {
        ...imageState,
        handleImage,
        processImageWithOptions,
    };
};
