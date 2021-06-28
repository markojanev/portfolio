import { Application, Container, Graphics, Loader, TickerCallback } from 'pixi.js';
import { CRTFilter } from '@pixi/filter-crt';
import { ContentfulService } from './services/contentful.service';
import { MainPage } from './main-page';
import { IPageBase } from './models/pageBase';
import { IGalleryData } from './models/gallery.model';

export class App {
    public width: number = 0;
    public height: number = 0;
    public instance: Application;
    public resources = Loader.shared.resources;
    public uniforms: any;
    public resizeTimer: any;
    public crtFilter: CRTFilter = new CRTFilter();
    public page: IPageBase | undefined;
    public parentDiv: HTMLDivElement;
    public galleries: IGalleryData[] = [];
    public backgroundContainer = new Container();

    public contentfulService: ContentfulService = new ContentfulService();

    constructor() {
        const view = document.querySelector('.view') as HTMLCanvasElement;

        this.parentDiv = document.querySelector('.parent') as HTMLDivElement;
        this.instance = new Application({ view: view, antialias: true });
        
        const bindedPreload = this.preload.bind(this);
        this.contentfulService.preloadData(bindedPreload);
    }

    public preload(galleries: IGalleryData[]): void {
        this.galleries = galleries;

        Loader.shared.add([
            'assets/shaders/stageFragment.glsl'
        ]).load(() => {
            this.page = new MainPage(this);
            this.init();
            window.addEventListener('resize', () => {
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(() => {
                    this.clean();
                    this.init();
                }, 200);
            });
        });
    }

    public init(): void {
        this.initDimensions();
        this.initApp();
        this.initBackground();
        this.initContainer();

        this.page?.init();

        this.instance?.ticker.add(this.tickerHandler);
        this.instance?.ticker.start();
        this.instance?.renderer.render(this.instance.stage);
    }

    public tickerHandler: TickerCallback<App> = () => {
        this.page?.update();
        this.crtFilter.time += 1.0;
    };

    private initDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    private initBackground() {
        this.crtFilter.curvature = 2.1;
        this.crtFilter.lineWidth = 0.3;
        this.crtFilter.lineContrast = 0.3;
        this.crtFilter.noise = 0.5;
        this.crtFilter.noiseSize = 0.9;
        this.crtFilter.vignetting = 0;
        this.crtFilter.vignettingAlpha = 0;
        this.crtFilter.vignettingBlur = 0;

        const backgroundColor = new Graphics();
        backgroundColor.beginFill(0xE6E3DC);
        backgroundColor.drawRect(0, 0, this.width, this.height);
        backgroundColor.endFill();
        // backgroundColor.filters = [this.crtFilter];

        this.backgroundContainer.addChild(backgroundColor);
        this.instance.stage.addChild(this.backgroundContainer);
    }
    
    private initContainer(): void {
    }

    private initApp(): void {
        this.instance.renderer.view.style.position = "absolute";
        this.instance.renderer.view.style.display = "block";
        this.instance.renderer.resize(this.width, this.height);
        this.instance.stage.interactive = true;
    }

    public clean(): void {
        this.instance.ticker.stop();
        this.page?.clean();
    }

    public nextPage(initializerCallback: Function): void {
        this.clean();
        this.page = initializerCallback();
        this.init();
    }
}