import { MediaService } from './media.service';
export declare class MediaController {
    private mediaService;
    constructor(mediaService: MediaService);
    getItems(): Promise<void | "K6 testing media server">;
    getItemsByIdListApk(): string;
    getSingleItem(): string;
    getMultiSignedUrl(): string;
    uploadImageSmokeTest(): Promise<void>;
}
