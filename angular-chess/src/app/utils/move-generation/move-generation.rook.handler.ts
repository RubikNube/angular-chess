import { Board, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
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

    const frontSquares: Position[] = BoardUtils.getFreeFrontSquares(board, piece, 8 - piece.position.row);
    const backSquares: Position[] = BoardUtils.getFreeBackSquares(board, piece, piece.position.row - 1);
    const leftSquares: Position[] = BoardUtils.getFreeLeftSquares(board, piece, piece.position.column - 1);
    const rightSquares: Position[] = BoardUtils.getFreeRightSquares(board, piece, 8 - piece.position.column);

    const fieldsToMove = [
      ...frontSquares,
      ...backSquares,
      ...leftSquares,
      ...rightSquares];

    return fieldsToMove.map(PositionUtils.positionToMoveFunction(piece))
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    const frontSquares: Position[] = BoardUtils.getOccupiedFrontSquare(board, piece, 8 - piece.position.row);
    const backSquares: Position[] = BoardUtils.getOccupiedBackSquare(board, piece, piece.position.row - 1);
    const leftSquares: Position[] = BoardUtils.getOccupiedLeftSquare(board, piece, piece.position.column - 1);
    const rightSquares: Position[] = BoardUtils.getOccupiedRightSquare(board, piece, 8 - piece.position.column);

    const fieldsToMove = [
      ...frontSquares,
      ...backSquares,
      ...leftSquares,
      ...rightSquares];

    return fieldsToMove.map(PositionUtils.positionToMoveFunction(piece));
  }
}