import { Board, Color, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "../utils/board.utils";
import PositionUtils from "../utils/position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationPawnHandler implements MoveGenerationHandler {

  constructor(public generationService: MoveGenerationService) {

  }

  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.PAWN;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    console.log("getMoveSquares: " + JSON.stringify(piece));
    if (piece.color === Color.WHITE) {
      if (piece.position.row === 2) {
        return BoardUtils.getFreeFrontSquares(board, piece, 2)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
      else {
        return BoardUtils.getFreeFrontSquares(board, piece, 1)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
    }
    else {
      if (piece.position.row === 7) {
        return BoardUtils.getFreeBackSquares(board, piece, 2)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
      else {
        return BoardUtils.getFreeBackSquares(board, piece, 1)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
    }
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));

    return MoveGenerationPawnHandler.getCaptureCanditates(piece)
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

  public static getCaptureCanditates(piece: Piece): Position[] {
    if (piece.color === Color.WHITE) {
      // left upper field
      const leftUpperField: Position = {
        row: piece.position.row + 1,
        column: piece.position.column - 1
      };

      // right upper field
      const rightUpperField: Position = {
        row: piece.position.row + 1,
        column: piece.position.column + 1
      };
      return [leftUpperField, rightUpperField];
    }
    else {
      // left lower field
      const leftUpperField: Position = {
        row: piece.position.row - 1,
        column: piece.position.column - 1
      };

      // right lower field
      const rightUpperField: Position = {
        row: piece.position.row - 1,
        column: piece.position.column + 1
      };
      return [leftUpperField, rightUpperField];
    }
  }
}