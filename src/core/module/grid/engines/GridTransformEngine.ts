import { Coordinate, Axis, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Engineering sub-module handling geometric boundary manipulations and complex piece translations.
 *
 * Implements the {@link Grid} transformation behaviors. It acts as an isolated stateless evaluator
 * providing mathematical projections (like rotation or mirroring) independently from the live game
 * state, guaranteeing original piece blocks are unsullied if an attempted projection intersects a wall.
 */
export default class GridTransformEngine {
    constructor(private grid: Grid) {}

    /**
     * Attempts to calculate a 90-degree radial offset around a defined center point.
     *
     * @param {Piece} piece - The specific layout array of logical cell metrics.
     * @param {Coordinate} origin - The mathematical center point for the rotational pivot.
     * @param {boolean} [clockwise=true] - The directional toggle controlling coordinate adjustments.
     * @returns {Piece} The modified Piece array or the original Piece if collisions occurred.
     */
    rotatePiece(piece: Piece, origin: Coordinate, clockwise: boolean = true): Piece {
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
            if (!this.grid.isCoordinateValid(cell.coordinate)) return true;
            const gridCell = this.grid.getCell(cell.coordinate);
            return gridCell && this.grid.isCellActive(gridCell) && !isPartofSelf(cell.coordinate);
        });

        return isInvalid ? piece : newPiece;
    }

    /**
     * Mirrors a piece mapping its internal locations reversely across a specific median axis.
     *
     * @param {Piece} piece - The specific layout array of logical cells to invert.
     * @param {Axis} axis - The 'x' or 'y' string declaring the geometric flip line.
     * @returns {Piece} The newly formatted piece instance with updated mirrored values.
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
     * Iterates all block chunks discovering maximum absolute spatial corners to establish a rect-box boundary.
     *
     * @param {Piece} piece - The piece containing scattered cell coordinates.
     * @returns {{min: Coordinate, max: Coordinate}} An object exposing corner extreme bounds.
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
