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

  public static getPieceChar(type: PieceType, color: Color): string {
    if (color === Color.WHITE) {
      switch (type) {
        case PieceType.PAWN:
          return 'p';
        case PieceType.KNIGHT:
          return 'n';
        case PieceType.BISHOP:
          return 'b';
        case PieceType.ROOK:
          return 'r';
        case PieceType.QUEEN:
          return 'q';
        case PieceType.KING:
          return 'k';
      }
    }
    else {
      switch (type) {
        case PieceType.PAWN:
          return 'o';
        case PieceType.KNIGHT:
          return 'm';
        case PieceType.BISHOP:
          return 'v';
        case PieceType.ROOK:
          return 't';
        case PieceType.QUEEN:
          return 'w';
        case PieceType.KING:
          return 'l';
      }
    }
  }

  public static getPieceFenChar(type: PieceType, color: Color): string {
    let typeChar = "";

    switch (type) {
      case PieceType.PAWN:
        typeChar = 'P';
        break;
      case PieceType.KNIGHT:
        typeChar = 'N';
        break;
      case PieceType.BISHOP:
        typeChar = 'B';
        break;
      case PieceType.ROOK:
        typeChar = 'R';
        break;
      case PieceType.QUEEN:
        typeChar = 'Q';
        break;
      case PieceType.KING:
        typeChar = 'K';
        break;
    }

    return color === Color.WHITE ? typeChar : typeChar.toLowerCase();
  }

  public static getPieceType(pieceName: string) {
    switch (pieceName) {
      case "QUEEN":
        return PieceType.QUEEN;
      case "ROOK":
        return PieceType.ROOK;
      case "BISHOP":
        return PieceType.BISHOP;
      case "KNIGHT":
        return PieceType.KNIGHT;
      default:
        return PieceType.QUEEN;
    }
  }
}