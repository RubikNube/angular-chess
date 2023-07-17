import { Board, COLOR_WHITE, Position } from 'src/app/types/board.t';
import { Piece, PieceType } from 'src/app/types/pieces.t';
import BoardUtils from '../board.utils';
import PositionUtils from '../position.utils';
import { MoveGenerationBishopHandler } from './move-generation.bishop.handler';

describe('MoveGenerationBishopHandler', () => {
  let handler: MoveGenerationBishopHandler;
  beforeEach(async () => {
    handler = new MoveGenerationBishopHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, bishopPosition: Position, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bishop: Piece = { type: PieceType.BISHOP, position: bishopPosition, color: COLOR_WHITE };
        const isAttackingKing = handler.isAttackingKing(bishop, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if bishop is attacking king from bottom right',
      '1k6/8/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if bishop is attacking king from bottom left',
      '7k/8/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if bishop is attacking king from top left',
      '8/8/8/4B3/8/8/7k/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if bishop is attacking king from top right',
      '8/8/8/4B3/8/2k5/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return false if bishop is not attacking king',
      '8/8/8/4B3/1k6/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );

    isAttackingKing(
      'should return false if piece is blocking check',
      '1k6/2n5/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );

    isAttackingKing(
      'should return false if bishop if two pieces are blocking check',
      'B7/5N2/8/3b4/8/5k2/N7/7K b - - 0 1',
      { column: 1, row: 8 },
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, bishopPosition: Position, expectedBlockingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bishop: Piece = { type: PieceType.BISHOP, position: bishopPosition, color: COLOR_WHITE };
        const blockingSquares = PositionUtils.sortPositions(handler.getBlockingSquares(bishop, board));

        expect(blockingSquares).toEqual(PositionUtils.sortPositions(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return correct squares if bishop is attacking king from bottom right',
      '1k6/8/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 3, row: 7 }, { column: 4, row: 6 }]
    );

    getBlockingSquares(
      'should return correct squares if bishop is attacking king from bottom left',
      '7k/8/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 6, row: 6 }, { column: 7, row: 7 }]
    );

    getBlockingSquares(
      'should return squares even if piece is blocking check',
      '7k/6n1/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 6, row: 6 }, { column: 7, row: 7 }]
    );

    getBlockingSquares(
      'should return no squares if bishop is not attacking king',
      '6k1/6n1/8/4B3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, bishopPosition: Position, expectedAttackingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bishop: Piece = { type: PieceType.BISHOP, position: bishopPosition, color: COLOR_WHITE };
        const attackingSquares = PositionUtils.sortPositions(handler.getAttackingSquares(bishop, board));

        expect(attackingSquares).toEqual(PositionUtils.sortPositions(expectedAttackingSquares));
      });
    }

    getAttackingSquares(
      'should return correct squares if bishop is not obstructed',
      '8/8/4k3/8/3B4/8/8/4K3 w - - 0 1',
      { column: 4, row: 4 },
      [
        { column: 1, row: 1 }, 
        { column: 2, row: 2 }, 
        { column: 3, row: 3 }, 
        { column: 5, row: 5 }, 
        { column: 6, row: 6 }, 
        { column: 7, row: 7 }, 
        { column: 8, row: 8 },
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 }
      ]
    );

    getAttackingSquares(
      'should ignore enemy king',
      '8/8/5k2/8/3B4/8/8/4K3 w - - 0 1',
      { column: 4, row: 4 },
      [
        { column: 1, row: 1 }, 
        { column: 2, row: 2 }, 
        { column: 3, row: 3 }, 
        { column: 5, row: 5 }, 
        { column: 6, row: 6 }, 
        { column: 7, row: 7 }, 
        { column: 8, row: 8 },
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 }
      ]
    );

    getAttackingSquares(
      'should not ignore blocking enemy piece',
      '8/6k1/5n2/8/3B4/8/8/4K3 w - - 0 1',
      { column: 4, row: 4 },
      [
        { column: 1, row: 1 }, 
        { column: 2, row: 2 }, 
        { column: 3, row: 3 }, 
        { column: 5, row: 5 }, 
        { column: 6, row: 6 }, 
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 }
      ]
    );
  });
});