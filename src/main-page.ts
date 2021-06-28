import gsap from "gsap";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { App } from "./app";
import { IPageBase } from "./models/pageBase";
import { Gallery } from "./gallery";
import { IGalleryData } from "./models/gallery.model";
import { environment } from "./environment/environment";

const MAX_SCALE = 1.2;
const T_FACTOR = 0.2;
const IMG_PADDING = 20;

export class MainPage implements IPageBase {
    private _sprites: Container[] = [];

    // Images are the same width and height;
    private _imageSize: number = 0;
    private _iconContainer = new Container();

    private _moonTween: gsap.core.Tween | undefined;

    // Event handlers
    private onIconOverHandlers: Function[] = [];
    private onIconOutHandlers: Function[] = [];
    private onClickHandlers: Function[] = [];

    constructor(private _app: App) { }

    public init(): void {
        const containerSize = window.innerHeight - 200;
        this._iconContainer.width = this._iconContainer.height = containerSize;
        this._iconContainer.x = window.innerWidth / 2 - containerSize / 2;
        this._iconContainer.y = window.innerHeight / 2 - containerSize / 2 - 50;

        // DEBUG Container Bounds
        if (environment.debug) {
            const debugContainerBounds = new Graphics();
            debugContainerBounds.alpha = 0.5;
            debugContainerBounds.beginFill(0x00FF00);
            debugContainerBounds.drawRect(0, 0, containerSize, containerSize);
            debugContainerBounds.endFill();

            this._iconContainer.addChild(debugContainerBounds);
        }

        this._imageSize = (containerSize - IMG_PADDING) / 2;

        let imgStartPosX = this._imageSize / 2;
        let imgStartPosY = this._imageSize / 2;

        this._app.galleries.forEach((galleryData: IGalleryData, idx: number) => {
            const currImgX = imgStartPosX;
            const currImgY = imgStartPosY;

            imgStartPosX += this._imageSize + IMG_PADDING;
            if (idx == 1) {
                imgStartPosX = this._imageSize / 2;
                imgStartPosY += (this._imageSize + IMG_PADDING);
            }

            // DEBUG Image Bounds
            if (environment.debug) {
                const debugBounds = new Graphics();
                debugBounds.alpha = 0.5;
                debugBounds.beginFill(0xFF0000);
                debugBounds.drawRect(
                    currImgX - this._imageSize / 2,
                    currImgY - this._imageSize / 2,
                    this._imageSize,
                    this._imageSize);
                debugBounds.endFill();

                this._iconContainer.addChild(debugBounds);
            }

            if (idx == 2) {
                const visualDevContainer = this.initVisualDevIconData();
                visualDevContainer.x = currImgX;
                visualDevContainer.y = currImgY;
                visualDevContainer.width = visualDevContainer.height = this._imageSize;
                visualDevContainer.interactive = true;
                visualDevContainer.buttonMode = true;

                this.onIconOverHandlers[idx] = () => {
                    this.upScaleIcon(visualDevContainer);
                    this._moonTween?.timeScale(40.0);
                };

                this.onIconOutHandlers[idx] = () => {
                    this.downScaleIcon(visualDevContainer);
                    this._moonTween?.timeScale(1.0);
                };
                this.onClickHandlers[idx] = () => this.toNextGallery(galleryData);

                this._sprites[idx] = visualDevContainer;
                this._iconContainer.addChild(visualDevContainer);

                (visualDevContainer as any)
                    .on('pointerover', this.onIconOverHandlers[idx])
                    .on('pointerout', this.onIconOutHandlers[idx])
                    .on('pointerup', this.onClickHandlers[idx]);
            }
            else {
                Texture.fromURL(galleryData.iconUrl)
                    .then(texture => {
                        const sprite = Sprite.from(texture);

                        sprite.x = currImgX;
                        sprite.y = currImgY;
                        sprite.width = sprite.height = this._imageSize;
                        sprite.anchor.set(0.5);
                        sprite.interactive = true;
                        sprite.buttonMode = true;

                        this.onIconOverHandlers[idx] = () => this.upScaleIcon(sprite);
                        this.onIconOutHandlers[idx] = () => this.downScaleIcon(sprite);
                        this.onClickHandlers[idx] = () => this.toNextGallery(galleryData);

                        this._iconContainer.addChild(sprite);
                        this._sprites[idx] = sprite;

                        (sprite as any)
                            .on('pointerover', this.onIconOverHandlers[idx])
                            .on('pointerout', this.onIconOutHandlers[idx])
                            .on('pointerup', this.onClickHandlers[idx]);
                    });
            }
        });

        this._app.instance.stage.addChild(this._iconContainer);
    }

