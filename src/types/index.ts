export interface Stellaryst {
    id?: number;
    appName: string;
    owner: string;
    gitHub: string;
    sourceCode: string;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface DatabaseSchema {
    stellaryst: Stellaryst;
}
