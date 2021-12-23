import { Position } from "../types/board.t";

export default class PositionUtils {
    public static positionEquals(a: Position, b: Position) {
        return a.row === b.row && a.column === b.column;
    }
}