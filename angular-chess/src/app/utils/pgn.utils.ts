import { Board, Color, Position } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import CopyUtils from "./copy.utils";
import LoggingUtils, { LogLevel } from "./logging.utils";
import MoveExecutionUtils from "./move-execution.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import MoveHistoryUtils from "./move.history.utils";
import MoveUtils from "./move.utils";
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
  private static columnCharRegEx = /[a-h]/;
  private static rowCharRegEx = /[1-8]/;
  private static promotionRegEx = /[a-h][18]=[QRBN]/;
  private static pieceMoveRegEx = new RegExp(`([KQRBN])(${this.columnCharRegEx.source}|${this.rowCharRegEx.source})?(${this.coordinateRegEx.source})?`);
  private static pieceRegEx = new RegExp(`${this.pieceMoveRegEx.source}?${this.coordinateRegEx.source}`);
  private static moveRegEx = new RegExp(`(${this.coordinateRegEx.source}|${this.pieceRegEx.source}|${this.kingSideCastleRegEx.source}|${this.queenSideCastleRegEx.source})`);
  private static captureRegEx = new RegExp(`(${this.pieceMoveRegEx.source}|[a-h])x${this.coordinateRegEx.source}`);
  private static moveOrCaptureRegEx = new RegExp(`(${this.promotionRegEx.source}|${this.moveRegEx.source}|${this.captureRegEx.source})\\+?`);
  private static moveNumberRegEx = /(\d+. ?)/;
  private static moveGroupRegEx = `(${this.moveNumberRegEx.source}${this.moveOrCaptureRegEx.source} ${this.moveOrCaptureRegEx.source}|${this.moveNumberRegEx.source}${this.moveOrCaptureRegEx.source})`;

  /**
   * Extracts the moves from a given PGN input.
   * 
   * Example PGN: 
   * 
   * '
   * [Site "New York, NY USA"]\n
   * [Date "1997.05.11"]\n
   * 1.e4 c6 2.d4 d5'
   * 
   * Moves: [e2-e4, c7-c6, d2-d4, d7-d5]
   * 
   * @param pgn the PNG from which the move groups should be extraced
   * @returns the moves for the given input
   */
  public static extractMovesFromPgn(pgn: string): Move[] {
    const moves: Move[] = [];

    let currentBoard: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    const moveGroups = this.getMoveGroups(pgn);

    moveGroups.forEach(moveGroup => {
      if (moveGroup.whiteMoveString) {
        let move = PgnUtils.getMoveFromString(currentBoard, moveGroup.whiteMoveString);
        if (move) {
          const executedMove = MoveExecutionUtils.executeMove(move, currentBoard);
          if (executedMove) {
            if (executedMove.boardAfterMove) {
              currentBoard = CopyUtils.deepCopyElement(executedMove.boardAfterMove);
            }
            else {
              throw Error("Can't load PGN: " + pgn);
            }
            moves.push(executedMove);
          }
        }
      }
      if (moveGroup.blackMoveString) {
        let move = PgnUtils.getMoveFromString(currentBoard, moveGroup.blackMoveString);
        if (move) {
          const executedMove = MoveExecutionUtils.executeMove(move, currentBoard);
          if (executedMove) {
            if (executedMove.boardAfterMove) {
              currentBoard = CopyUtils.deepCopyElement(executedMove.boardAfterMove);
            }
            else {
              throw Error("Can't load PGN: " + pgn);
            }
            moves.push(executedMove);
          }
        }
      };
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
    const moveGroupStrings = [...pgn.matchAll(new RegExp(this.moveGroupRegEx, 'gm'))];
    let moveGroups: MoveGroup[] = [];

    for (const moveGroupString of moveGroupStrings) {
      const moveStrings = [...moveGroupString[0].matchAll(new RegExp(this.moveOrCaptureRegEx, 'gm'))];

      const moveNumberString = moveGroupString[0].match(new RegExp(this.moveNumberRegEx, 'gm'));
      let moveNumber: number | undefined = undefined;
      if (moveNumberString) {
        moveNumber = +moveNumberString[0];
      }
      const moveGroup: MoveGroup = {
        moveCount: moveNumber
      }

      if (moveStrings.length >= 1) {
        moveGroup.whiteMoveString = moveStrings[0][0];
      }
      if (moveStrings.length >= 2) {
        moveGroup.blackMoveString = moveStrings[1][0];
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

  /**
   * @param board The board for which the move should be extracted.
   * @param moveString The move string (e.g. 'a5, axb5, O-O' etc.)
   * @returns The move that represents the given move string if valid, else undefined.
   */
  public static getMoveFromString(board: Board, moveString: string): Move | undefined {
    const rawMove = this.getRawMoveFromString(board, moveString);
    const promotionMatch = moveString.match(this.promotionRegEx);

    if (rawMove && promotionMatch) {
      const promotionPieceLabel = promotionMatch[0][promotionMatch[0].length - 1];
      rawMove.promotedPiece = {
        type: this.getPromotedPiece(promotionPieceLabel),
        color: rawMove.piece.color,
        position: rawMove.to
      }
    }

    return rawMove;
  }

  /**
   * @param board The board for which the move should be extracted.
   * @param moveString The move string (e.g. 'a5, axb5, O-O' etc.)
   * @returns The raw move (no promotion included) that represents the given move string if valid, else undefined.
   */
  public static getRawMoveFromString(board: Board, moveString: string): Move | undefined {
    const playerToMove: Color = board.playerToMove;
    const dropPosition: Position | undefined = PgnUtils.extractMoveToPosition(moveString, playerToMove);
    const pieceType: PieceType | undefined = PieceUtils.getPieceTypeFromMoveString(moveString);

    if (pieceType && dropPosition) {
      const executableMoves = MoveGenerationUtils.getExecutableMoves(board, dropPosition, playerToMove);
      const moves: Move[] = executableMoves
        .filter(move => move.piece.type === pieceType);

      if (moves.length === 1) {
        return moves[0];
      }
      else {
        let fromPos = this.extractMoveFromPosition(moveString);

        const filteredMoves: Move[] = moves.filter(move => {
          if (fromPos.column) {
            return fromPos.column === move.from.column;
          }
          else if (fromPos.row) {
            return fromPos.row === move.from.row;
          }
          else {
            return false;
          }
        });

        if (filteredMoves.length === 1) {
          return filteredMoves[0];
        }
        else {
          LoggingUtils.log(LogLevel.ERROR, () => `getMoveFromString can\'t find a unique move for ${moveString}. Moves found: ${moves}`);
        }
      }
    }

    return undefined;
  }

  private static getPromotedPiece(pieceLabel: string): PieceType {
    switch (pieceLabel) {
      case "Q":
        return PieceType.QUEEN;
      case "R":
        return PieceType.ROOK;
      case "B":
        return PieceType.BISHOP;
      case "N":
        return PieceType.KNIGHT;
      default:
        return PieceType.QUEEN;
    }
  }

  /**
   * @param moveString The move string (e.g. 'a5, axb5, O-O' etc.)
   * @param playerToMove The player that has the move right.
   * @returns The end position of the move that is represented by the moveString. 
   */
  public static extractMoveToPosition(moveString: string, playerToMove?: Color): Position | undefined {
    if (moveString === 'O-O') {
      return {
        column: 7,
        row: playerToMove === Color.WHITE ? 1 : 8
      }
    }
    else if (moveString === 'O-O-O') {
      return {
        column: 3,
        row: playerToMove === Color.WHITE ? 1 : 8
      }
    }

    let coordinate = moveString.match(new RegExp(this.coordinateRegEx, 'gm'));
    if (coordinate) {
      return PositionUtils.getPositionFromCoordinate(coordinate[0]);;
    }

    return undefined;
  }

  /**
   * @param moveString The move string (e.g. 'a5, axb5, O-O' etc.)
   * @returns The start position of the move sting if specified (e.g. {column:2} for Nbc3) 
   */
  public static extractMoveFromPosition(moveString: string): { column?: number, row?: number } {
    const pieceType: PieceType | undefined = PieceUtils.getPieceTypeFromMoveString(moveString);

    if (pieceType === PieceType.PAWN) {
      if (moveString.length <= 2) {
        return {};
      }
      else {
        return this.getPartialPositionFromChar(moveString[0]);
      }
    }
    else {
      if (moveString.length <= 3) {
        return {};
      }
      else {
        return this.getPartialPositionFromChar(moveString[1]);
      }
    }
  };

  private static getPartialPositionFromChar(char: string) {
    if (new RegExp(this.rowCharRegEx, 'gm').test(char)) {
      return { row: Number.parseInt(char) };
    }
    else if (new RegExp(this.columnCharRegEx, 'gm').test(char)) {
      return { column: char.charCodeAt(0) - 96 };
    }
    else {
      return {};
    }
  }

  /**
   * @param moves the moves from which the pgn should be extracted
   * @returns the pgn string for the given moves
   */

  public static extractPgnFromMoves(moves: Move[]): string {
    let pgn = '';

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const moveString = MoveUtils.getSimpleMoveRepresentation(move);
      const moveCount = PgnUtils.getMoveCount(moves[0].piece.color, move.piece.color, i);
      pgn += `${moveCount}${moveString} `;
    }

    return pgn;
  }

  private static getMoveCount(startingColor: Color, moveColor: Color, moveHistoryIndex: number): string {
    if (moveColor === Color.WHITE) {
      if(moveHistoryIndex===0&&startingColor===Color.BLACK){
        return '... '
      }
      else{
        return MoveHistoryUtils.getMoveCount(startingColor, moveColor, moveHistoryIndex)+'.';
      }

    }
    else {
      return '';
    }

  }
};


