import { Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationKnightHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.KNIGHT;
    }

    getMoveSquares(piece: Piece): Position[] {
        return this.getValidKnightMoves(piece);
    }

    getCaptureSquares(piece: Piece): Position[] {
        return this.getValidKnightMoves(piece);
    }

    getValidKnightMoves(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];

        fieldsToMove.push(
            {
                row: piece.position.row + 1,
                column: piece.position.column - 2
            },
            {
                row: piece.position.row + 2,
                column: piece.position.column - 1
            },
            {
                row: piece.position.row + 1,
                column: piece.position.column + 2
            },
            {
                row: piece.position.row + 2,
                column: piece.position.column + 1
            },
            {
                row: piece.position.row - 1,
                column: piece.position.column - 2
            },
            {
                row: piece.position.row - 2,
                column: piece.position.column - 1
            },
            {
                row: piece.position.row - 1,
                column: piece.position.column + 2
            },
            {
                row: piece.position.row - 2,
                column: piece.position.column + 1
            })

        return fieldsToMove;
    }
}