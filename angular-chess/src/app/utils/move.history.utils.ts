import { Color } from "../types/compressed.types.t";

export default class MoveHistoryUtils {

  public static getMoveCount(startingColor: Color, moveColor: Color, moveHistoryIndex: number): number {
    if (startingColor === Color.WHITE) {
      return Math.floor(moveHistoryIndex / 2) + 1;
    }
    else {
      return Math.floor(moveHistoryIndex / 2) + (moveColor === Color.BLACK ? 1 : 2);
    }
  }
}