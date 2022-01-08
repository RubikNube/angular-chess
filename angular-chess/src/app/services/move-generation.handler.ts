import { Board } from "../types/board.t";
import { Move, Piece } from "../types/pieces.t";

export interface MoveGenerationHandler {
    canHandle(piece: Piece): boolean;
    getMoves(piece: Piece, board: Board): Move[];
    getCaptures(piece: Piece, board: Board): Move[];
}