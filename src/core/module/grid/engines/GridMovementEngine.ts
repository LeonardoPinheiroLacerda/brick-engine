import { Cell, Coordinate, Vector, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Engineering sub-module providing single and multi-cell velocity behaviors.
 *
 * Implements the {@link Grid} physical positioning operations. It resolves vector translations
 * against the static cell board, mapping out exact placement steps or rejecting invalid logic
 * before game states have a chance to falsely render overlaps.
 */
export default class GridMovementEngine {
    constructor(private grid: Grid) {}

    /**
     * Modifies the piece footprint iterating all target cells mathematically towards a given offset.
     *
     * @param {Piece} piece - The original collection of dynamically bound target cells.
     * @param {Vector} direction - The spatial translation array declaring x/y offset integers.
     * @returns {Piece} A new piece copy reflecting changes, or the old identical piece if restricted.
     */
    movePiece(piece: Piece, direction: Vector): Piece {
        const newPiece: Piece = piece.map(cell => ({
            ...cell,
            coordinate: {
                x: cell.coordinate.x + (direction.x || 0),
                y: cell.coordinate.y + (direction.y || 0),
            },
        }));

        const isPartofSelf = (coord: Coordinate) => piece.some(c => c.coordinate.x === coord.x && c.coordinate.y === coord.y);

        const isInvalid = newPiece.some(cell => {
            if (!this.grid.isCoordinateValid(cell.coordinate)) return true;
            const gridCell = this.grid.getCell(cell.coordinate);
            return gridCell && this.grid.isCellActive(gridCell) && !isPartofSelf(cell.coordinate);
        });

        return isInvalid ? piece : newPiece;
    }

    /**
     * Alias for {@link movePiece} shifting one unit left continuously.
     *
     * @param {Piece} piece - The specific piece payload shifting.
     * @returns {Piece} The new valid piece output.
     */
    movePieceLeft(piece: Piece): Piece {
        return this.movePiece(piece, { x: -1, y: 0 });
    }
    /**
     * Alias for {@link movePiece} shifting one unit right continuously.
     *
     * @param {Piece} piece - The specific piece payload shifting.
     * @returns {Piece} The new valid piece output.
     */
    movePieceRight(piece: Piece): Piece {
        return this.movePiece(piece, { x: 1, y: 0 });
    }
    /**
     * Alias for {@link movePiece} shifting one unit up continuously.
     *
     * @param {Piece} piece - The specific piece payload shifting.
     * @returns {Piece} The new valid piece output.
     */
    movePieceUp(piece: Piece): Piece {
        return this.movePiece(piece, { x: 0, y: -1 });
    }
    /**
     * Alias for {@link movePiece} shifting one unit down continuously.
     *
     * @param {Piece} piece - The specific piece payload shifting.
     * @returns {Piece} The new valid piece output.
     */
    movePieceDown(piece: Piece): Piece {
        return this.movePiece(piece, { x: 0, y: 1 });
    }

    /**
     * Modifies a single cell footprint moving it mathematically towards a given offset.
     *
     * @param {Cell} cell - The original single target cell.
     * @param {Vector} direction - The spatial translation array declaring x/y offset integers.
     * @returns {Cell} A new cell copy reflecting changes, or the old identical cell if restricted.
     */
    moveCell(cell: Cell, direction: Vector): Cell {
        const newCoord = {
            x: cell.coordinate.x + (direction.x || 0),
            y: cell.coordinate.y + (direction.y || 0),
        };

        if (!this.grid.isCoordinateValid(newCoord)) {
            return cell;
        }

        const gridCell = this.grid.getCell(newCoord);
        if (gridCell && this.grid.isCellActive(gridCell)) {
            return cell;
        }

        return { ...cell, coordinate: newCoord };
    }

    /**
     * Alias for {@link moveCell} shifting one unit left continuously.
     *
     * @param {Cell} cell - The specific cell shifting.
     * @returns {Cell} The new valid cell output.
     */
    moveCellLeft(cell: Cell): Cell {
        return this.moveCell(cell, { x: -1, y: 0 });
    }
    /**
     * Alias for {@link moveCell} shifting one unit right continuously.
     *
     * @param {Cell} cell - The specific cell shifting.
     * @returns {Cell} The new valid cell output.
     */
    moveCellRight(cell: Cell): Cell {
        return this.moveCell(cell, { x: 1, y: 0 });
    }
    /**
     * Alias for {@link moveCell} shifting one unit up continuously.
     *
     * @param {Cell} cell - The specific cell shifting.
     * @returns {Cell} The new valid cell output.
     */
    moveCellUp(cell: Cell): Cell {
        return this.moveCell(cell, { x: 0, y: -1 });
    }
    /**
     * Alias for {@link moveCell} shifting one unit down continuously.
     *
     * @param {Cell} cell - The specific cell shifting.
     * @returns {Cell} The new valid cell output.
     */
    moveCellDown(cell: Cell): Cell {
        return this.moveCell(cell, { x: 0, y: 1 });
    }

    /**
     * Implements a while-loop simulation repeatedly pushing a piece down until a collision is recorded.
     *
     * @param {Piece} piece - The piece footprint to analyze.
     * @returns {Piece} A modified piece reflecting the absolute lowest valid coordinate alignment.
     */
    getDropPath(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceDown(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceDown(currentPiece);
        }
        return currentPiece;
    }

    /**
     * Implements a while-loop simulation repeatedly pushing a piece up until a collision is recorded.
     *
     * @param {Piece} piece - The piece footprint to analyze.
     * @returns {Piece} A modified piece reflecting the absolute highest valid coordinate alignment.
     */
    getRisePath(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceUp(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceUp(currentPiece);
        }
        return currentPiece;
    }

    /**
     * Implements a while-loop simulation repeatedly pushing a piece left until a collision is recorded.
     *
     * @param {Piece} piece - The piece footprint to analyze.
     * @returns {Piece} A modified piece reflecting the absolute furthest left valid coordinate alignment.
     */
    getReachPathLeft(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceLeft(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceLeft(currentPiece);
        }
        return currentPiece;
    }

    /**
     * Implements a while-loop simulation repeatedly pushing a piece right until a collision is recorded.
     *
     * @param {Piece} piece - The piece footprint to analyze.
     * @returns {Piece} A modified piece reflecting the absolute furthest right valid coordinate alignment.
     */
    getReachPathRight(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceRight(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceRight(currentPiece);
        }
        return currentPiece;
    }
}
