import { ContentfulClientApi, createClient, Entry } from "contentful";
import { environment } from "../environment/environment";
import { IGalleryData } from "../models/gallery.model";
import { IImageData } from "../models/imageData.model";

export class ContentfulService {
    private _contentfulClient: ContentfulClientApi;

    constructor() {
        this._contentfulClient = createClient({
            space: environment.contentful.spaceId,
            accessToken: environment.contentful.token
        });
    }

    public preloadData(callback: Function): void {
        let galleries: IGalleryData[] = [];

        const galleriesJSON = sessionStorage.getItem("galleries");
        if (galleriesJSON) {
            galleries = JSON.parse(galleriesJSON);
            callback(galleries);
        } else {
            this._contentfulClient.getEntries({content_type: "gallery" })
                .then((g: any) => {
                    galleries = g.items.map((gallery: Entry<any>) => {
                        return {
                            title: gallery.fields.title,
                            iconUrl: gallery.fields.icon.fields.file.url,
                            images: gallery.fields.images.map((image: Entry<any>) => {
                                return {
                                    title: image.fields.title || "",
                                    description: image.fields.description || "",
                                    width: image.fields.file.details.image.width,
                                    height: image.fields.file.details.image.height,
                                    url: image.fields.file.url
                                } as IImageData
                            })
                        } as IGalleryData;
                    });

                    sessionStorage.setItem("galleries", JSON.stringify(galleries));
                    callback(galleries);
                });
        }
    }
}