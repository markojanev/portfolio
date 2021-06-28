import { Container, Filter, Graphics, Point, Rectangle, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { Grid } from "./grid";
import { App } from "./app";
import { IPageBase } from "./models/pageBase";
import { IGalleryData } from "./models/gallery.model";
import gsap from "gsap";
import { MainPage } from "./main-page";
import { environment } from "./environment/environment";

const GRID_SIZE = 20;
const GRID_MIN = 8;
const IMAGE_PADDING = 40;

const T_FACTOR = 0.2;
const INIT_ALPHA = 0.8;
const OVER_SCALE = 1.05;

export class Gallery implements IPageBase {
    private _pointerDownTarget: number = 0;
    private _pointerStart: Point = new Point();
    private _pointerDiffStart: Point = new Point();
    private _diffX: number = 0;
    private _diffY: number = 0;
    private _uniforms: any;
    private _widthRest: number = 0;
    private _heightRest: number = 0;
    private _centerX: number = 0;
    private _centerY: number = 0;
    private _rects: any[] = [];
    private _mouseIsHeldDown: boolean = false;
    private _sprites: Sprite[] = [];
    private _borders: Graphics[] = [];
    private _hoveredImageUrl: string = "";
    private _galleryContainer = new Container();


    private imageMouseOverHandlers: Function[] = [];
    private imageMouseOutHandlers: Function[] = [];
    private onBackClicked = () => { };

    constructor(
        private _app: App,
        private _galleryData: IGalleryData) {
        window.onbeforeunload = () => this.goToMainPage();

        history.pushState(null, "", document.URL);
        window.addEventListener('popstate', () => {
            history.pushState(null, "", document.URL);
            this.onBackClicked();
        });
    }

    public init(): void {
        this.initShaders();
        this.initGrid();
        this.initRectsAndImages();
        this.initNavigation();
        this.initEvents();
    }

    public update(): void {
        this._uniforms.uPointerDown += (this._pointerDownTarget - this._uniforms.uPointerDown) * 0.075;
        this._uniforms.uPointerDiff.x += (this._diffX - this._uniforms.uPointerDiff.x) * 0.2;
        this._uniforms.uPointerDiff.y += (this._diffY - this._uniforms.uPointerDiff.y) * 0.2;

        this._galleryContainer.x = this._uniforms.uPointerDiff.x - this._centerX;
        this._galleryContainer.y = this._uniforms.uPointerDiff.y - this._centerY;
    }

    public initShaders(): void {
        this._uniforms = {
            uResolution: new Point(this._app.width, this._app.height),
            uPointerDiff: new Point(),
            uPointerDown: this._pointerDownTarget
        }

        const stageFragmentShader = this._app.resources['assets/shaders/stageFragment.glsl'].data;
        const stageFilter = new Filter(undefined, stageFragmentShader, this._uniforms);
        this._app.instance.stage.filters = [stageFilter];
    }

    private initEvents(): void {
        (this._app.instance.stage as any)
            .on('pointerdown', this.onDragPointerDown)
            .on('pointerup', this.onDragPointerUp)
            .on('pointerupoutside', this.onDragPointerUp)
            .on('pointermove', this.onDragPointerMove);
    }

    private onDragPointerDown = (e: any) => {
        this._mouseIsHeldDown = true;

        setTimeout(() => {
            if (this._mouseIsHeldDown) {
                const { x, y } = e.data.global;
                this._pointerDownTarget = 1;
                this._pointerStart.set(x, y);
                this._pointerDiffStart = this._uniforms.uPointerDiff.clone();
            }
        }, 80);
    }

    private onDragPointerUp = () => {
        this._pointerDownTarget = 0;
        this._mouseIsHeldDown = false;

        if (this._hoveredImageUrl !== "") {
            const imageBackground = document.createElement('div') as HTMLDivElement;
            const imageContainer = document.createElement('div') as HTMLDivElement;
            const imageElement = document.createElement('img') as HTMLImageElement;


            imageBackground.classList.add("img-background", "absolute");
            imageContainer.classList.add("img-container", "absolute");
            imageElement.classList.add("imgElement");

            this.onBackClicked = () => {
                imageElement.removeEventListener('click', this.onBackClicked, false);
                imageElement.remove();
                imageBackground.remove();
                imageContainer.remove();
            };

            imageContainer.addEventListener('click', this.onBackClicked);
            imageElement.src = this._hoveredImageUrl;

            imageContainer.append(imageElement);
            this._app.parentDiv.append(imageBackground, imageContainer);
        }
    }

    private onDragPointerMove = (e: any) => {
        const { x, y } = e.data.global;

        if (this._pointerDownTarget && this._mouseIsHeldDown) {
            this._diffX = this._pointerDiffStart.x + (x - this._pointerStart.x);
            this._diffY = this._pointerDiffStart.y + (y - this._pointerStart.y);
            this._diffX = this._diffX > 0 ? Math.min(this._diffX, this._centerX + IMAGE_PADDING) : Math.max(this._diffX, -(this._centerX + this._widthRest));
            this._diffY = this._diffY > 0 ? Math.min(this._diffY, this._centerY + IMAGE_PADDING) : Math.max(this._diffY, -(this._centerY + this._heightRest));
            this._hoveredImageUrl = "";
        }
    }

    private initGrid(): void {
        const gridColumns = Math.ceil(this._app.width / GRID_SIZE);
        const gridRows = Math.ceil(this._app.width / GRID_SIZE);
        const grid = new Grid(GRID_SIZE, gridColumns, gridRows, GRID_MIN);

        this._widthRest = Math.ceil(gridColumns * GRID_SIZE - this._app.width + 100);
        this._heightRest = Math.ceil(gridRows * GRID_SIZE - this._app.height + 100);

        this._centerX = (gridColumns * GRID_SIZE / 2) - (gridColumns * GRID_SIZE / 2);
        this._centerY = (gridRows * GRID_SIZE / 2) - (gridRows * GRID_SIZE / 2);

        this._rects = grid.generateRects();
    }

    private initNavigation(): void {
        const navbar = document.querySelector('.navbar') as HTMLDivElement;
        const title = document.createElement('h1') as HTMLHeadingElement;
        const backBtn = document.createElement('div') as HTMLDivElement;
        backBtn.classList.add("backBtn");

        title.innerText = this._galleryData.title;
        backBtn.innerText = "Back";

        navbar.append(title, backBtn);

        const onBackClick = () => {
            backBtn.removeEventListener('click', onBackClick, false);
            backBtn.remove();
            title.remove();

            this.goToMainPage();
        };

        backBtn.addEventListener('click', onBackClick);
        this._app.parentDiv.append(navbar);
    }

    private initRectsAndImages(): void {
        this._galleryContainer.x = this._galleryContainer.y = 0;
        this._galleryContainer.width = this._app.width;
        this._galleryContainer.height = this._app.height;

        this._rects.forEach((rect: any, idx: number) => {
            const imageData = this._galleryData.images[idx];

            if (!imageData) {
                return;
            }

            const imageX = rect.x * GRID_SIZE;
            const imageY = rect.y * GRID_SIZE;
            const imageW = rect.w * GRID_SIZE - IMAGE_PADDING;
            const imageH = rect.h * GRID_SIZE - IMAGE_PADDING;

            // Setup Borders
            const border = new Graphics();
            const borderX = imageX - 8;
            const borderY = imageY - 8;
            const borderW = imageW + 16;
            const borderH = imageH + 30

            border.beginFill(0xFFFFFB);
            border.drawRect(0, 0, borderW, borderH);
            border.endFill();
            border.x = borderX;
            border.y = borderY;

            this._borders.push(border);
            this._galleryContainer.addChild(border);

            Texture.fromURL(imageData.url).then(tex => {
                const baseTexture = tex.baseTexture;
                const inputWidth = tex.width;
                const inputHeight = tex.height;

                const inputAspect = inputWidth / inputHeight;
                const outputAspect = imageW / imageH;

                let outputWidth = inputWidth;
                let outputHeight = inputHeight;

                if (inputAspect > outputAspect) {
                    outputWidth = inputHeight * outputAspect;
                } else if (inputAspect < outputAspect) {
                    outputHeight = inputWidth / outputAspect;
                }

                baseTexture.scaleMode = SCALE_MODES.LINEAR;

                const outputX = (outputWidth - inputWidth);
                const outputY = (outputHeight - inputHeight);

                const textureRect = new Rectangle(-outputX, -outputY, outputWidth, outputHeight);
                const texture = new Texture(baseTexture, textureRect);

                const sprite = new Sprite();
                sprite.alpha = INIT_ALPHA;
                sprite.texture = texture;
                sprite.x = imageX;
                sprite.y = imageY;
                sprite.width = imageW;
                sprite.height = imageH;
                sprite.interactive = sprite.buttonMode = true;

                this.imageMouseOverHandlers[idx] = () => {
                    if (this._pointerDownTarget && this._mouseIsHeldDown) {
                        return;
                    };
                    gsap.to(sprite, { duration: T_FACTOR, alpha: 1.0, y: sprite.y - 10 });
                    gsap.to(border, { duration: T_FACTOR, y: border.y - 10 });

                    this._hoveredImageUrl = imageData.url;
                }

                this.imageMouseOutHandlers[idx] = () => {
                    this._hoveredImageUrl = "";
                    gsap.to(sprite, { duration: T_FACTOR, alpha: INIT_ALPHA, y: imageY });
                    gsap.to(border, { duration: T_FACTOR, y: borderY });
                }

                (sprite as any)
                    .on('mouseover', this.imageMouseOverHandlers[idx])
                    .on('mouseout', this.imageMouseOutHandlers[idx]);

                this._sprites.push(sprite);
                this._galleryContainer.addChild(sprite);
            });
        });

        this._app.instance.stage.addChild(this._galleryContainer);
    }

    public clean(): void {
        // Must Refactor this to properly remove the listeners
        (this._app.instance.stage as any)
            .off('pointerdown', this.onDragPointerDown)
            .off('pointerup', this.onDragPointerUp)
            .off('pointerupoutside', this.onDragPointerUp)
            .off('pointermove', this.onDragPointerMove)

        this._sprites.forEach((sprite: Sprite, idx: number) => {
            (sprite as any)
                .off('mouseover', this.imageMouseOverHandlers[idx])
                .off('mouseout', this.imageMouseOutHandlers[idx]);

            this._galleryContainer.removeChild(sprite);
            this._galleryContainer.removeChild(this._borders[idx]);

            const rect = this._rects[idx];

            if (rect.discovered && !rect.loaded) {
                rect.controller.abort()
            }
        });

        this._sprites = [];
        this._borders = [];
        this._app.instance.stage.filters = [];
        this._app.instance.stage.removeChild(this._galleryContainer);
    }

    public goToMainPage(): void {
        this._app.nextPage(() => new MainPage(this._app));
    }

    public destroy(): void {

    }
}