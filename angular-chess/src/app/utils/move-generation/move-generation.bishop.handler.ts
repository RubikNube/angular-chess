import { Board } from "src/app/types/board.t";
import { Direction, PieceType, Square } from "src/app/types/compressed.types.t";
import { Move, Piece } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PieceUtils from "../piece.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationBishopHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.BISHOP;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedHorizontally(piece.position, board) || PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }

    const lowerToUpperDiagonal: Square[] = SquareUtils.getLowerToUpperDiagonal(piece.position);

    const pinningMovesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedMoves(piece, board, lowerToUpperDiagonal);
    if (pinningMovesOnLowerToUpperDiagonal) {
      return pinningMovesOnLowerToUpperDiagonal;
    }

    const upperToLowerDiagonal: Square[] = SquareUtils.getUpperToLowerDiagonal(piece.position);

    const pinningMovesOnUpperToLowerDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedMoves(piece, board, upperToLowerDiagonal);
    if (pinningMovesOnUpperToLowerDiagonal) {
      return pinningMovesOnUpperToLowerDiagonal;
    }

    const fieldsToMove = this.getFreeSquares(board, piece);

    return fieldsToMove.map(p => {
      return {
        piece: piece,
        from: piece.position,
        to: p
      }
    });
  }

  private getFreeSquares(board: Board, piece: Piece) {
    const northWest = BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH_WEST);
    const northEast = BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH_EAST);
    const southWest = BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH_WEST);
    const southEast = BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH_EAST);
    return [
      ...northWest,
      ...northEast,
      ...southWest,
      ...southEast
    ];
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedHorizontally(piece.position, board) || PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }

    const upperToLowerDiagonal: Square[] = SquareUtils.getUpperToLowerDiagonal(piece.position);
    const pinningMovesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, upperToLowerDiagonal);
    if (pinningMovesOnLowerToUpperDiagonal) {
      return pinningMovesOnLowerToUpperDiagonal;
    }

    const lowerToUpperDiagonal: Square[] = SquareUtils.getLowerToUpperDiagonal(piece.position);
    const pinningMovesOnUpperToLowerDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, lowerToUpperDiagonal);
    if (pinningMovesOnUpperToLowerDiagonal) {
      return pinningMovesOnUpperToLowerDiagonal;
    }

    const fieldsToMove = this.getOccupiedSquares(board, piece);

    return fieldsToMove.map(SquareUtils.positionToMoveFunction(piece));
  }

  private getOccupiedSquares(board: Board, piece: Piece) {
    const northEast = BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.NORTH_EAST);
    const northWest = BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.NORTH_WEST);
    const southEast = BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.SOUTH_EAST);
    const southWest = BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.SOUTH_WEST);
    return [
      ...northEast,
      ...northWest,
      ...southEast,
      ...southWest
    ];
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    const fieldsToMove = this.getOccupiedSquares(board, piece);

    return fieldsToMove.some(p => {
      return SquareUtils.getPieceOnPos(board, p)?.type === PieceType.KING && SquareUtils.getPieceOnPos(board, p)?.color !== piece.color;
    });
  }

  public getBlockingSquares(piece: Piece, board: Board): Square[] {
    const enemyKingSquare = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;

    if (!enemyKingSquare) {
      return [];
    }

    return SquareUtils.getDiagonalSquaresBetween(piece.position, enemyKingSquare);
  }

  /**
   * Retrieves the squares that a bishop can attack on the board.
   * 
   * @param piece - The bishop piece.
   * @param board - The current state of the chess board.
   * @returns An array of squares that the bishop can attack.
   */
  public getAttackingSquares(piece: Piece, board: Board): Square[] {
    const copiedBoard: Board = CopyUtils.deepCopyElement(board);
    copiedBoard.pieces = copiedBoard.pieces.filter(p => !(p.type === PieceType.KING && p.color !== piece.color));
    const freeSquares = this.getFreeSquares(copiedBoard, piece);
    const occupiedSquares = this.getOccupiedSquares(copiedBoard, piece);

    return [...freeSquares, ...occupiedSquares];
  }
}
