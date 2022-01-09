import { Board, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "../utils/board.utils";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationRookHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.ROOK;
    }

    getMoves(piece: Piece, board: Board): Move[] {
        let fieldsToMove: Position[] = [];
        let frontSquares: Position[] = BoardUtils.getFreeFrontSquares(board, piece, 8 - piece.position.row);
        let backSquares: Position[] = BoardUtils.getFreeBackSquares(board, piece, piece.position.row - 1);
        let leftSquares: Position[] = BoardUtils.getFreeLeftSquares(board, piece, piece.position.column - 1);
        let rightSquares: Position[] = BoardUtils.getFreeRightSquares(board, piece, 8 - piece.position.column);

        fieldsToMove.push(...frontSquares, ...backSquares, ...leftSquares, ...rightSquares);

        return fieldsToMove.map(p => {
            return {
                piece: piece,
                from: piece.position,
                to: p
            }
        });;
    }

    getCaptures(piece: Piece, board: Board): Move[] {
        let fieldsToMove: Position[] = [];
        let frontSquares: Position[] = BoardUtils.getOccupiedFrontSquare(board, piece, 8 - piece.position.row);
        let backSquares: Position[] = BoardUtils.getOccupiedBackSquare(board, piece, piece.position.row - 1);
        let leftSquares: Position[] = BoardUtils.getOccupiedLeftSquare(board, piece, piece.position.column - 1);
        let rightSquares: Position[] = BoardUtils.getOccupiedRightSquare(board, piece, 8 - piece.position.column);

        fieldsToMove.push(...frontSquares, ...backSquares, ...leftSquares, ...rightSquares);

        return fieldsToMove.map(p => {
            return {
                piece: piece,
                from: piece.position,
                to: p
            }
        });
    }

}