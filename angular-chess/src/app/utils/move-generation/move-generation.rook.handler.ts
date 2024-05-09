import { Board } from "src/app/types/board.t";
import { Direction, Square } from "src/app/types/compressed.types.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PieceUtils from "../piece.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationRookHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.ROOK;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned diagonally it cannot move
    if (PieceUtils.isPinnedDiagonally(piece.position, board)) {
      return [];
    }

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

    const fieldsToMove = this.getFreeSquares(board, piece);

    return fieldsToMove.map(SquareUtils.positionToMoveFunction(piece))
  }

  private getFreeSquares(board: Board, piece: Piece) {
    return [
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.WEST),
      ...BoardUtils.getFreeSquaresInDirection(board, piece, Direction.EAST)
    ];
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    // if piece is pinned diagonally it cannot move
    if (PieceUtils.isPinnedDiagonally(piece.position, board)) {
      return [];
    }

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

    const fieldsToMove = this.getOccupiedSquares(board, piece);

    return fieldsToMove.map(SquareUtils.positionToMoveFunction(piece));
  }

  public getOccupiedSquares(board: Board, piece: Piece) {
    return [
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.NORTH),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.SOUTH),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.WEST),
      ...BoardUtils.getOccupiedSquareInDirection(board, piece, Direction.EAST)
    ];
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

    return [];
  }

  public getAttackingSquares(piece: Piece, board: Board): Square[] {
    const copiedBoard: Board = CopyUtils.deepCopyElement(board);
    copiedBoard.pieces = copiedBoard.pieces.filter(p => !(p.type === PieceType.KING && p.color !== piece.color));

    const freeSquares = this.getFreeSquares(copiedBoard, piece);
    const occupiedSquares = this.getOccupiedSquares(copiedBoard, piece);
    return [...freeSquares, ...occupiedSquares];
  }
}