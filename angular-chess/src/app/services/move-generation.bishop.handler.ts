import { Board, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "../utils/board.utils";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationBishopHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.BISHOP;
    }

    getMoves(piece: Piece, board: Board): Move[] {
        let fieldsToMove: Position[] = [];
        let frontLeftSquares: Position[] = BoardUtils.getFreeFrontLeftSquares(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
        let frontRightSquares: Position[] = BoardUtils.getFreeFrontRightSquares(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
        let backLeftSquares: Position[] = BoardUtils.getFreeBackLeftSquares(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
        let backRightSquares: Position[] = BoardUtils.getFreeBackRightSquares(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

        fieldsToMove.push(...frontLeftSquares, ...frontRightSquares, ...backLeftSquares, ...backRightSquares);

        return fieldsToMove.map(p => {
            return {
                piece: piece,
                from: piece.position,
                to: p
            }
        });
    }

    getCaptures(piece: Piece, board: Board): Move[] {
        let fieldsToMove: Position[] = [];
        let frontLeftSquare: Position[] = BoardUtils.getOccupiedFrontLeftSquare(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
        let frontRightSquare: Position[] = BoardUtils.getOccupiedFrontRightSquare(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
        let backLeftSquare: Position[] = BoardUtils.getOccupiedBackLeftSquare(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
        let backRightSquare: Position[] = BoardUtils.getOccupiedBackRightSquare(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

        fieldsToMove.push(...frontLeftSquare, ...frontRightSquare, ...backLeftSquare, ...backRightSquare);

        return fieldsToMove.map(p => {
            return {
                piece: piece,
                from: piece.position,
                to: p
            }
        });
    }
}