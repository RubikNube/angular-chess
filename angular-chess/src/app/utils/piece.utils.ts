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
    if (color === Color.WHITE) {
      switch (type) {
        case PieceType.PAWN:
          return 'P';
        case PieceType.KNIGHT:
          return 'N';
        case PieceType.BISHOP:
          return 'B';
        case PieceType.ROOK:
          return 'R';
        case PieceType.QUEEN:
          return 'Q';
        case PieceType.KING:
          return 'K';
      }
    }
    else {
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
  }
}