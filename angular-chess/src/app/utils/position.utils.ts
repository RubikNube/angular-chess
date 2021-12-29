import { Color, Position } from "../types/board.t";

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

    public static getAbsolutePosition(position: Position, perspective: Color): Position {
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

    public static isOnBoard(position: Position): boolean {
        return position.row >= 1 && position.row <= 8 && position.column >= 1 && position.column <= 8;
    }

    public static includes(positions: Position[], position: Position) {
        return positions.some(pos => PositionUtils.positionEquals(pos, position));
    }

    public static getCoordinate(position: Position): string {
        return String.fromCharCode(96 + position.column) + position.row;
    }
}