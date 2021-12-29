import { Position } from "../types/board.t";
import { Move, Piece } from "../types/pieces.t";

export interface MoveGenerationHandler {
    canHandle(piece: Piece): boolean;
    getMoves(piece: Piece): Move[];
    getCaptureSquares(piece: Piece): Position[];
}