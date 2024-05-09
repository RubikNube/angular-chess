import { Color, PieceType, Square } from "src/app/types/compressed.types.t";
import { Board } from "../../types/board.t";
import { Piece } from "../../types/pieces.t";
import LoggingUtils, { LogLevel } from "../logging.utils";
import SquareUtils from "../square.utils";
import { PIECE_SQUARE_SCORE } from "./square-tables.t";

enum GamePhase {
  MIDDLEGAME = 0,
  ENDGAME = 1
}

export default class EvaluationUtils {

  private static readonly gamePhaseMinEg: number = 518;
  private static readonly gamePhaseMaxEg: number = 6192;
  private static readonly gamePhaseRange: number = this.gamePhaseMaxEg - this.gamePhaseMinEg;

  /**
   * Evaluates the board with a number. The higher the number, the better the position for white. 
   * Negative numbers are better for black. If the number is 0, the position is equal.
   */
  public static evaluateBoard(board: Board): number {
    let evaluation = 0;

    const pieceSum: number = this.getPieceValueSum(board, GamePhase.MIDDLEGAME);
    LoggingUtils.log(LogLevel.DEBUG, () => `Piece sum: ${pieceSum}`);
    const gamePhase: number = Math.max(this.gamePhaseMinEg, Math.min(this.gamePhaseMaxEg, pieceSum));
    const factorMiddleGame: number = (gamePhase - this.gamePhaseMinEg) / this.gamePhaseRange;
    const factorEndGame: number = 1 - factorMiddleGame;
    LoggingUtils.log(LogLevel.DEBUG, () => `Game phase: ${gamePhase} - Factor middle game: ${factorMiddleGame} - Factor end game: ${factorEndGame}`);

    board.pieces.forEach(piece => {
      const colorFactor = piece.color === Color.WHITE ? 1 : -1;
      evaluation += colorFactor * (this.getRelativePieceValue(piece, factorMiddleGame) + this.getRelativePositionFactor(piece, factorMiddleGame));
    });
    LoggingUtils.log(LogLevel.DEBUG, () => `Evaluation: ${evaluation}`);
    return evaluation;
  }

  /**
   * Returns the piece value sum for the current board. Pawn values will be ignored.
   * 
   * @param board the current board
   * @returns the GamePhase
   * */
  private static getPieceValueSum(board: Board, gamePhase: GamePhase): number {
    let sumOfPieceValues = 0;
    board.pieces
      .filter(p => p.type !== PieceType.PAWN)
      .forEach(piece => {
        sumOfPieceValues += this.pieceValue(piece, gamePhase);
      });
    return sumOfPieceValues
  }

  private static getRelativePieceValue(piece: Piece, middleGameFactor: number): number {
    return this.pieceValue(piece, GamePhase.MIDDLEGAME) * middleGameFactor + this.pieceValue(piece, GamePhase.ENDGAME) * (1 - middleGameFactor);
  }

  private static pieceValue(piece: Piece, gamePhase: GamePhase): number {
    if (gamePhase === GamePhase.MIDDLEGAME) {
      return this.pieceValueMg(piece);
    } else {
      return this.pieceValueEg(piece);
    }
  }

  private static pieceValueMg(piece: Piece): number {
    switch (piece.type) {
      case PieceType.PAWN:
        return 82;
      case PieceType.KNIGHT:
        return 337;
      case PieceType.BISHOP:
        return 365;
      case PieceType.ROOK:
        return 477;
      case PieceType.QUEEN:
        return 1025;
      case PieceType.KING:
        return 12000;
      default:
        throw new Error(`Unknown piece type: ${piece.type}`);
    }
  }

  private static pieceValueEg(piece: Piece): number {
    switch (piece.type) {
      case PieceType.PAWN:
        return 94;
      case PieceType.KNIGHT:
        return 281;
      case PieceType.BISHOP:
        return 297;
      case PieceType.ROOK:
        return 512;
      case PieceType.QUEEN:
        return 936;
      case PieceType.KING:
        return 12000;
      default:
        throw new Error(`Unknown piece type: ${piece.type}`);
    }
  }

  private static getRelativePositionFactor(piece: Piece, middleGameFactor: number): number {
    return this.getPositionFactor(piece, GamePhase.MIDDLEGAME) * middleGameFactor + this.getPositionFactor(piece, GamePhase.ENDGAME) * (1 - middleGameFactor);
  }

  private static getPositionFactor(piece: Piece, gamePhase: GamePhase): number {
    const indexForPiece = EvaluationUtils.calculateIndexForPiece(piece);
    const pieceTableIndex = EvaluationUtils.getPieceTableIndex(piece);

    return PIECE_SQUARE_SCORE[gamePhase][pieceTableIndex][indexForPiece];
  }

  private static getPieceTableIndex(piece: Piece): number {
    switch (piece.type) {
      case PieceType.PAWN:
        return 0;
      case PieceType.KNIGHT:
        return 1;
      case PieceType.BISHOP:
        return 2;
      case PieceType.ROOK:
        return 3;
      case PieceType.QUEEN:
        return 4;
      case PieceType.KING:
        return 5;
      default:
        throw new Error(`Unknown piece type: ${piece.type}`);
    }
  }

  private static calculateIndexForPiece(piece: Piece) {
    if (piece.color === Color.WHITE) {
      return EvaluationUtils.calculateIndex(piece.position);
    } else {
      return EvaluationUtils.flipIndex(EvaluationUtils.calculateIndex(piece.position));
    }
  }

  /**
   * Returns the index for a given position. The square a8 will be 0, the square h1 will be 63.
   *  
   * */
  public static calculateIndex(position: Square): number {
    return SquareUtils.getRelativeSquare(position, Color.BLACK);
  }

  /**
 * Flips the index for the board.
 * */
  public static flipIndex(index: number): number {
    return index ^ 56;
  }
}