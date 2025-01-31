// useImageProcessing.ts
import { cleanupURLs, ProcessedImage, processImage } from '@/lib/imageUtils';
import { useEffect, useState } from 'react';

interface UseImageProcessingProps {
    size: number;
    quality: number;
}

export const useImageProcessing = ({ size, quality }: UseImageProcessingProps) => {
    const [imgTemp, setImgTemp] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<ProcessedImage | null>();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImgTemp(imageUrl);
            setOriginalFile(file);
            await handleProcessImage(file);
        }
    };

    const handleProcessImage = async (file: File) => {
        setIsProcessing(true);
        try {
            const processed = await processImage(file, size, quality);
            setProcessedImage(processed);
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        cleanupURLs(imgTemp, processedImage?.url);
        setImgTemp(null);
        setProcessedImage(null);
        setOriginalFile(null);
    };

    // Reprocess image when size or quality changes
    useEffect(() => {
        if (originalFile) {
            handleProcessImage(originalFile);
        }
    }, [size, quality]);

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            cleanupURLs(imgTemp, processedImage?.url);
        };
    }, [imgTemp, processedImage]);

    return {
        imgTemp,
        originalFile,
        isProcessing,
        processedImage,
        handleFileChange,
        handleReset,
    };
};
