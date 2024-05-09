import { Board } from "../types/board.t";
import { Square } from "../types/compressed.types.t";
import { Move } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveExecutionUtils from "./move-execution.utils";
import MoveUtils from "./move.utils";
import PieceUtils from "./piece.utils";
import SquareUtils from "./square.utils";

export default class TestUtils {
  public static sortByPosition = (a: Move, b: Move): number => a.to - b.to;
  public static sortByPromotedPieceType = (a: Move, b: Move): number => {
    if (a.promotedPiece && b.promotedPiece) {
      return a.promotedPiece.type - b.promotedPiece.type;
    }
    return 0;
  };

  public static sortByCapturedPieceType = (a: Move, b: Move): number => {
    if (a.capturedPiece && !b.capturedPiece) {
      return -1;
    }
    if (!a.capturedPiece && b.capturedPiece) {
      return 1;
    }
    if (a.capturedPiece && b.capturedPiece) {
      return a.capturedPiece.type - b.capturedPiece.type;
    }
    return 0;
  };

  public static compareMoves(expected: Move, actual: Move): number {
    if (expected.from !== actual.from) {
      return expected.from - actual.from;
    }
    if (expected.to !== actual.to) {
      return expected.to - actual.to;
    }
    if (expected.capturedPiece && actual.capturedPiece) {
      return expected.capturedPiece.type - actual.capturedPiece.type;
    }
    if (expected.promotedPiece && actual.promotedPiece) {
      return expected.promotedPiece.type - actual.promotedPiece.type;
    }
    return 0;
  }

  public static checkMoves(expected: Move[], actual: Move[]): void {
    expected.sort(TestUtils.sortByPosition);
    actual.sort(TestUtils.sortByPosition);

    expect(expected.length)
      .withContext(`Expected ${expected.length} moves but got ${actual.length}.\nExpected: ${TestUtils.printMoveSequence(expected)}\nActual: ${TestUtils.printMoveSequence(actual)}\n`)
      .toEqual(actual.length);
    for (let i = 0; i < expected.length; i++) {
      expect(TestUtils.compareMoves(expected[i], actual[i]))
        .withContext(`Expected move ${TestUtils.moveToString(expected[i])} but got ${TestUtils.moveToString(actual[i])}`)
        .toEqual(0);
    }
  }

  /**
   * Checks if the expected move matches the actual move. It ignores the order of the attributes in the move JSON.
   * Throws an error if the moves do not match.
   *
   * @param expected - The expected move.
   * @param actual - The actual move.
   * @returns void
   */
  public static checkMove(expected: Move, actual: Move | undefined): void {
    if (!actual) {
      fail(`Expected move ${TestUtils.moveToString(expected)} but got undefined`);
      return;
    }

    this.checkBoards(expected.boardAfterMove, actual.boardAfterMove);
    expect(expected.from)
      .withContext(`Expected from: ${expected.from} but got ${actual.from}`)
      .toEqual(actual.from);
    expect(expected.to)
      .withContext(`Expected to: ${expected.to} but got ${actual.to}`)
      .toEqual(actual.to);
    expect(expected.piece)
      .withContext(`Expected piece: ${JSON.stringify(expected.piece)} but got ${JSON.stringify(actual.piece)}`)
      .toEqual(actual.piece);
    expect(expected.capturedPiece)
      .withContext(`Expected captured piece: ${JSON.stringify(expected.capturedPiece)} but got ${JSON.stringify(actual.capturedPiece)}`)
      .toEqual(actual.capturedPiece);
    expect(expected.promotedPiece)
      .withContext(`Expected promoted piece: ${JSON.stringify(expected.promotedPiece)} but got ${JSON.stringify(actual.promotedPiece)}`)
      .toEqual(actual.promotedPiece);
    expect(expected.isCheck)
      .withContext(`Expected isCheck: ${expected.isCheck} but got ${actual.isCheck}`)
      .toEqual(actual.isCheck);
    expect(expected.isMate)
      .withContext(`Expected isMate: ${expected.isMate} but got ${actual.isMate}`)
      .toEqual(actual.isMate);
    expect(expected.isEnPassant)
      .withContext(`Expected isEnPassant: ${expected.isEnPassant} but got ${actual.isEnPassant}`)
      .toEqual(actual.isEnPassant);
    expect(expected.isShortCastle)
      .withContext(`Expected isShortCastle: ${expected.isShortCastle} but got ${actual.isShortCastle}`)
      .toEqual(actual.isShortCastle);
    expect(expected.isLongCastle)
      .withContext(`Expected isLongCastle: ${expected.isLongCastle} but got ${actual.isLongCastle}`)
      .toEqual(actual.isLongCastle);
  }

