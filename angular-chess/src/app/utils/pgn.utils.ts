import { Move } from "../types/pieces.t";

export default class PgnUtils {
  public static extractMovesFromPgn(newPgn: string): Move[] {
    var moves: Move[] = [];

    var beginOfMovesIndex = newPgn.search('^1\.');
    var moveString = newPgn.substring(beginOfMovesIndex);

    return moves;
  }
}