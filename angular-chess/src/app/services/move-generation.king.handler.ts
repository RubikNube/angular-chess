import { Board, Color, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "../utils/board.utils";
import PieceUtils from "../utils/piece.utils";
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

    getMoves(piece: Piece, board: Board): Move[] {
        let moves: Move[] = [];

        // surrounding squares:
        moves = PositionUtils.getSurroundingSquares(piece)
            .map(p => {
                return {
                    piece: piece,
                    from: piece.position,
                    to: p
                }
            });

        // castle
        let castleRights = this.boardService.getCastleRights(piece.color);

        let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(this.generationService, board, PieceUtils.getOpposedColor(piece.color));
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

            if (PositionUtils.isFree(board, squareBeforeCastle) && !PositionUtils.includes(attackedSquares, squareBeforeCastle)
                && PositionUtils.isFree(board, castleSquare) && !PositionUtils.includes(attackedSquares, castleSquare)) {
                moves.push({
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

            if (PositionUtils.isFree(board, squareBeforeCastle) && !PositionUtils.includes(attackedSquares, squareBeforeCastle)
                && PositionUtils.isFree(board, castleSquare) && !PositionUtils.includes(attackedSquares, castleSquare)) {
                moves.push({
                    piece: piece,
                    from: piece.position,
                    to: castleSquare,
                    isLongCastle: true
                });
            }
        }

        return this.filterOutAttackedSquares(piece, board, moves, attackedSquares);
    }

    private filterOutAttackedSquares(piece: Piece, board: Board, moves: Move[], attackedSquares: Position[]): Move[] {
        let filteredMoves: Move[] = moves.filter(move => {
            return !PositionUtils.includes(attackedSquares, move.to);
        });

        console.log("filterOutAttackedSquares " + JSON.stringify({ piece: piece, fieldsToMove: moves, filteredSquares: filteredMoves, squaresThatOpponentAttacks: attackedSquares }));

        return filteredMoves;
    }

    swapColor(color: Color): Color {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE
    }

    getCaptures(piece: Piece): Move[] {
        return PositionUtils.getSurroundingSquares(piece).map(p => {
            return {
                piece: piece,
                from: piece.position,
                to: p
            }
        })
    }
}