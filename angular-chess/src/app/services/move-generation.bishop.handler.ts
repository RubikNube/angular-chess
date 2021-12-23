import { Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationBishopHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.BISHOP;
    }

    getMoveSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];
        let frontLeftSquares: Position[] = this.generationService.getFreeFrontLeftSquares(piece, Math.min(8 - piece.position.row, piece.position.column - 1));
        let frontRightSquares: Position[] = this.generationService.getFreeFrontRightSquares(piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
        let backLeftSquares: Position[] = this.generationService.getFreeBackLeftSquares(piece, Math.min(piece.position.row - 1, piece.position.column - 1));
        let backRightSquares: Position[] = this.generationService.getFreeBackRightSquares(piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

        fieldsToMove.push(...frontLeftSquares, ...frontRightSquares, ...backLeftSquares, ...backRightSquares);

        return fieldsToMove;
    }

    getCaptureSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];
        let frontLeftSquare: Position[] = this.generationService.getOccupiedFrontLeftSquare(piece, Math.min(8 - piece.position.row, piece.position.column - 1));
        let frontRightSquare: Position[] = this.generationService.getOccupiedFrontRightSquare(piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
        let backLeftSquare: Position[] = this.generationService.getOccupiedBackLeftSquare(piece, Math.min(piece.position.row - 1, piece.position.column - 1));
        let backRightSquare: Position[] = this.generationService.getOccupiedBackRightSquare(piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

        fieldsToMove.push(...frontLeftSquare, ...frontRightSquare, ...backLeftSquare, ...backRightSquare);

        return fieldsToMove;
    }
}