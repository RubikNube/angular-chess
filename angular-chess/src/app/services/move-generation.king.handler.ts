import { Color, Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import PositionUtils from "../utils/position.utils";
import { ChessBoardService } from "./chess-board.service";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationKingHandler implements MoveGenerationHandler {

    constructor(public generationService: MoveGenerationService,
        public boardService: ChessBoardService) {

    }

    canHandle(piece: Piece): boolean {
        return piece.type === PieceType.KING;
    }

    getMoveSquares(piece: Piece): Position[] {
        return this.filterOutAttackedSquares(piece, this.generationService.getSurroundingSquares(piece));
    }

    private filterOutAttackedSquares(piece: Piece, fieldsToMove: Position[]) {
        let attackedSquares: Position[];
        if (piece.color === Color.WHITE) {
            attackedSquares = this.boardService.getAttackedSquaresFromBlack();
        }
        else {
            attackedSquares = this.boardService.getAttackedSquaresFromWhite();
        }

        let filteredSquares: Position[] = fieldsToMove.filter(squareToMove => {
            return !PositionUtils.includes(attackedSquares, PositionUtils.getAbsolutePosition(squareToMove, piece.color));
        });

        console.log("filterOutAttackedSquares " + JSON.stringify({ piece: piece, fieldsToMove: fieldsToMove, filteredSquares: filteredSquares, squaresThatOpponentAttacks: attackedSquares }));

        return filteredSquares;
    }

    swapColor(color: Color): Color {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE
    }

    getCaptureSquares(piece: Piece): Position[] {
        return this.generationService.getSurroundingSquares(piece);
    }
}