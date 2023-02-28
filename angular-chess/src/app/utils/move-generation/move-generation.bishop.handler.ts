import { Board, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationBishopHandler implements MoveGenerationHandler {

  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.BISHOP;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedHorizontally(piece.position, board)|| PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }

    const frontLeftSquares: Position[] = BoardUtils.getFreeFrontLeftSquares(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
    const frontRightSquares: Position[] = BoardUtils.getFreeFrontRightSquares(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
    const backLeftSquares: Position[] = BoardUtils.getFreeBackLeftSquares(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
    const backRightSquares: Position[] = BoardUtils.getFreeBackRightSquares(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

    const fieldsToMove = [
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
    const frontLeftSquares: Position[] = BoardUtils.getOccupiedFrontLeftSquare(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
    const frontRightSquares: Position[] = BoardUtils.getOccupiedFrontRightSquare(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
    const backLeftSquares: Position[] = BoardUtils.getOccupiedBackLeftSquare(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
    const backRightSquares: Position[] = BoardUtils.getOccupiedBackRightSquare(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

    const fieldsToMove = [
      ...frontLeftSquares,
      ...frontRightSquares,
      ...backLeftSquares,
      ...backRightSquares];

    return fieldsToMove.map(PositionUtils.positionToMoveFunction(piece));
  }
}
