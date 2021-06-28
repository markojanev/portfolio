export declare class Grid {
    private gridSize;
    private gridColumns;
    private gridRows;
    private gridMin;
    private rects;
    private currentRects;
    constructor(gridSize: number, gridColumns: number, gridRows: number, gridMin: number);
    generateRects(): any[];
    private splitCurrentRect;
    private randomInRange;
}
