export interface GeminiFileUploadResponse {
    uri?: string;
    fileUri?: string;
    id?: string;
    name?: string;
    mimeType?: string;
    contentType?: string;
    size?: number;
    raw?: any;
}

export interface GeminiListFilesResponse {
    files: GeminiFileMetadata[];
    nextPageToken?: string;
    raw?: any;
}

export interface GeminiListFilesApiResponse {
    files?: GeminiFileMetadata[];
    items?: GeminiFileMetadata[];
    results?: GeminiFileMetadata[];
    nextPageToken?: string;
    next_page_token?: string;
}

export interface GeminiGetFileMetadataResponse {
    file?: GeminiFileMetadata;
}

export interface GeminiDownloadFileResponse {
    arrayBuffer?: ArrayBuffer;
    size?: number;
    raw?: any;
    data?: string;
    buffer?: Uint8Array | Buffer;
}

export interface GeminiFileMetadata {
    uri: string;
    name: string;
    mimeType: string;
    size: number | null;
    raw?: any;
}
