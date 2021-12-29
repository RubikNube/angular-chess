import { Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationQueenHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.QUEEN;
    }

    getMoves(piece: Piece): Move[] {
        let fieldsToMove: Position[] = [];

        let frontSquares: Position[] = this.generationService.getFreeFrontSquares(piece, 8 - piece.position.row);
        let backSquares: Position[] = this.generationService.getFreeBackSquares(piece, piece.position.row - 1);
        let leftSquares: Position[] = this.generationService.getFreeLeftSquares(piece, piece.position.column - 1);
        let rightSquares: Position[] = this.generationService.getFreeRightSquares(piece, 8 - piece.position.column);
        let frontLeftSquares: Position[] = this.generationService.getFreeFrontLeftSquares(piece, Math.min(8 - piece.position.row, piece.position.column - 1));
        let frontRightSquares: Position[] = this.generationService.getFreeFrontRightSquares(piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
        let backLeftSquares: Position[] = this.generationService.getFreeBackLeftSquares(piece, Math.min(piece.position.row - 1, piece.position.column - 1));
        let backRightSquares: Position[] = this.generationService.getFreeBackRightSquares(piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

        fieldsToMove.push(
            ...frontSquares,
            ...backSquares,
            ...leftSquares,
            ...rightSquares,
            ...frontLeftSquares,
            ...frontRightSquares,
            ...backLeftSquares,
            ...backRightSquares);

        return fieldsToMove.map(p => {
            return {
                piece: piece,
                from: piece.position,
                to: p
            }
        });
    }

    getCaptureSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];

        let frontSquares: Position[] = this.generationService.getOccupiedFrontSquare(piece, 8 - piece.position.row);
        let backSquares: Position[] = this.generationService.getOccupiedBackSquare(piece, piece.position.row - 1);
        let leftSquares: Position[] = this.generationService.getOccupiedLeftSquare(piece, piece.position.column - 1);
        let rightSquares: Position[] = this.generationService.getOccupiedRightSquare(piece, 8 - piece.position.column);
        let frontLeftSquare: Position[] = this.generationService.getOccupiedFrontLeftSquare(piece, Math.min(8 - piece.position.row, piece.position.column - 1));
        let frontRightSquare: Position[] = this.generationService.getOccupiedFrontRightSquare(piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
        let backLeftSquare: Position[] = this.generationService.getOccupiedBackLeftSquare(piece, Math.min(piece.position.row - 1, piece.position.column - 1));
        let backRightSquare: Position[] = this.generationService.getOccupiedBackRightSquare(piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

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