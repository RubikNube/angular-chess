import { Color } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import PositionUtils from "./position.utils";

export default class PieceUtils {

    public static pieceEquals(a: Piece, b: Piece) {
        return a.color === b.color && a.type === b.type && PositionUtils.positionEquals(a.position, b.position);
    }

    public static getOpposedColor(color: Color) {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE;
    }

    public static getSymbol(type: PieceType, color: Color): string {
        if (color === Color.WHITE) {
            switch (type) {
                case PieceType.KING:
                    return "♔"
                case PieceType.QUEEN:
                    return "♕"
                case PieceType.ROOK:
                    return "♖"
                case PieceType.BISHOP:
                    return "♗"
                case PieceType.KNIGHT:
                    return "♘"
                case PieceType.PAWN:
                    return "♙"
                default:
                    return "";
            }
        }
        else {
            switch (type) {
                case PieceType.KING:
                    return "♚"
                case PieceType.QUEEN:
                    return "♛"
                case PieceType.ROOK:
                    return "♜"
                case PieceType.BISHOP:
                    return "♝"
                case PieceType.KNIGHT:
                    return "♞"
                case PieceType.PAWN:
                    return "♟︎"
                default:
                    return "";
            }
        }
    }
}