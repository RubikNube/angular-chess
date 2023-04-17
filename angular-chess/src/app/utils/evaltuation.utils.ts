import { Board, Color } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";

export default class EvaluationUtils {
  /**
   * Evaluates the board with a number. The higher the number, the better the position for white. 
   * Negative numbers are better for black. If the number is 0, the position is equal.
   */
  public static evaluateBoard(board: Board): number {
    let evaluation = 0;
    board.pieces.forEach(piece => {
      evaluation += piece.color === Color.WHITE ? this.pieceValue(piece) : -1 * this.pieceValue(piece);
    });
    return evaluation;
  }

  private static pieceValue(piece: Piece): number {
    switch (piece.type) {
      case PieceType.PAWN:
        return 1;
      case PieceType.KNIGHT:
        return 3;
      case PieceType.BISHOP:
        return 3;
      case PieceType.ROOK:
        return 5;
      case PieceType.QUEEN:
        return 9;
      case PieceType.KING:
        return 100;
      default:
        throw new Error(`Unknown piece type: ${piece.type}`);
    }
  }
}