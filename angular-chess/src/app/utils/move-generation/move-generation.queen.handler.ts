import { Board } from "src/app/types/board.t";
import { Direction, Square } from "src/app/types/compressed.types.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationQueenHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.QUEEN;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    const horizontalSquares: Square[] = SquareUtils.getHorizontalSquares(piece.position);
    const horizontalPinningMoves: Move[] | undefined = BoardUtils.getHorizontalPartiallyPinnedMoves(piece, board, horizontalSquares);
    if (horizontalPinningMoves) {
      return horizontalPinningMoves;
    }

    const verticalSquares: Square[] = SquareUtils.getVerticalSquares(piece.position);
    const verticalPinningMoves: Move[] | undefined = BoardUtils.getVerticalPartiallyPinnedMoves(piece, board, verticalSquares);
    if (verticalPinningMoves) {
      return verticalPinningMoves;
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
    return [
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.WEST),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.EAST),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH_WEST),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH_EAST),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH_WEST),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH_EAST)
    ];
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    const horizontalSquares: Square[] = SquareUtils.getHorizontalSquares(piece.position);
    const horizontalPinningMoves: Move[] | undefined = BoardUtils.getHorizontalPartiallyPinnedCaptures(piece, board, horizontalSquares);
    if (horizontalPinningMoves) {
      return horizontalPinningMoves;
    }

    const verticalSquares: Square[] = SquareUtils.getVerticalSquares(piece.position);
    const verticalPinningMoves: Move[] | undefined = BoardUtils.getVerticalPartiallyPinnedCaptures(piece, board, verticalSquares);
    if (verticalPinningMoves) {
      return verticalPinningMoves;
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
    const fieldsToMove = [
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.NORTH),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.NORTH_EAST),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.EAST),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.SOUTH_EAST),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.SOUTH),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.SOUTH_WEST),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.WEST),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.NORTH_WEST),
    ];
    return fieldsToMove;
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return false;
    }
    const occupiedSquares = this.getOccupiedSquares(board, piece);

    return SquareUtils.includes(occupiedSquares, kingPos);
  }

  public getBlockingSquares(piece: Piece, board: Board): Square[] {
    // get horizontal squares between king and rook
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return [];
    }

    // are king and rook on the same row?
    if (SquareUtils.rankOf(kingPos) === SquareUtils.rankOf(piece.position)) {
      // get squares between king and rook
      return SquareUtils.getHorizontalSquaresBetween(piece.position, kingPos);
    }

    // are king and rook on the same column?
    if (SquareUtils.fileOf(kingPos) === SquareUtils.fileOf(piece.position)) {
      // get squares between king and rook
      return SquareUtils.getVerticalSquaresBetween(piece.position, kingPos);
    }

    return SquareUtils.getDiagonalSquaresBetween(piece.position, kingPos);
  }

  public getAttackingSquares(piece: Piece, board: Board): Square[] {
    const copiedBoard: Board = CopyUtils.deepCopyElement(board);
    copiedBoard.pieces = copiedBoard.pieces.filter(p => !(p.type === PieceType.KING && p.color !== piece.color));

    return [...this.getFreeSquares(copiedBoard, piece), ...this.getOccupiedSquares(copiedBoard, piece)];
  }
}