import { Board, Color } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";


export type MoveGroup = {
  whiteMoveString?: string;
  blackMoveString?: string;
  moveCount?: number;
}

export default class PgnUtils {
  private static kingSideCastleRegEx = /O-O/;
  private static queenSideCastleRegEx = /O-O-O/;
  private static coordinateRegEx = /[a-h][1-8]/;
  private static pieceCharRegEx = new RegExp(`(K|Q|R|B|N)([a-h]|[1-8])?(${this.coordinateRegEx.source})?`);
  private static pieceRegEx = new RegExp(`${this.pieceCharRegEx.source}?${this.coordinateRegEx.source}`);
  private static moveRegEx = new RegExp(`(${this.coordinateRegEx.source}|${this.pieceRegEx.source}|${this.kingSideCastleRegEx.source}|${this.queenSideCastleRegEx.source})`);
  private static captureRegEx = new RegExp(`(${this.pieceCharRegEx.source}|[a-h])x${this.coordinateRegEx.source}`);
  private static moveOrCaptureRegEx = new RegExp(`(${this.moveRegEx.source}|${this.captureRegEx.source})\\+?`);
  private static moveGroupRegEx = `(\\d+\.${this.moveOrCaptureRegEx.source} ${this.moveOrCaptureRegEx.source}|\\d+\.${this.moveOrCaptureRegEx.source})`;

  public static extractMovesFromPgn(newPgn: string): Move[] {
    const moves: Move[] = [];

    const board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    // const beginOfMovesIndex = newPgn.search(/\n\d../);
    const moveGroups = this.getMoveGroups(newPgn);

    moveGroups.forEach(moveGroup => {
      // if (moveGroup.whiteMove) {
      //   moves.push(moveGroup.whiteMove);
      // }
      // if (moveGroup.blackMove) {
      //   moves.push(moveGroup.blackMove);
      // }
    });

    return moves;
  }

  /**
   * Extracts the move groups from a given PGN input.
   * 
   * Example PGN: 
   * 
   * '
   * [Site "New York, NY USA"]\n
   * [Date "1997.05.11"]\n
   * 1.e4 c6 2.d4 d5'
   * 
   * Move groups: ['1.e4 c6', '2.d4 d5']
   * 
   * @param pgn the PNG from which the move groups should be extraced
   * @returns the move groups for the given input
   */
  public static getMoveGroups(pgn: string): MoveGroup[] {
    const searchResults = [...pgn.matchAll(new RegExp(this.moveGroupRegEx, 'gm'))];
    let moveGroups: MoveGroup[] = [];

    for (let i = 0; i < searchResults.length; i++) {
      const searchResult = searchResults[i][0];
      const moveStrings = [...searchResult.matchAll(new RegExp(this.moveOrCaptureRegEx, 'gm'))];

      const moveGroup: MoveGroup = {
        moveCount: i + 1
      }

      if (moveStrings.length >= 1) {
        const whiteMove = moveStrings[0][0];
        moveGroup.whiteMoveString = whiteMove;
      }
      if (moveStrings.length >= 2) {
        const blackMove = moveStrings[1][0];
        moveGroup.blackMoveString = blackMove;
      }

      moveGroups.push(moveGroup);
    }

    return moveGroups;
  }

  /**
   * @param moveString the string from which the move count should be extraced. Example move string: '1.e4 c6' with move count 1
   * @returns the move count for the given moveString
   */
  public static getMoveCountFromString(moveString: string): number | undefined {
    const moveCountResult = moveString.match(/^\d+/g);

    if (moveCountResult && moveCountResult?.length >= 1) {
      return +moveCountResult[0];
    }
    else {
      return undefined;
    }
  }

  public static getMoveFromString(board: Board, moveString: string, color: Color): Move | undefined {
    const move: Move = {
      from: { column: 1, row: 1 },
      to: { column: 1, row: 1 },
      piece: { color, position: { column: 1, row: 1 }, type: PieceType.PAWN }
    }

    return undefined;
  }
};