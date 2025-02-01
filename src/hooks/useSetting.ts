import { DB } from '@/lib/indexDBUtils';
import { StoredSetting } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export const useSettings = () => {
    const [setting, setSetting] = useState<StoredSetting | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Load pengaturan terbaru dari IndexedDB
    const loadSetting = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const savedSetting = await DB.getSetting();

            setSetting(savedSetting);
        } catch (err) {
            setError('Gagal mengambil pengaturan.');
            console.error('Error loading settings:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🔹 Simpan pengaturan baru
    const saveSetting = useCallback(async (newSetting: StoredSetting) => {
        setIsLoading(true);
        setError(null);

        try {
            await DB.saveSetting(newSetting);
            setSetting(newSetting);
        } catch (err) {
            setError('Gagal menyimpan pengaturan.');
            console.error('Error saving settings:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🔹 Ambil pengaturan saat pertama kali dipasang
    useEffect(() => {
        loadSetting();
    }, [loadSetting]);

    return {
        setting,
        isLoading,
        error,
        saveSetting,
        refreshSetting: loadSetting,
    };
};
