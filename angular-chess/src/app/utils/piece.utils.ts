import { Piece } from "../types/pieces.t";
import PositionUtils from "./position.utils";

export default class PieceUtils {

    public static pieceEquals(a: Piece, b: Piece) {
        return a.color === b.color && a.type === b.type && PositionUtils.positionEquals(a.position, b.position);
    }
}