  public static moveToString(move: Move): string {
    return `${SquareUtils.fileOf(move.from)}${SquareUtils.rankOf(move.from)}-${SquareUtils.fileOf(move.to)}${SquareUtils.rankOf(move.to)}: ${move.capturedPiece?.type} ${move.promotedPiece?.type}`;
  };

  public static checkBoards(expectedBoard: Board | undefined, actualBoard: Board | undefined): void {
    expect(expectedBoard?.blackCastleRights)
      .withContext(`Expected black castle rights: ${JSON.stringify(expectedBoard?.blackCastleRights)} but got ${JSON.stringify(actualBoard?.blackCastleRights)}`)
      .toEqual(actualBoard?.blackCastleRights);
    expect(expectedBoard?.whiteCastleRights)
      .withContext(`Expected white castle rights: ${JSON.stringify(expectedBoard?.whiteCastleRights)} but got ${JSON.stringify(actualBoard?.whiteCastleRights)}`)
      .toEqual(actualBoard?.whiteCastleRights);
    expect(expectedBoard?.enPassantSquare ?? Square.SQUARE_NB)
      .withContext(`Expected en passant square: ${JSON.stringify(expectedBoard?.enPassantSquare)} but got ${JSON.stringify(actualBoard?.enPassantSquare)}`)
      .toEqual(actualBoard?.enPassantSquare ?? Square.SQUARE_NB);
    expect(expectedBoard?.playerToMove)
      .withContext(`Expected player to move: ${JSON.stringify(expectedBoard?.playerToMove)} but got ${JSON.stringify(actualBoard?.playerToMove)}`)
      .toEqual(actualBoard?.playerToMove);
    const expectedPieces = PieceUtils.sortPieces(expectedBoard?.pieces);
    const actualPieces = PieceUtils.sortPieces(actualBoard?.pieces);
    expect(expectedPieces)
      .withContext(`Expected pieces: ${JSON.stringify(expectedPieces)} but got ${JSON.stringify(actualPieces)}`)
      .toEqual(actualPieces);
  }

  /**
   * Used to print the move sequences for the test cases.
   * 
   * @param moveSequences the move sequences to print
   * @param initialBoard the initial board
   * @returns the printed move sequences
   */
  public static printMoveSequences(moveSequences: Move[][], initialBoard: Board): string {
    let fens: string[] = [];
    for (const element of moveSequences) {
      let moveSequence: Move[] = element;
      let latestBoard: Board | undefined = initialBoard;
      for (const element of moveSequence) {
        let move = element;
        if (latestBoard) {
          let executedMove: Move | undefined = MoveExecutionUtils.executeMove(move, latestBoard);
          latestBoard = executedMove?.boardAfterMove;
        }
      }
      if (latestBoard) {
        fens.push(BoardUtils.getFen(latestBoard) + ' ' + TestUtils.printMoveSequence(moveSequence));
      }
    }

    // sort the fens alphabetically
    fens.sort();

    let printedSequences: string = '';
    for (let i = 0; i < fens.length; i++) {
      printedSequences += (i + 1) + ' ' + fens[i] + '\n';
    }

    return printedSequences;
  }


  public static printMoveSequence(moveSequence: Move[]): string {
    return '[' + moveSequence.map((move: Move) => `${MoveUtils.moveToUci(move)}`).join(',') + ']';
  }

  public static printMoveSequenceWithNumber(moveSequence: Move[]): string {
    return '[' + moveSequence.map((move: Move, index: number) => `${index + 1}. ${MoveUtils.moveToUci(move)}`).join(',') + ']';
  }
}