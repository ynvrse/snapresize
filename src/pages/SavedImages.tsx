// SavedImages.tsx
import LoadingScreen from '@/components/LoadingScreen';
import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStoredImages } from '@/hooks/useStoredImage';
import { base64ToBlob, downloadFile } from '@/lib/imageUtils';
import { format } from 'date-fns';
import { Download, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SavedImages() {
    const { storedImages, isLoading, deleteStoredImage } = useStoredImages();
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handleDownload = async (base64: string, name: string) => {
        try {
            const blob = await base64ToBlob(base64);
            downloadFile(blob, name);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteStoredImage(id);
            setSelectedImage(null);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    if (isLoading) return <LoadingScreen loading={isLoading} />;

    return (
        <div className="min-h-screen space-y-8 pb-8">
            <PageHeader>
                <PageHeaderHeading className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <ImageIcon className="h-8 w-8" />
                        <span>Saved Images</span>
                    </div>
                    <span className="text-sm font-normal">Total: {storedImages.length}</span>
                </PageHeaderHeading>
            </PageHeader>

            {storedImages.length === 0 ? (
                <Card>
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center space-y-4">
                        <ImageIcon className="text-muted-foreground h-16 w-16" />
                        <p className="text-muted-foreground text-lg">No images saved yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {storedImages.map((image) => (
                        <Card key={image.id} className="overflow-hidden">
                            <CardHeader className="p-0">
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={image.base64}
                                        alt={image.name}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 p-4">
                                <CardTitle className="line-clamp-1 text-sm">{image.name}</CardTitle>
                                <CardDescription className="text-xs">
                                    Saved on {format(new Date(image.date), 'MMM dd, yyyy')}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleDownload(image.base64, image.name)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Save
                                </Button>
                                <AlertDialog
                                    open={selectedImage === image.id}
                                    onOpenChange={(open) => !open && setSelectedImage(null)}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full text-white"
                                            onClick={() => setSelectedImage(image.id ?? 0)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your saved
                                                image.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive hover:bg-destructive/90 text-white"
                                                onClick={() => image.id && handleDelete(image.id)}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
