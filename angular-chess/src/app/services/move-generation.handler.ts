import { Move, Piece } from "../types/pieces.t";

export interface MoveGenerationHandler {
    canHandle(piece: Piece): boolean;
    getMoves(piece: Piece): Move[];
    getCaptures(piece: Piece): Move[];
}