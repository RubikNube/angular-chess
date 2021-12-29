import { Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationRookHandler implements MoveGenerationHandler {
    
    constructor(public generationService:MoveGenerationService){
        
    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.ROOK;
    }

    getMoves(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];
        let frontSquares: Position[] = this.generationService.getFreeFrontSquares(piece, 8 - piece.position.row);
        let backSquares: Position[] = this.generationService.getFreeBackSquares(piece, piece.position.row - 1);
        let leftSquares: Position[] = this.generationService.getFreeLeftSquares(piece, piece.position.column - 1);
        let rightSquares: Position[] = this.generationService.getFreeRightSquares(piece, 8 - piece.position.column);
    
        fieldsToMove.push(...frontSquares, ...backSquares, ...leftSquares, ...rightSquares);
    
        return fieldsToMove;
    }

    getCaptureSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];
        let frontSquares: Position[] = this.generationService.getOccupiedFrontSquare(piece, 8 - piece.position.row);
        let backSquares: Position[] = this.generationService.getOccupiedBackSquare(piece, piece.position.row - 1);
        let leftSquares: Position[] = this.generationService.getOccupiedLeftSquare(piece, piece.position.column - 1);
        let rightSquares: Position[] = this.generationService.getOccupiedRightSquare(piece, 8 - piece.position.column);
    
        fieldsToMove.push(...frontSquares, ...backSquares, ...leftSquares, ...rightSquares);
    
        return fieldsToMove;
    }

}