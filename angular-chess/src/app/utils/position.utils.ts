import { Board, Color, Position } from "../types/board.t";
import { Piece } from "../types/pieces.t";

export default class PositionUtils {

    public static positionEquals(a: Position, b: Position) {
        return a.row === b.row && a.column === b.column;
    }

    public static getRelativePosition(position: Position, perspective: Color): Position {
        if (perspective === Color.WHITE) {
            return position;
        }
        else {
            return {
                row: 9 - position.row,
                column: 9 - position.column
            }
        }
    }

    public static calculateDistance(positionA: Position, positionB: Position): number {
        let rowDistance: number = Math.abs(positionA.row - positionB.row);
        let columnDistance: number = Math.abs(positionA.column - positionB.column);

        return Math.max(rowDistance, columnDistance);
    }

    public static isOnBoard(position: Position): boolean {
        return position.row >= 1 && position.row <= 8 && position.column >= 1 && position.column <= 8;
    }

    public static includes(positions: Position[], position: Position) {
        return positions.some(pos => PositionUtils.positionEquals(pos, position));
    }

    public static getCoordinate(position: Position): string {
        return String.fromCharCode(96 + position.column) + position.row;
    }

    public static getPositionFromCoordinate(coordinate: string): Position | undefined {
        let matching = coordinate.match("^[a-h][1-8]$");

        if (matching !== null) {
            return {
                row: Number.parseInt(coordinate[1]),
                column: coordinate.charCodeAt(0) - 96
            }
        }
        else {
            return undefined;
        }
    }


    public static getPieceOnPos(board: Board, pos: Position): Piece | undefined {
        return board.pieces.find(p => {
            return p.position.row === pos.row
                && p.position.column === pos.column;
        });
    }

    public static isFree(board: Board, position: Position): boolean {
        let result = PositionUtils.getPieceOnPos(board, position) === undefined;
        console.log("isFree position:" + JSON.stringify(position) + ", result: " + result);
        return result;
    }

    public static getSurroundingSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];

        for (let r: number = -1; r <= 1; r++) {
            for (let c: number = -1; c <= 1; c++) {
                if (!(r == 0 && c == 0)) {
                    let field: Position = {
                        row: piece.position.row + r,
                        column: piece.position.column + c
                    }

                    fieldsToMove.push(field);
                }
            }
        }

        return fieldsToMove;
    }
}