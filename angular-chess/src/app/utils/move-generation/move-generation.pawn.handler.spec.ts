import { Board, Position } from "src/app/types/board.t";
import { Color } from "src/app/types/compressed.types.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationPawnHandler } from "./move-generation.pawn.handler";

describe('MoveGenerationPawnHandler', () => {
  let handler: MoveGenerationPawnHandler;
  beforeEach(async () => {
    handler = new MoveGenerationPawnHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, pawnPosition: Position, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(pawn, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if pawn is attacking king from left',
      '8/8/5k2/4P3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if pawn is attacking king from left',
      '8/8/3k4/4P3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return false if pawn is not attacking king',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, pawnPosition: Position, expectedBlockingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: Color.WHITE };
        const blockingSquares = PositionUtils.sortPositions(handler.getBlockingSquares(pawn, board));

        expect(blockingSquares).toEqual(PositionUtils.sortPositions(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return no squares if pawn is not attacking king',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );

    getBlockingSquares(
      'should return no squares if pawn is attacking king',
      '8/8/5k2/4P3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, pawnPosition: Position, expectedAttackingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: Color.WHITE };
        const attackingSquares = PositionUtils.sortPositions(handler.getAttackingSquares(pawn, board));

        expect(attackingSquares).toEqual(PositionUtils.sortPositions(expectedAttackingSquares));
      });
    }

    getAttackingSquares(
      'should return upper left and upper right squares',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [
        { column: 4, row: 6 },
        { column: 6, row: 6 }
      ]
    );

    getAttackingSquares(
      'should return only attacked squares on the board',
      '8/8/4k3/P7/8/8/8/2K5 w - - 0 1',
      { column: 1, row: 5 },
      [
        { column: 2, row: 6 }
      ]
    );
  });
});