// Class to generate a random masonry layout, using a square grid as base
export class Grid {
    private gridSize: number;
    private gridColumns: number;
    private gridRows: number;
    private gridMin: number;
    private rects: any[];
    private currentRects: any[];
    // The constructor receives all the following parameters:
    // - gridSize: The size (width and height) for smallest unit size
    // - gridColumns: Number of columns for the grid (width = gridColumns * gridSize)
    // - gridRows: Number of rows for the grid (height = gridRows * gridSize)
    // - gridMin: Min width and height limits for rectangles (in grid units)
    constructor(gridSize: number, gridColumns: number, gridRows: number, gridMin: number) {
        this.gridSize = gridSize;
        this.gridColumns = gridColumns;
        this.gridRows = gridRows;
        this.gridMin = gridMin;
        this.rects = [];
        this.currentRects = [{ x: 0, y: 0, w: this.gridColumns, h: this.gridRows }];
    }

    public generateRects(): any[] {
        
        while (this.currentRects.length) {
            this.splitCurrentRect()
        }

        this.rects = this.rects
            .sort((a: any, b: any) => a.y - b.y);
        return this.rects;
    }

    // Takes the first rectangle on the list, and divides it in 2 more rectangles if possible
    private splitCurrentRect(): void {
        if (this.currentRects.length) {
            const currentRect = this.currentRects.shift();
            const cutVertical = currentRect.w > currentRect.h;
            const cutSide = cutVertical ? currentRect.w : currentRect.h;
            const cutSize = cutVertical ? 'w' : 'h';
            const cutAxis = cutVertical ? 'x' : 'y';
            if (cutSide > this.gridMin * 2) {
                const rect1Size = this.randomInRange(this.gridMin, cutSide - this.gridMin);
                const rect1 = Object.assign({}, currentRect, { [cutSize]: rect1Size });
                const rect2 = Object.assign({}, currentRect, { [cutAxis]: currentRect[cutAxis] + rect1Size, [cutSize]: currentRect[cutSize] - rect1Size });
                this.currentRects.push(rect1, rect2);
            }
            else {
                this.rects.push(currentRect);
                this.splitCurrentRect();
            }
        }
    }

    private randomInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}