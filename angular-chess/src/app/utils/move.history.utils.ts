import { COLOR_BLACK, COLOR_WHITE } from "../types/board.t";

export default class MoveHistoryUtils {

  public static getMoveCount(startingColor: boolean, moveColor: boolean, moveHistoryIndex: number): number {
    if (startingColor === COLOR_WHITE) {
      return Math.floor(moveHistoryIndex / 2) + 1;
    }
    else {
      return Math.floor(moveHistoryIndex / 2) + (moveColor === COLOR_BLACK ? 1 : 2);
    }
  }
}