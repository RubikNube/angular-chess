import { from } from "rxjs";
import { Color, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
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

    getMoves(piece: Piece): Move[] {
        let squares: Move[] = [];

        // surrounding squares:
        squares = this.generationService.getSurroundingSquares(piece)
            .map(p => {
                return {
                    piece: piece,
                    from: piece.position,
                    to: p
                }
            });

        // castle
        let castleRights = this.boardService.getCastleRights(piece.color);

        // kingside castle
        if (castleRights.canShortCastle) {
            let squareBeforeCastle = {
                row: piece.position.row,
                column: piece.position.column + 1
            }

            let castleSquare = {
                row: piece.position.row,
                column: piece.position.column + 2
            }

            if (this.boardService.isFree(squareBeforeCastle, piece.color) && this.boardService.isFree(castleSquare, piece.color)) {
                squares.push({
                    piece: piece,
                    from: piece.position,
                    to: castleSquare,
                    isShortCastle: true
                });
            }
        }

        // queenside castle
        if (castleRights.canLongCastle) {
            let squareBeforeCastle = {
                row: piece.position.row,
                column: piece.position.column - 1
            }

            let castleSquare = {
                row: piece.position.row,
                column: piece.position.column - 2
            }

            if (this.boardService.isFree(squareBeforeCastle, piece.color) && this.boardService.isFree(castleSquare, piece.color)) {
                squares.push({
                    piece: piece,
                    from: piece.position,
                    to: castleSquare,
                    isLongCastle: true
                });
            }
        }

        return this.filterOutAttackedSquares(piece, squares);
    }

    private filterOutAttackedSquares(piece: Piece, moves: Move[]): Move[] {
        let attackedSquares: Position[];
        if (piece.color === Color.WHITE) {
            attackedSquares = this.boardService.getAttackedSquaresFromBlack();
        }
        else {
            attackedSquares = this.boardService.getAttackedSquaresFromWhite();
        }

        let filteredMoves: Move[] = moves.filter(move => {
            return !PositionUtils.includes(attackedSquares, PositionUtils.getAbsolutePosition(move.to, piece.color));
        });

        console.log("filterOutAttackedSquares " + JSON.stringify({ piece: piece, fieldsToMove: moves, filteredSquares: filteredMoves, squaresThatOpponentAttacks: attackedSquares }));

        return filteredMoves;
    }

    swapColor(color: Color): Color {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE
    }

    getCaptures(piece: Piece): Position[] {
        return this.generationService.getSurroundingSquares(piece);
    }
}