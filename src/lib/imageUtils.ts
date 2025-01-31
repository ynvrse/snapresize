// utils/imageUtils.ts
import Pica from 'pica';

const pica = new Pica({
    features: ['js', 'wasm', 'cib'],
});

export interface ProcessedImage {
    url: string;
    blob: Blob;
    width: number;
    height: number;
}

export const processImage = async (
    file: File,
    options: {
        targetWidth: number;
        quality: number;
        format: 'image/jpeg' | 'image/png' | 'image/webp';
    },
): Promise<ProcessedImage> => {
    // Create source image
    const sourceImage = await createImageBitmap(file);
    const { targetWidth, quality, format } = options;

    // Calculate height maintaining aspect ratio
    const aspectRatio = sourceImage.height / sourceImage.width;
    const targetHeight = Math.round(targetWidth * aspectRatio);

    // Create canvas for resizing
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Resize image using pica
    await pica.resize(sourceImage, canvas, {
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
    });

    // Convert to desired format
    const blob = await pica.toBlob(canvas, format, quality);
    const url = URL.createObjectURL(blob);

    return {
        url,
        blob,
        width: targetWidth,
        height: targetHeight,
    };
};

export const downloadImage = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve({
                width: img.width,
                height: img.height,
            });
        };
        img.src = URL.createObjectURL(file);
    });
};
