import { Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationKingHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.KING;
    }

    getMoveSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];

        let frontSquares: Position[] = this.generationService.getFreeFrontSquares(piece, 1);
        let backSquares: Position[] = this.generationService.getFreeBackSquares(piece, 1);
        let leftSquares: Position[] = this.generationService.getFreeLeftSquares(piece, 1);
        let rightSquares: Position[] = this.generationService.getFreeRightSquares(piece, 1);
        let frontLeftSquares: Position[] = this.generationService.getFreeFrontLeftSquares(piece, 1);
        let frontRightSquares: Position[] = this.generationService.getFreeFrontRightSquares(piece, 1);
        let backLeftSquares: Position[] = this.generationService.getFreeBackLeftSquares(piece, 1);
        let backRightSquares: Position[] = this.generationService.getFreeBackRightSquares(piece, 1);

        fieldsToMove.push(
            ...frontSquares,
            ...backSquares,
            ...leftSquares,
            ...rightSquares,
            ...frontLeftSquares,
            ...frontRightSquares,
            ...backLeftSquares,
            ...backRightSquares);

        return fieldsToMove;
    }

    getCaptureSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];

        let frontSquares: Position[] = this.generationService.getOccupiedFrontSquare(piece, 1);
        let backSquares: Position[] = this.generationService.getOccupiedBackSquare(piece, 1);
        let leftSquares: Position[] = this.generationService.getOccupiedLeftSquare(piece, 1);
        let rightSquares: Position[] = this.generationService.getOccupiedRightSquare(piece, 1);
        let frontLeftSquare: Position[] = this.generationService.getOccupiedFrontLeftSquare(piece, 1);
        let frontRightSquare: Position[] = this.generationService.getOccupiedFrontRightSquare(piece, 1);
        let backLeftSquare: Position[] = this.generationService.getOccupiedBackLeftSquare(piece, 1);
        let backRightSquare: Position[] = this.generationService.getOccupiedBackRightSquare(piece, 1);

        fieldsToMove.push(
            ...frontSquares,
            ...backSquares,
            ...leftSquares,
            ...rightSquares,
            ...frontLeftSquare,
            ...frontRightSquare,
            ...backLeftSquare,
            ...backRightSquare);

        return fieldsToMove;
    }
}