import { Board, Color, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationPawnHandler implements MoveGenerationHandler {

  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.PAWN;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedDiagonally(piece.position, board) ||
      PieceUtils.isPinnedHorizontally(piece.position, board)) {
      return [];
    }

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
    if (PieceUtils.isPinnedHorizontally(piece.position, board)) {
      return [];
    }
    const captureCandidates = MoveGenerationPawnHandler.getCaptureCandidates(piece);

    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);
    const pinningCapturesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, lowerToUpperDiagonal);
    if (pinningCapturesOnLowerToUpperDiagonal) {
      if (this.canPinnedPieceBeCaptured(pinningCapturesOnLowerToUpperDiagonal, captureCandidates)) {
        return pinningCapturesOnLowerToUpperDiagonal;
      }
      else {
        return [];
      }
    }

    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);

    const pinningCapturesOnUpperToLowerDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, upperToLowerDiagonal);
    if (pinningCapturesOnUpperToLowerDiagonal) {
      if (this.canPinnedPieceBeCaptured(pinningCapturesOnUpperToLowerDiagonal, captureCandidates)) {
        return pinningCapturesOnUpperToLowerDiagonal;
      }
      else {
        return [];
      }
    }

    return captureCandidates
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

  private canPinnedPieceBeCaptured(pinningMoves: Move[], captureCandidates: Position[]) {
    return pinningMoves.length > 0 && PositionUtils.includes(captureCandidates, pinningMoves[0].to);
  }

  public static getCaptureCandidates(piece: Piece): Position[] {
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