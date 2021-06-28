import { IImageData } from "./imageData.model";
export interface IGalleryData {
    title: string;
    iconUrl: string;
    images: IImageData[];
}
