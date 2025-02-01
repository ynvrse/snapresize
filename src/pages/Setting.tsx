import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DB } from '@/lib/indexDBUtils';
import { StoredSetting } from '@/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Setting() {
    const [size, setSize] = useState<number | undefined>();
    const [quality, setQuality] = useState<number | undefined>();

    const { register, setValue, handleSubmit, watch } = useForm({
        defaultValues: { size: size ?? 50, quality: quality ?? 0.5 }, // Initialize with default values
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await DB.getSetting();
                if (settings) {
                    setSize(settings.size);
                    setQuality(settings.quality);
                    setValue('size', settings.size); // Sync form state with DB
                    setValue('quality', settings.quality);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };

        fetchSettings();
    }, [setValue]);

    // Watch the values to update local state and form state synchronously
    useEffect(() => {
        const formSize = watch('size');
        const formQuality = watch('quality');
        if (formSize !== undefined) setSize(formSize);
        if (formQuality !== undefined) setQuality(formQuality);
    }, [watch]);

    const onSubmit = async (data: StoredSetting) => {
        try {
            await DB.saveSetting({ id: 1, ...data });
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Setting Page</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Label htmlFor="size" className="leading-relaxed">
                                Resize: {size}px
                            </Label>
                            <Slider
                                id="size"
                                value={size ? [size] : [50]} // Ensure value is always an array
                                min={50}
                                max={1200}
                                step={50}
                                onValueChange={(value) => {
                                    setValue('size', value[0]);
                                    setSize(value[0]); // Update local state for immediate visual feedback
                                }}
                            />

                            <Label htmlFor="quality" className="leading-relaxed">
                                Quality: {quality}
                            </Label>
                            <Slider
                                id="quality"
                                value={quality ? [quality] : [0.5]} // Ensure value is always an array
                                min={0.1}
                                max={1}
                                step={0.1}
                                onValueChange={(value) => {
                                    setValue('quality', value[0]);
                                    setQuality(value[0]); // Update local state for immediate visual feedback
                                }}
                            />

                            <Button type="submit" className="mt-4 w-full">
                                Save Settings
                            </Button>
                        </form>
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    );
}
