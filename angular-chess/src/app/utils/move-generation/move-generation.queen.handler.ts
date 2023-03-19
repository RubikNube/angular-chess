import { Board, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationQueenHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.QUEEN;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    const horizontalSquares: Position[] = PositionUtils.getHorizontalSquares(piece.position);
    const horizontalPinningMoves: Move[] | undefined = BoardUtils.getHorizontalPartiallyPinnedMoves(piece, board, horizontalSquares);
    if (horizontalPinningMoves) {
      return horizontalPinningMoves;
    }

    const verticalSquares: Position[] = PositionUtils.getVerticalSquares(piece.position);
    const verticalPinningMoves: Move[] | undefined = BoardUtils.getVerticalPartiallyPinnedMoves(piece, board, verticalSquares);
    if (verticalPinningMoves) {
      return verticalPinningMoves;
    }

    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);
    const pinningMovesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedMoves(piece, board, lowerToUpperDiagonal);
    if (pinningMovesOnLowerToUpperDiagonal) {
      return pinningMovesOnLowerToUpperDiagonal;
    }

    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);
    const pinningMovesOnUpperToLowerDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedMoves(piece, board, upperToLowerDiagonal);
    if (pinningMovesOnUpperToLowerDiagonal) {
      return pinningMovesOnUpperToLowerDiagonal;
    }

    const frontSquares: Position[] = BoardUtils.getFreeFrontSquares(board, piece, 8 - piece.position.row);
    const backSquares: Position[] = BoardUtils.getFreeBackSquares(board, piece, piece.position.row - 1);
    const leftSquares: Position[] = BoardUtils.getFreeLeftSquares(board, piece, piece.position.column - 1);
    const rightSquares: Position[] = BoardUtils.getFreeRightSquares(board, piece, 8 - piece.position.column);
    const frontLeftSquares: Position[] = BoardUtils.getFreeFrontLeftSquares(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
    const frontRightSquares: Position[] = BoardUtils.getFreeFrontRightSquares(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
    const backLeftSquares: Position[] = BoardUtils.getFreeBackLeftSquares(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
    const backRightSquares: Position[] = BoardUtils.getFreeBackRightSquares(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

    const fieldsToMove = [
      ...frontSquares,
      ...backSquares,
      ...leftSquares,
      ...rightSquares,
      ...frontLeftSquares,
      ...frontRightSquares,
      ...backLeftSquares,
      ...backRightSquares];

    return fieldsToMove.map(p => {
      return {
        piece: piece,
        from: piece.position,
        to: p
      }
    });
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    const horizontalSquares: Position[] = PositionUtils.getHorizontalSquares(piece.position);
    const horizontalPinningMoves: Move[] | undefined = BoardUtils.getHorizontalPartiallyPinnedCaptures(piece, board, horizontalSquares);
    if (horizontalPinningMoves) {
      return horizontalPinningMoves;
    }

    const verticalSquares: Position[] = PositionUtils.getVerticalSquares(piece.position);
    const verticalPinningMoves: Move[] | undefined = BoardUtils.getVerticalPartiallyPinnedCaptures(piece, board, verticalSquares);
    if (verticalPinningMoves) {
      return verticalPinningMoves;
    }

    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);
    const pinningMovesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, upperToLowerDiagonal);
    if (pinningMovesOnLowerToUpperDiagonal) {
      return pinningMovesOnLowerToUpperDiagonal;
    }

    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);
    const pinningMovesOnUpperToLowerDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, lowerToUpperDiagonal);
    if (pinningMovesOnUpperToLowerDiagonal) {
      return pinningMovesOnUpperToLowerDiagonal;
    }

    const fieldsToMove = this.getOccupiedSquares(board, piece);

    return fieldsToMove.map(PositionUtils.positionToMoveFunction(piece));
  }

  private getOccupiedSquares(board: Board, piece: Piece) {
    const frontSquares: Position[] = BoardUtils.getOccupiedFrontSquare(board, piece, 8 - piece.position.row);
    const backSquares: Position[] = BoardUtils.getOccupiedBackSquare(board, piece, piece.position.row - 1);
    const leftSquares: Position[] = BoardUtils.getOccupiedLeftSquare(board, piece, piece.position.column - 1);
    const rightSquares: Position[] = BoardUtils.getOccupiedRightSquare(board, piece, 8 - piece.position.column);
    const frontLeftSquares: Position[] = BoardUtils.getOccupiedFrontLeftSquare(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
    const frontRightSquares: Position[] = BoardUtils.getOccupiedFrontRightSquare(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
    const backLeftSquares: Position[] = BoardUtils.getOccupiedBackLeftSquare(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
    const backRightSquares: Position[] = BoardUtils.getOccupiedBackRightSquare(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

    const fieldsToMove = [
      ...frontSquares,
      ...backSquares,
      ...leftSquares,
      ...rightSquares,
      ...frontLeftSquares,
      ...frontRightSquares,
      ...backLeftSquares,
      ...backRightSquares
    ];
    return fieldsToMove;
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return false;
    }
    const occupiedSquares = this.getOccupiedSquares(board, piece);

    return PositionUtils.includes(occupiedSquares, kingPos);
  }

  public getBlockingSquares(piece: Piece, board: Board): Position[] {
    // get horizontal squares between king and rook
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return [];
    }

    // are king and rook on the same row?
    if (kingPos.row === piece.position.row) {
      // get squares between king and rook
      return PositionUtils.getHorizontalPositionsBetween(piece.position, kingPos);
    }

    // are king and rook on the same column?
    if (kingPos.column === piece.position.column) {
      // get squares between king and rook
      return PositionUtils.getVerticalPositionsBetween(piece.position, kingPos);
    }

    return PositionUtils.getDiagonalPositionsBetween(piece.position, kingPos);
  }
}