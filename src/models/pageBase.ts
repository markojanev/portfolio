export interface IPageBase {
    init(): void;
    update(): void;
    clean(): void;
    destroy(): void;
}