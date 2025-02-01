// imageUtils.ts
import Pica from 'pica';

export const pica = new Pica({
    features: ['js', 'wasm', 'cib'],
});

export interface ProcessedImage {
    url: string;
    blob: Blob;
    width: number;
    height: number;
}

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const base64ToBlob = async (base64: string): Promise<Blob> => {
    const response = await fetch(base64);
    return response.blob();
};

export const processImage = async (
    file: File,
    targetWidth: number,
    quality: number,
    format: string = 'image/jpeg',
): Promise<ProcessedImage> => {
    // Create source image
    const sourceImage = await createImageBitmap(file);

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

export const downloadFile = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const cleanupURLs = (...urls: (string | null | undefined)[]) => {
    urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
    });
};
