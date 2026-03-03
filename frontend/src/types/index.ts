export interface Song {
    id: number;
    title: string;
    lyrics: string;
    version: number;
    user_id: number;
}

export interface User {
    id: number;
    created_at: string;
    name: string;
    email: string;
    activated: boolean;
}

export interface Token {
    token: string;
    expiry: string;
}

export interface Word {
    word: string;
    score?: number;
    numSyllables?: number;
}

export class FetchError extends Error {
    status: number;
    data: any;

    constructor(response: Response, result: any) {
        super('Request Failed');
        this.status = response.status
        this.data = result.error
    }
}

