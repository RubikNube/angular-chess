import { Board } from "../types/board.t";
import { Move, Piece } from "../types/pieces.t";

/**
 * Utility class for creating deep copies of objects.
 */
export default class CopyUtils {
  /**
   * Creates a deep copy of a Move object.
   * 
   * @param move - The Move object to be copied.
   * @returns A new Move object that is a deep copy of the original move.
   */
  public static copyMove(move: Move): Move {
    let copiedMove: Move = {
      piece: this.copyPiece(move.piece) ?? move.piece,
      from: move.from,
      to: move.to
    };

    if (move.capturedPiece !== undefined) {
      copiedMove.capturedPiece = this.copyPiece(move.capturedPiece);
    }

    if (move.promotedPiece !== undefined) {
      copiedMove.promotedPiece = this.copyPiece(move.promotedPiece);
    }

    if (move.isShortCastle !== undefined) {
      copiedMove.isShortCastle = move.isShortCastle;
    }

    if (move.isLongCastle !== undefined) {
      copiedMove.isLongCastle = move.isLongCastle;
    }

    if (move.isCheck !== undefined) {
      copiedMove.isCheck = move.isCheck;
    }

    if (move.isMate !== undefined) {
      copiedMove.isMate = move.isMate;
    }

    if (move.isEnPassant !== undefined) {
      copiedMove.isEnPassant = move.isEnPassant;
    }

    return copiedMove;
  }

  /**
   * Copies a Piece object.
   * 
   * @param piece - The Piece object to be copied.
   * @returns A new Piece object with the same properties as the original piece.
   */
  public static copyPiece(piece: Piece | undefined): Piece | undefined {
    if (piece === undefined) {
      return undefined;
    }

    return {
      type: piece.type,
      color: piece.color,
      position: piece.position
    }
  }

  /**
   * Creates a deep copy of the given board object.
   * 
   * @param board - The board object to be copied.
   * @returns A new board object that is a deep copy of the original board.
   */
  public static copyBoard(board: Board): Board {
    return {
      pieces: this.copyPieceArray(board.pieces),
      playerToMove: board.playerToMove,
      castlingRights: board.castlingRights,
      result: board.result,
      moveCount: board.moveCount,
      enPassantSquare: board.enPassantSquare,
      plyCount: board.plyCount,
    }
  }

  /**
   * Creates a deep copy of an array of pieces.
   * 
   * @param pieces - The array of pieces to be copied.
   * @returns A new array containing deep copies of the pieces.
   */
  public static copyPieceArray(pieces: Piece[]): Piece[] {
    return pieces.map(piece => this.copyPiece(piece) as Piece);
  }
}