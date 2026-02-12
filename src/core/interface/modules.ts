import { Color, FontAlign, FontSize, FontVerticalAlign } from './enums';
import { Initializable } from './Interfaces';
import { Cell, Coordinate, DisplayMetrics } from './Types';

export interface Renderer extends Initializable {
    render(grid: Cell[][]): void;
}

export interface RendererComposite extends Renderer {
    addRenderer(renderer: Renderer): void;
    displayMetrics: DisplayMetrics;
}

export interface Text extends Initializable {
    setDisplayMetrics(displayMetrics: DisplayMetrics): void;
    setActiveText(): void;
    setInactiveText(): void;
    setTextSize(fontSize: FontSize): void;
    setTextAlign(fontAlign: FontAlign, fontVerticalAlign: FontVerticalAlign): void;
    textOnHud(text: string, coordinate: Coordinate): void;
    textOnDisplay(text: string, coordinate: Coordinate): void;
}

export interface Grid extends Initializable {
    getGrid(): Cell[][];
    width: number;
    height: number;
    resetGrid(): void;
    forEach(callback: (cell: Cell) => void): void;
    isValidCoordinate(coordinate: Coordinate): boolean;
    getCell(coordinate: Coordinate): Cell | null;
    setCellValue(coordinate: Coordinate, value: number): void;
    setCellColor(coordinate: Coordinate, color: Color): void;
    isCellActive(coordinate: Coordinate): boolean;
    isCellInactive(coordinate: Coordinate): boolean;
    isRowFull(y: number): boolean;
    isRowEmpty(y: number): boolean;
    clearRow(y: number): void;
    shiftRowsDown(fromY: number): void;
    shiftRowsUp(fromY: number): void;
    clearFullRows(): number;
    isColumnFull(x: number): boolean;
    isColumnEmpty(x: number): boolean;
    clearColumn(x: number): void;
    shiftColumnsRight(fromX: number): void;
    shiftColumnsLeft(fromX: number): void;
    clearFullColumns(): number;
    isAreaOccupied(coordinates: Coordinate[]): boolean;
    fillArea(start: Coordinate, end: Coordinate, value: number, color: Color): void;
    stampPiece(coordinates: Coordinate[], value: number, color: Color): void;
}
