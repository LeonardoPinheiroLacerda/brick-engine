import { Cell, Coordinate, Vector, Piece } from '../../../types/Types';
import { Grid } from '../../../types/modules';

/**
 * Handles movement and projection logic for the game grid.
 */
export default class GridMovementEngine {
    constructor(private grid: Grid) {}

    /**
     * Attempts to shift a collection of cells (a piece) in a given direction.
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

    movePieceLeft(piece: Piece): Piece {
        return this.movePiece(piece, { x: -1, y: 0 });
    }
    movePieceRight(piece: Piece): Piece {
        return this.movePiece(piece, { x: 1, y: 0 });
    }
    movePieceUp(piece: Piece): Piece {
        return this.movePiece(piece, { x: 0, y: -1 });
    }
    movePieceDown(piece: Piece): Piece {
        return this.movePiece(piece, { x: 0, y: 1 });
    }

    /**
     * Attempts to shift a single cell in a given direction.
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

    moveCellLeft(cell: Cell): Cell {
        return this.moveCell(cell, { x: -1, y: 0 });
    }
    moveCellRight(cell: Cell): Cell {
        return this.moveCell(cell, { x: 1, y: 0 });
    }
    moveCellUp(cell: Cell): Cell {
        return this.moveCell(cell, { x: 0, y: -1 });
    }
    moveCellDown(cell: Cell): Cell {
        return this.moveCell(cell, { x: 0, y: 1 });
    }

    getDropPath(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceDown(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceDown(currentPiece);
        }
        return currentPiece;
    }

    getRisePath(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceUp(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceUp(currentPiece);
        }
        return currentPiece;
    }

    getReachPathLeft(piece: Piece): Piece {
        let currentPiece = piece;
        let nextPiece = this.movePieceLeft(currentPiece);
        while (nextPiece !== currentPiece) {
            currentPiece = nextPiece;
            nextPiece = this.movePieceLeft(currentPiece);
        }
        return currentPiece;
    }

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
