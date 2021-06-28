import { App } from "./app";
import { IPageBase } from "./models/pageBase";
export declare class MainPage implements IPageBase {
    private _app;
    private _sprites;
    private _imageSize;
    private _iconContainer;
    private _moonTween;
    private onIconOverHandlers;
    private onIconOutHandlers;
    private onClickHandlers;
    constructor(_app: App);
    init(): void;
    update(): void;
    clean(): void;
    destroy(): void;
    private upScaleIcon;
    private downScaleIcon;
    private toNextGallery;
    private initVisualDevIconData;
}
