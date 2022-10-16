import { Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationKnightHandler implements MoveGenerationHandler {

  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.KNIGHT;
  }

  public getMoves(piece: Piece): Move[] {
    return this.getValidKnightMoves(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p
        }
      });
  }

  public getCaptures(piece: Piece): Move[] {
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
}