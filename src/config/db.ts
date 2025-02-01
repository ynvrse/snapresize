import { openDB } from 'idb';

export const initDB = async () => {
    return openDB('snapresize_db', 11, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('settings')) {
                const defaultSetting = db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });

                defaultSetting.add({
                    id: 1,
                    size: 400,
                    quality: 0.6,
                });
            }
            if (!db.objectStoreNames.contains('images')) {
                db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};
