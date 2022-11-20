import { Board, Color, Position } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import PieceUtils from "./piece.utils";
import PositionUtils from "./position.utils";

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

    let board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    // const beginOfMovesIndex = newPgn.search(/\n\d../);
    const moveGroups = this.getMoveGroups(newPgn);

    // moveGroups.forEach(moveGroup => {
    //   if (moveGroup.whiteMoveString) {
    //     let move = PgnUtils.getMoveFromString(board, moveGroup.whiteMoveString, Color.WHITE);
    //     if (move) {
    //       moves.push(move);
    //       // generate updated board after this move is executed
    //       // TODO: make a util method for this (move logic from MoveExecutionService into a util class)
    //     }
    //   }
    //   if (moveGroup.blackMoveString) {
    //     let move = PgnUtils.getMoveFromString(board, moveGroup.blackMoveString, Color.BLACK);
    //     if (move) {
    //       moves.push(move);
    //       // generate updated board after this move is executed
    //     }
    //   };
    // });

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
    const dropPosition: Position | undefined = PgnUtils.extractPositionFromMoveString(moveString);
    const pieceType: PieceType | undefined = PieceUtils.getPieceTypeFromMoveString(moveString);

    if (pieceType && dropPosition) {
      const moves: Move[] = MoveGenerationUtils.getExecutableMoves(board, dropPosition, color)
        .filter(move => move.piece.type === pieceType);

      if (moves.length === 1) {
        return moves[0];
      }
      else {
        console.error(`getMoveFromString can't find a unique move for '${moveString}'. Moves found: ${moves}`);
      }
    }

    return undefined;
  }

  public static extractPositionFromMoveString(moveString: string): Position | undefined {
    let coordinate = moveString.match(new RegExp(this.coordinateRegEx, 'gm'));
    if (coordinate) {
      return PositionUtils.getPositionFromCoordinate(coordinate[0]);;
    }

    return undefined;
  }
};