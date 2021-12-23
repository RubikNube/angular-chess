import { Position } from "../types/board.t";
import { Piece } from "../types/pieces.t";

export interface MoveGenerationHandler {
    canHandle(piece: Piece): boolean;
    getMoveSquares(piece:Piece):Position[];
    getCaptureSquares(piece:Piece):Position[];
}