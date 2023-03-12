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
      ...backRightSquares];

    return fieldsToMove.map(PositionUtils.positionToMoveFunction(piece));
  }
}