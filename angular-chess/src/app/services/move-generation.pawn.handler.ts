import { Board, Color, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "../utils/board.utils";
import PositionUtils from "../utils/position.utils";
import { ChessBoardService } from "./chess-board.service";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationPawnHandler implements MoveGenerationHandler {

  constructor(public generationService: MoveGenerationService) {

  }

  canHandle(piece: Piece): boolean {
    return piece.type === PieceType.PAWN;;
  }

  getMoves(piece: Piece): Move[] {
    console.log("getMoveSquares: " + JSON.stringify(piece));
    if (piece.color === Color.WHITE) {
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
    else {
      if (piece.position.row === 7) {
        return this.generationService.getFreeBackSquares(piece, 2)
          .map(p => {
            return {
              piece: piece,
              from: piece.position,
              to: p
            }
          });
      }
      else {
        return this.generationService.getFreeBackSquares(piece, 1)
          .map(p => {
            return {
              piece: piece,
              from: piece.position,
              to: p
            }
          });
      }
    }
  }

  getCaptures(piece: Piece, board: Board): Move[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));
    let fieldsToCapture: Position[] = [];

    if (piece.color === Color.WHITE) {
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
    }
    else {
      // left lower field
      let leftUpperField: Position = {
        row: piece.position.row - 1,
        column: piece.position.column - 1
      };

      // right lower field
      let rightUpperField: Position = {
        row: piece.position.row - 1,
        column: piece.position.column + 1
      };
      fieldsToCapture.push(leftUpperField, rightUpperField);
    }


    return fieldsToCapture
      .map(p => {
        let isEnPassant = BoardUtils.isEnPassantSquare(board, p);

        return {
          piece: piece,
          from: piece.position,
          to: p,
          isEnPassant: isEnPassant,
          capturedPiece: isEnPassant ? PositionUtils.getPieceOnPos(board, { row: p.row - 1, column: p.column }) : PositionUtils.getPieceOnPos(board, p)
        }
      });
  }


}