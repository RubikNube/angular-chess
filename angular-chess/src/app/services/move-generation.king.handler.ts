import { Board, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "../utils/board.utils";
import PieceUtils from "../utils/piece.utils";
import PositionUtils from "../utils/position.utils";
import { ChessBoardService } from "./chess-board.service";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationKingHandler implements MoveGenerationHandler {

  constructor(private generationService: MoveGenerationService,
    private boardService: ChessBoardService) {

  }

  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.KING;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
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

    return this.filterOutAttackedSquares(piece, moves, attackedSquares);
  }

  private filterOutAttackedSquares(piece: Piece, moves: Move[], attackedSquares: Position[]): Move[] {
    let filteredMoves: Move[] = moves.filter(move => {
      return !PositionUtils.includes(attackedSquares, move.to);
    });

    console.log("filterOutAttackedSquares " + JSON.stringify({ piece: piece, fieldsToMove: moves, filteredSquares: filteredMoves, squaresThatOpponentAttacks: attackedSquares }));

    return filteredMoves;
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    return PositionUtils.getSurroundingSquares(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p
        }
      })
      .filter(m => !BoardUtils.isProtected(this.generationService, board, PositionUtils.getPieceOnPos(board, m.to)))
  };
}