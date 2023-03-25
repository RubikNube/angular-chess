import { Board, Color, Position } from "src/app/types/board.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationRookHandler } from "./move-generation.rook.handler";

describe('MoveGenerationRookHandler', () => {
  let handler: MoveGenerationRookHandler;
  beforeEach(async () => {
    handler = new MoveGenerationRookHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, rookPosition: Position, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(rook, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if rook is attacking king from right',
      '8/8/8/k3R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return false if rook is not attacking king',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );

    isAttackingKing(
      'should return false if rook piece is blocking check',
      '8/8/8/kN2R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, rookPosition: Position, expectedBlockingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const blockingSquares = PositionUtils.sortPositions(handler.getBlockingSquares(rook, board));

        expect(blockingSquares).toEqual(PositionUtils.sortPositions(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return empty array if rook is not attacking king',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );

    getBlockingSquares(
      'should return blocking squares if rook is attacking king from right',
      '8/8/8/k3R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 2, row: 5 }, { column: 3, row: 5 }, { column: 4, row: 5 }]
    );

    getBlockingSquares(
      'should return blocking squares if rook is attacking king from top',
      '8/8/8/4R3/8/8/8/2K1k3 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 5, row: 2 }, { column: 5, row: 3 }, { column: 5, row: 4 }]
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, rookPosition: Position, expectedAttackingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const attackingSquares = PositionUtils.sortPositions(handler.getAttackingSquares(rook, board));

        expect(attackingSquares).toEqual(PositionUtils.sortPositions(expectedAttackingSquares));
      });
    }

    getAttackingSquares(
      'should return free squares where the rook can move',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [
        { column: 1, row: 5 },
        { column: 2, row: 5 },
        { column: 3, row: 5 },
        { column: 4, row: 5 },
        { column: 5, row: 1 },
        { column: 5, row: 2 },
        { column: 5, row: 3 },
        { column: 5, row: 4 },
        { column: 5, row: 6 },
        { column: 5, row: 7 },
        { column: 5, row: 8 },
        { column: 6, row: 5 },
        { column: 7, row: 5 },
        { column: 8, row: 5 }
      ]
    );

    getAttackingSquares(
      'should ignore the enemy king',
      '8/8/8/2k1R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [
        { column: 1, row: 5 },
        { column: 2, row: 5 },
        { column: 3, row: 5 },
        { column: 4, row: 5 },
        { column: 5, row: 1 },
        { column: 5, row: 2 },
        { column: 5, row: 3 },
        { column: 5, row: 4 },
        { column: 5, row: 6 },
        { column: 5, row: 7 },
        { column: 5, row: 8 },
        { column: 6, row: 5 },
        { column: 7, row: 5 },
        { column: 8, row: 5 }
      ]
    );

    getAttackingSquares(
      'should not ignore blocking pieces',
      '8/8/8/1kn1R3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [
        { column: 3, row: 5 },
        { column: 4, row: 5 },
        { column: 5, row: 1 },
        { column: 5, row: 2 },
        { column: 5, row: 3 },
        { column: 5, row: 4 },
        { column: 5, row: 6 },
        { column: 5, row: 7 },
        { column: 5, row: 8 },
        { column: 6, row: 5 },
        { column: 7, row: 5 },
        { column: 8, row: 5 }
      ]
    );
  });
});