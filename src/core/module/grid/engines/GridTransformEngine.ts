import { Coordinate, Axis, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Handles geometric transformations for pieces on the grid.
 */
export default class GridTransformEngine {
    constructor(private grid: Grid) {}

    /**
     * Attempts to rotate a piece 90 degrees around a specific origin.
     */
    rotatePiece(piece: Piece, origin: Coordinate, clockwise: boolean = true): Piece | null {
        const newPiece: Piece = piece.map(cell => {
            const relX = cell.coordinate.x - origin.x;
            const relY = cell.coordinate.y - origin.y;

            const newRelX = clockwise ? -relY : relY;
            const newRelY = clockwise ? relX : -relX;

            return {
                ...cell,
                coordinate: {
                    x: origin.x + newRelX,
                    y: origin.y + newRelY,
                },
            };
        });

        const isPartofSelf = (coord: Coordinate) => piece.some(c => c.coordinate.x === coord.x && c.coordinate.y === coord.y);

        const isInvalid = newPiece.some(cell => {
            if (!this.grid.isValidCoordinate(cell.coordinate)) return true;
            return this.grid.isCellActive(cell.coordinate) && !isPartofSelf(cell.coordinate);
        });

        return isInvalid ? null : newPiece;
    }

    /**
     * Mirrors a piece across a specific axis relative to its bounding box.
     */
    mirrorPiece(piece: Piece, axis: Axis): Piece {
        if (piece.length === 0) return [];

        const bounds = this.getPieceBounds(piece);
        const center = axis === 'x' ? (bounds.min.x + bounds.max.x) / 2 : (bounds.min.y + bounds.max.y) / 2;

        return piece.map(cell => ({
            ...cell,
            coordinate: {
                x: axis === 'x' ? Math.round(2 * center - cell.coordinate.x) : cell.coordinate.x,
                y: axis === 'y' ? Math.round(2 * center - cell.coordinate.y) : cell.coordinate.y,
            },
        }));
    }

    /**
     * Calculates the bounding box of a piece.
     */
    getPieceBounds(piece: Piece): { min: Coordinate; max: Coordinate } {
        const xs = piece.map(c => c.coordinate.x);
        const ys = piece.map(c => c.coordinate.y);

        return {
            min: { x: Math.min(...xs), y: Math.min(...ys) },
            max: { x: Math.max(...xs), y: Math.max(...ys) },
        };
    }
}
