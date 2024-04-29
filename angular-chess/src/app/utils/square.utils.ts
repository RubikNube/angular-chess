import { Position } from "../types/board.t";
import { Square } from "../types/compressed.types.t";

export default class SquareUtils {
  public static convertPositionToSquare(position: Position): Square {
    return (position.column - 1) * 8 + position.row - 1;
  }

  public static convertSquareToPosition(square: Square): Position {
    return {
      row: (square % 8) + 1,
      column: Math.floor(square / 8) + 1
    };
  }
}