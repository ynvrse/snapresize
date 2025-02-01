// ImageUploader.tsx
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { useImageSlider } from '@/hooks/useImageSlider';
import { downloadFile } from '@/lib/imageUtils';
import { DB } from '@/lib/indexDBUtils';
import { EllipsisVertical, ImagePlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ImageUploader: React.FC = () => {
    const [size, setSize] = useState<number>(400);
    const [quality, setQuality] = useState<number>(0.6);

    const { imgTemp, originalFile, isProcessing, processedImage, handleSaveProcessed, handleFileChange, handleReset } =
        useImageProcessing({
            size,
            quality,
        });

    const { sliderRef, sliderPosition, handleMouseDown, handleTouchStart } = useImageSlider();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await DB.getSetting();
                if (settings) {
                    setSize(settings.size);
                    setQuality(settings.quality);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const downloadImage = (format: string = 'image/jpeg') => {
        if (!processedImage) return;
        const extension = format.split('/')[1];
        const timestamp = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const fileName = `snap-to-${extension}-${timestamp}.${extension}`;
        downloadFile(processedImage.blob, fileName);
        toast.success('Image downloaded successfully');
    };

    const downloadOriginal = () => {
        if (!originalFile) return;
        downloadFile(originalFile, originalFile.name);
        toast.success('Original image downloaded successfully');
    };

    return (
        <ScrollArea className="h-[calc(100vh-150px)]">
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
                                    className="absolute -top-3 -right-3 z-10 cursor-pointer rounded-full"
                                    onClick={handleReset}
                                >
                                    <X color="white" />
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
                            max={1200}
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
                            <Button size="sm" variant="outline" onClick={downloadOriginal} disabled={!originalFile}>
                                Original
                            </Button>
                            <Button
                                size="sm"
                                className="bg-yellow-500"
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

                <CardFooter className="flex flex-col">
                    <div className="my-4 flex w-full items-center gap-x-2">
                        <div className="flex-grow border-t border-slate-400"></div>
                        <span className="text-sm text-gray-500">atau</span>
                        <div className="flex-grow border-t border-slate-400"></div>
                    </div>

                    <Button
                        className="w-full"
                        size="sm"
                        onClick={() => {
                            handleSaveProcessed();
                            handleReset();
                        }}
                        disabled={!processedImage}
                    >
                        Save to galery
                    </Button>
                </CardFooter>
            </Card>
        </ScrollArea>
    );
};

export default ImageUploader;
