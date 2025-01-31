import { openDB } from 'idb';

export const initDB = async () => {
    return openDB('snapresize_db', 11, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('images')) {
                db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};
