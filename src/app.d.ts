import { Application, Container, TickerCallback } from 'pixi.js';
import { CRTFilter } from '@pixi/filter-crt';
import { ContentfulService } from './services/contentful.service';
import { IPageBase } from './models/pageBase';
import { IGalleryData } from './models/gallery.model';
export declare class App {
    width: number;
    height: number;
    instance: Application;
    resources: {
        [name: string]: import("pixi.js").ILoaderResource;
    };
    uniforms: any;
    resizeTimer: any;
    crtFilter: CRTFilter;
    page: IPageBase | undefined;
    parentDiv: HTMLDivElement;
    galleries: IGalleryData[];
    backgroundContainer: Container;
    contentfulService: ContentfulService;
    constructor();
    preload(galleries: IGalleryData[]): void;
    init(): void;
    tickerHandler: TickerCallback<App>;
    private initDimensions;
    private initBackground;
    private initContainer;
    private initApp;
    clean(): void;
    nextPage(initializerCallback: Function): void;
}
