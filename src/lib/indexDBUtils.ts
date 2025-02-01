import { StoredImage, StoredSetting } from '@/types';
import { toast } from 'sonner';

class Database {
    private dbName = 'snapresize_db';
    private imageStore = 'images';
    private settingStore = 'settings';
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 11);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create images store if it doesn't exist
                if (!db.objectStoreNames.contains(this.imageStore)) {
                    const imageStore = db.createObjectStore(this.imageStore, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    imageStore.createIndex('date', 'date', { unique: false });
                }

                // Create settings store if it doesn't exist
                if (!db.objectStoreNames.contains(this.settingStore)) {
                    const settingStore = db.createObjectStore(this.settingStore, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    // Add default settings
                    settingStore.add({
                        id: 1,
                        size: 400,
                        quality: 0.8,
                    });
                }
            };
        });
    }

    async saveImage(imageData: StoredImage): Promise<number> {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.imageStore, 'readwrite');
            const store = transaction.objectStore(this.imageStore);
            const request = store.add(imageData);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllImages(): Promise<StoredImage[]> {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.imageStore, 'readonly');
            const store = transaction.objectStore(this.imageStore);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getLatestImage(): Promise<StoredImage | null> {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.imageStore, 'readonly');
            const store = transaction.objectStore(this.imageStore);
            const index = store.index('date');
            const request = index.openCursor(null, 'prev');

            request.onsuccess = () => {
                const cursor = request.result;
                resolve(cursor ? cursor.value : null);
            };

            request.onerror = () => reject(request.error);
        });
    }

    async deleteImage(id: number): Promise<void> {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.imageStore, 'readwrite');
            const store = transaction.objectStore(this.imageStore);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async saveSetting(settingData: StoredSetting): Promise<number> {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.settingStore, 'readwrite');
            const store = transaction.objectStore(this.settingStore);
            const request = store.put(settingData);

            request.onsuccess = () => {
                resolve(request.result as number);
            };

            request.onerror = () => {
                reject(request.error);
                toast.error('Setting not saved');
            };
        });
    }

    async getSetting(): Promise<StoredSetting | null> {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.settingStore, 'readonly');
            const store = transaction.objectStore(this.settingStore);
            const request = store.get(1);

            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    }
}

export const DB = new Database();
