// src/hooks/useImageProcessing.ts
import { useStoredImages } from '@/hooks/useStoredImage';
import { cleanupURLs, ProcessedImage, processImage } from '@/lib/imageUtils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UseImageProcessingProps {
    size: number;
    quality: number;
}

export const useImageProcessing = ({ size, quality }: UseImageProcessingProps) => {
    const navigate = useNavigate();
    const [imgTemp, setImgTemp] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);

    const { saveImageToStore } = useStoredImages();

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

    const handleSaveProcessed = async () => {
        if (!processedImage || !originalFile) return;

        try {
            await saveImageToStore(processedImage.blob, `processed_${originalFile.name}`, processedImage.blob.type);
            toast.success('Image saved successfully!');
            navigate('/saved-images');
            return true;
        } catch (error) {
            console.error('Error saving processed image:', error);
            return false;
        }
    };

    const handleSaveOriginal = async () => {
        if (!originalFile) return;

        try {
            await saveImageToStore(originalFile, originalFile.name, originalFile.type);
            return true;
        } catch (error) {
            console.error('Error saving original image:', error);
            return false;
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
        handleSaveOriginal,
        handleSaveProcessed,
    };
};
