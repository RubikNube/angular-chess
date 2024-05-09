import { Board, } from "src/app/types/board.t";
import { Square } from "src/app/types/compressed.types.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PieceUtils from "../piece.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

/**
 * Enum representing the possible move offsets for a knight piece on a chessboard.
 */
enum KnightMoveOffsets {
  NORTH_EAST = 17,
  EAST_NORTH = 10,
  EAST_SOUTH = -6,
  SOUTH_EAST = -15,
  SOUTH_WEST = -17,
  WEST_SOUTH = -10,
  WEST_NORTH = 6,
  NORTH_WEST = 15
}

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

  public getValidKnightMoves(piece: Piece): Square[] {
    // iterate over all possible knight move offsets
    const validKnightMoves: Square[] = [];
    for (const offset of
      [
        KnightMoveOffsets.NORTH_EAST,
        KnightMoveOffsets.EAST_NORTH,
        KnightMoveOffsets.EAST_SOUTH,
        KnightMoveOffsets.SOUTH_EAST,
        KnightMoveOffsets.SOUTH_WEST,
        KnightMoveOffsets.WEST_SOUTH,
        KnightMoveOffsets.WEST_NORTH,
        KnightMoveOffsets.NORTH_WEST
      ] as number[]) {
      const newSquare = piece.position + offset;
      if (BoardUtils.getDistanceOfSquares(piece.position, newSquare) === 2) {
        validKnightMoves.push(newSquare);
      }
    }

    return validKnightMoves;
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    // get all valid knight moves
    // check if any of them is the enemy king
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return false;
    }
    const knightMoves = this.getValidKnightMoves(piece);

    return SquareUtils.includes(knightMoves, kingPos);
  }

  public getBlockingSquares(piece: Piece, board: Board): Square[] {
    return [];
  }

  public getAttackingSquares(piece: Piece, board: Board): Square[] {
    return this.getValidKnightMoves(piece)
      .filter(square => SquareUtils.isOnBoard(square));
  }
}