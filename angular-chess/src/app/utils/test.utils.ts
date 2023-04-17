import { Board } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import PieceUtils from "./piece.utils";

export default class TestUtils {
  public static sortByPosition = (a: Move, b: Move): number => a.to.column - b.to.column || a.to.row - b.to.row;
  public static sortByPromotedPieceType = (a: Move, b: Move): number => {
    if (a.promotedPiece && b.promotedPiece) {
      return TestUtils.pieceTypeToNumber(a.promotedPiece.type) - TestUtils.pieceTypeToNumber(b.promotedPiece.type);
    }
    return 0;
  };

  public static sortByCapturedPieceType = (a: Move, b: Move): number => {
    if (a.capturedPiece && !b.capturedPiece) {
      return -1;
    }
    if (!a.capturedPiece && b.capturedPiece) {
      return 1;
    }
    if (a.capturedPiece && b.capturedPiece) {
      return TestUtils.pieceTypeToNumber(a.capturedPiece.type) - TestUtils.pieceTypeToNumber(b.capturedPiece.type);
    }
    return 0;
  };

  public static sortMoves = (a: Move, b: Move): number => {
    return TestUtils.moveToString(a).localeCompare(TestUtils.moveToString(b));
  };

  public static moveToString(move: Move): string {
    return `${move.from.column}${move.from.row}-${move.to.column}${move.to.row}: ${move.capturedPiece?.type} ${move.promotedPiece?.type}`;
  };

  public static pieceTypeToNumber(pieceType: PieceType): number {
    switch (pieceType) {
      case PieceType.QUEEN:
        return 1;
      case PieceType.ROOK:
        return 2;
      case PieceType.BISHOP:
        return 3;
      case PieceType.KNIGHT:
        return 4;
      case PieceType.PAWN:
        return 5;
      case PieceType.KING:
        return 6;
    }
  }

  public static checkBoards(expectedBoard: Board | undefined, actualBoard: Board | undefined): void {
    expect(expectedBoard?.blackCastleRights).toEqual(actualBoard?.blackCastleRights);
    expect(expectedBoard?.whiteCastleRights).toEqual(actualBoard?.whiteCastleRights);
    expect(expectedBoard?.enPassantSquare).toEqual(actualBoard?.enPassantSquare);
    expect(expectedBoard?.playerToMove).toEqual(actualBoard?.playerToMove);
    expect(PieceUtils.sortPieces(expectedBoard?.pieces)).toEqual(PieceUtils.sortPieces(actualBoard?.pieces));
  }
}