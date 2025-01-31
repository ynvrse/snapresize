import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { EllipsisVertical, ImagePlus, X } from 'lucide-react';
import Pica from 'pica';
import React, { useEffect, useRef, useState } from 'react';

const pica = new Pica({
    features: ['js', 'wasm', 'cib'],
});

interface ProcessedImage {
    url: string;
    blob: Blob;
    width: number;
    height: number;
}

const ImageUploader: React.FC = () => {
    // Original states
    const [imgTemp, setImgTemp] = useState<string | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [size, setSize] = useState<number>(400);
    const [quality, setQuality] = useState<number>(0.6);
    const [sliderPosition, setSliderPosition] = useState(50);

    // Processing states
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);

    // Refs
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const processImage = async (file: File, targetWidth: number, quality: number, format: string = 'image/jpeg') => {
        setIsProcessing(true);
        try {
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
                alpha: true,
                unsharpAmount: 80,
                unsharpRadius: 0.6,
                unsharpThreshold: 2,
            });

            // Convert to desired format
            const blob = await pica.toBlob(canvas, format, quality);
            const url = URL.createObjectURL(blob);

            setProcessedImage({
                url,
                blob,
                width: targetWidth,
                height: targetHeight,
            });
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImgTemp(imageUrl);
            setOriginalFile(file);
            await processImage(file, size, quality);
        }
    };

    // Reprocess image when size or quality changes
    useEffect(() => {
        if (originalFile) {
            processImage(originalFile, size, quality);
        }
    }, [size, quality]);

    const downloadImage = (format: string = 'image/jpeg') => {
        if (!processedImage) return;

        const extension = format.split('/')[1];
        const fileName = `processed-image.${extension}`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(processedImage.blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadOriginal = () => {
        if (!originalFile) return;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(originalFile);
        link.download = originalFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Slider logic
    const calculatePosition = (clientX: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    // Mouse Events
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        calculatePosition(e.clientX);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // Touch Events
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        isDragging.current = true;
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (!isDragging.current) return;
        const touch = e.touches[0];
        calculatePosition(touch.clientX);
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);

            // Cleanup URLs
            if (imgTemp) URL.revokeObjectURL(imgTemp);
            if (processedImage?.url) URL.revokeObjectURL(processedImage.url);
        };
    }, [imgTemp, processedImage]);

    const handleReset = () => {
        if (imgTemp) URL.revokeObjectURL(imgTemp);
        if (processedImage?.url) URL.revokeObjectURL(processedImage.url);
        setImgTemp(null);
        setProcessedImage(null);
        setOriginalFile(null);
    };

    return (
        <div>
            <PageHeader>
                <PageHeaderHeading className="flex w-full justify-between">Image Resizer & Converter</PageHeaderHeading>
            </PageHeader>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="relative space-y-4">
                            {imgTemp && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-0 right-0 z-10 cursor-pointer"
                                    onClick={handleReset}
                                >
                                    <X />
                                </Button>
                            )}
                            <label
                                htmlFor="image-upload"
                                className="bg-muted/10 relative flex cursor-pointer flex-col items-center justify-center rounded-lg"
                            >
                                {imgTemp ? (
                                    <div
                                        ref={sliderRef}
                                        className="relative mx-auto w-full max-w-2xl touch-none overflow-hidden rounded-2xl shadow-lg"
                                    >
                                        <div className="relative h-64 w-full">
                                            {/* After image (processed) */}
                                            <img
                                                src={processedImage?.url || ''}
                                                alt="After"
                                                className="absolute h-full w-full object-cover"
                                            />

                                            {/* Before image (original) */}
                                            <div
                                                className="absolute h-full overflow-hidden"
                                                style={{ width: `${sliderPosition}%` }}
                                            >
                                                <img
                                                    src={imgTemp}
                                                    alt="Before"
                                                    className="h-full w-full object-cover"
                                                    style={{
                                                        width: `${100 / (sliderPosition / 100)}%`,
                                                        maxWidth: 'none',
                                                    }}
                                                />
                                            </div>

                                            {/* Slider handle */}
                                            <div
                                                className="absolute top-0 bottom-0 w-1 cursor-ew-resize touch-none bg-white"
                                                style={{ left: `${sliderPosition}%` }}
                                                onMouseDown={handleMouseDown}
                                                onTouchStart={handleTouchStart}
                                            >
                                                <EllipsisVertical className="bg-primary absolute top-1/2 left-1/2 h-8 w-4 -translate-x-1/2 -translate-y-1/2 rounded-sm shadow-lg" />
                                            </div>

                                            {isProcessing && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <div className="text-white">Processing...</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-muted-foreground flex h-64 w-full flex-col items-center justify-center">
                                            <ImagePlus className="mb-2 h-12 w-12" />
                                            <span className="text-sm font-medium">Klik atau seret gambar kesini</span>
                                            <span className="text-muted-foreground text-xs">JPEG/JPG, PNG, WEBP</span>
                                        </div>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </>
                                )}
                            </label>
                        </div>

                        <Label htmlFor="size">Resize: {size}px</Label>
                        <Slider
                            id="size"
                            value={[size]}
                            min={50}
                            max={800}
                            step={50}
                            onValueChange={(value) => setSize(value[0])}
                        />

                        <Label htmlFor="quality">Quality: {quality}</Label>
                        <Slider
                            id="quality"
                            value={[quality]}
                            min={0.1}
                            max={1}
                            step={0.1}
                            onValueChange={(value) => setQuality(value[0])}
                        />

                        <Label htmlFor="download">Download</Label>
                        <div id="download" className="flex gap-x-2">
                            <Button size="sm" onClick={downloadOriginal} disabled={!originalFile}>
                                Original
                            </Button>
                            <Button
                                className="bg-accent text-black"
                                size="sm"
                                onClick={() => downloadImage('image/jpeg')}
                                disabled={!processedImage}
                            >
                                JPEG/JPG
                            </Button>
                            <Button
                                variant="lime"
                                size="sm"
                                onClick={() => downloadImage('image/png')}
                                disabled={!processedImage}
                            >
                                PNG
                            </Button>
                            <Button
                                className="text-black"
                                variant="secondary"
                                size="sm"
                                onClick={() => downloadImage('image/webp')}
                                disabled={!processedImage}
                            >
                                WEBP
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ImageUploader;
