// ImageUploader.tsx
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { useImageSlider } from '@/hooks/useImageSlider';
import { downloadFile } from '@/lib/imageUtils';
import { EllipsisVertical, ImagePlus, X } from 'lucide-react';
import { useState } from 'react';

const ImageUploader: React.FC = () => {
    const [size, setSize] = useState<number>(400);
    const [quality, setQuality] = useState<number>(0.6);

    const { imgTemp, originalFile, isProcessing, processedImage, handleFileChange, handleReset } = useImageProcessing({
        size,
        quality,
    });

    const { sliderRef, sliderPosition, handleMouseDown, handleTouchStart } = useImageSlider();

    const downloadImage = (format: string = 'image/jpeg') => {
        if (!processedImage) return;
        const extension = format.split('/')[1];
        const fileName = `processed-image.${extension}`;
        downloadFile(processedImage.blob, fileName);
    };

    const downloadOriginal = () => {
        if (!originalFile) return;
        downloadFile(originalFile, originalFile.name);
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
                                            <img
                                                src={processedImage?.url || ''}
                                                alt="After"
                                                className="absolute h-full w-full object-cover"
                                            />
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