    public update(): void {
    }

    public clean(): void {
        this._sprites.forEach((sprite: Container, idx: number) => {
            this._iconContainer.removeChild(sprite);
            (sprite as any)
                .off('pointerup', this.onClickHandlers[idx])
                .off('pointerout', this.onIconOutHandlers[idx])
                .off('pointerover', this.onIconOverHandlers[idx]);

        });

        this._app.instance.stage.removeChild(this._iconContainer);
    }

    public destroy(): void {
        this.clean();
    }

    private upScaleIcon(sprite: Container): void {
        gsap.to(sprite, {
            duration: T_FACTOR,
            width: sprite.width * MAX_SCALE,
            height: sprite.height * MAX_SCALE
        });
    }

    private downScaleIcon(sprite: Container): void {
        gsap.to(sprite, {
            duration: T_FACTOR,
            width: this._imageSize,
            height: this._imageSize
        });
    }

    private toNextGallery(galleryData: IGalleryData): void {
        this._app.nextPage(() => new Gallery(this._app, galleryData));
    }

    private initVisualDevIconData(): Container {
        const path = "assets/images/VisualDevelopment";
        // The order is important.
        const sprites = [
            Sprite.from(`${path}/visual_development_background.png`),
            Sprite.from(`${path}/visual_development_moon.png`),
            Sprite.from(`${path}/visual_development_city.png`),
            Sprite.from(`${path}/visual_development_clouds_1.png`),
            Sprite.from(`${path}/visual_development_clouds_2.png`),
            Sprite.from(`${path}/visual_development_clouds_3.png`),
            Sprite.from(`${path}/visual_development_clouds_0.png`)
        ];

        const cloudsBig = sprites[sprites.length - 1];
        gsap.to(cloudsBig, { duration: 2, x: cloudsBig.x + 4, yoyoEase: true, repeat: -1 });

        const visualDevContainer = new Container();

        sprites.forEach((sprite: Sprite, idx: number) => {
            sprite.width = sprite.height = this._imageSize;
            const isMoon = idx === 1;
            if (isMoon) {
                const backgroundMask = Sprite.from(`${path}/visual_development_background_mask.png`);

                backgroundMask.width = backgroundMask.height = this._imageSize;
                backgroundMask.x = backgroundMask.y = 0;
                backgroundMask.anchor.set(0.5);
                visualDevContainer.addChild(backgroundMask);

                sprite.mask = backgroundMask;
                sprite.pivot.x = sprite.pivot.y = this._imageSize / 4;
                sprite.x = this._imageSize / 2;
                sprite.y = this._imageSize / 4;

                this._moonTween = gsap.fromTo(sprite,
                    { rotation: 2.46 },
                    { duration: 8, repeat: -1, rotation: 4.26, ease: 'linear' });

                this._moonTween.seek(4.5);
                this._moonTween.play();

            } else {
                sprite.x = sprite.y = 0;
                sprite.anchor.set(0.5);
            }
            sprite.interactive = true;
            // sprite.buttonMode = true;
            visualDevContainer.addChild(sprite);
        });



        return visualDevContainer;
    }
}