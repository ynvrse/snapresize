export interface Stellaryst {
    id?: number;
    appName: string;
    owner: string;
    gitHub: string;
    sourceCode: string;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface StoredImage {
    id?: number;
    name: string;
    base64: string;
    type: string;
    date: Date;
}

export interface StoredSetting {
    id?: number;
    size: number;
    quality: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DatabaseSchema {
    stellaryst: Stellaryst;
}
