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
        return this.filterOutAttackedSquares(piece, this.getSurroundingSquares(piece));
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
            return !PositionUtils.includes(attackedSquares, squareToMove);
        });

        console.log("filterOutAttackedSquares " + JSON.stringify({ piece: piece, fieldsToMove: fieldsToMove, filteredSquares: filteredSquares, squaresThatOpponentAttacks: attackedSquares }));

        return filteredSquares;
    }

    swapColor(color: Color): Color {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE
    }

    getCaptureSquares(piece: Piece): Position[] {
        return this.getSurroundingSquares(piece);
    }

    getSurroundingSquares(piece: Piece): Position[] {
        let fieldsToMove: Position[] = [];

        for (let r: number = -1; r <= 1; r++) {
            for (let c: number = -1; c <= 1; c++) {
                console.log(JSON.stringify({ r: r, c: c }))

                if (!(r == 0 && c == 0)) {
                    console.log("r&&c!=0: " + JSON.stringify({ r: r, c: c }))
                    let field: Position = {
                        row: piece.position.row + r,
                        column: piece.position.column + c
                    }

                    fieldsToMove.push(field);
                }
                else {
                    console.log("r&&c==0: " + JSON.stringify({ r: r, c: c }))
                }
            }
        }

        console.log("getSurroundingSquares: " + JSON.stringify({ fieldsToMove: fieldsToMove, piece: piece }));

        return fieldsToMove;
    }
}