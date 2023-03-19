import { Board, Position } from "src/app/types/board.t";
import { Move, Piece } from "src/app/types/pieces.t";

export interface MoveGenerationHandler {
  canHandle(piece: Piece): boolean;
  getMoves(piece: Piece, board: Board): Move[];
  getCaptures(piece: Piece, board: Board): Move[];
  isAttackingKing(piece: Piece, board: Board): boolean;
  getBlockingSquares(piece: Piece, board: Board): Position[];
}