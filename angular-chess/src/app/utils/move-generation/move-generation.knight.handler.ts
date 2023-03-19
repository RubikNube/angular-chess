import { Board, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationKnightHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.KNIGHT;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedDiagonally(piece.position, board) ||
      PieceUtils.isPinnedHorizontally(piece.position, board) ||
      PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }

    return this.getValidKnightMoves(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p
        }
      });
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedDiagonally(piece.position, board) ||
      PieceUtils.isPinnedHorizontally(piece.position, board) ||
      PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }
    return this.getValidKnightMoves(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p
        };
      });
  }

  private getValidKnightMoves(piece: Piece): Position[] {
    return [
      {
        row: piece.position.row + 1,
        column: piece.position.column - 2
      },
      {
        row: piece.position.row + 2,
        column: piece.position.column - 1
      },
      {
        row: piece.position.row + 1,
        column: piece.position.column + 2
      },
      {
        row: piece.position.row + 2,
        column: piece.position.column + 1
      },
      {
        row: piece.position.row - 1,
        column: piece.position.column - 2
      },
      {
        row: piece.position.row - 2,
        column: piece.position.column - 1
      },
      {
        row: piece.position.row - 1,
        column: piece.position.column + 2
      },
      {
        row: piece.position.row - 2,
        column: piece.position.column + 1
      }];
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    // get all valid knight moves
    // check if any of them is the enemy king
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return false;
    }
    const knightMoves = this.getValidKnightMoves(piece);

    return PositionUtils.includes(knightMoves, kingPos);
  }

  public getBlockingSquares(piece: Piece, board: Board): Position[] {
    return [];
  }
}