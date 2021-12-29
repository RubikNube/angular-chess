import { Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import PositionUtils from "../utils/position.utils";
import { ChessBoardService } from "./chess-board.service";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationPawnHandler implements MoveGenerationHandler {

  constructor(public generationService: MoveGenerationService,
    private boardService: ChessBoardService) {

  }

  canHandle(piece: Piece): boolean {
    return piece.type === PieceType.PAWN;;
  }

  getMoves(piece: Piece): Move[] {
    console.log("getMoveSquares: " + JSON.stringify(piece));
    if (piece.position.row === 2) {
      return this.generationService.getFreeFrontSquares(piece, 2)
        .map(p => {
          return {
            piece: piece,
            from: piece.position,
            to: p
          }
        });
    }
    else {
      return this.generationService.getFreeFrontSquares(piece, 1)
        .map(p => {
          return {
            piece: piece,
            from: piece.position,
            to: p
          }
        });
    }
  }

  getCaptures(piece: Piece): Move[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));
    let fieldsToCapture: Position[] = [];

    // left upper field
    let leftUpperField: Position = {
      row: piece.position.row + 1,
      column: piece.position.column - 1
    };

    // right upper field
    let rightUpperField: Position = {
      row: piece.position.row + 1,
      column: piece.position.column + 1
    };

    fieldsToCapture.push(leftUpperField, rightUpperField);

    return fieldsToCapture
      .map(p => {
        let isEnPassant = this.boardService.isEnPassantSquare(PositionUtils.getAbsolutePosition(p, piece.color));

        return {
          piece: piece,
          from: piece.position,
          to: p,
          isEnPassant: isEnPassant,
          capturedPiece: isEnPassant ? this.boardService.getPieceOnPos(PositionUtils.getAbsolutePosition({ row: p.row - 1, column: p.column }, piece.color)) : this.boardService.getPieceOnPos(p)
        }
      });
  }


}