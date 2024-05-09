import { Board } from 'src/app/types/board.t';
import { Color, PieceType, Square } from 'src/app/types/compressed.types.t';
import { Piece } from 'src/app/types/pieces.t';
import BoardUtils from '../board.utils';
import SquareUtils from '../square.utils';
import { MoveGenerationBishopHandler } from './move-generation.bishop.handler';

describe('MoveGenerationBishopHandler', () => {
  let handler: MoveGenerationBishopHandler;
  beforeEach(async () => {
    handler = new MoveGenerationBishopHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, bishopPosition: Square, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bishop: Piece = { type: PieceType.BISHOP, position: bishopPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(bishop, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if bishop is attacking king from bottom right',
      '1k6/8/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if bishop is attacking king from bottom left',
      '7k/8/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if bishop is attacking king from top left',
      '8/8/8/4B3/8/8/7k/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if bishop is attacking king from top right',
      '8/8/8/4B3/8/2k5/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return false if bishop is not attacking king',
      '8/8/8/4B3/1k6/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );

    isAttackingKing(
      'should return false if piece is blocking check',
      '1k6/2n5/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );

    isAttackingKing(
      'should return false if bishop if two pieces are blocking check',
      'B7/5N2/8/3b4/8/5k2/N7/7K b - - 0 1',
      Square.SQ_A8,
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, bishopPosition: Square, expectedBlockingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bishop: Piece = { type: PieceType.BISHOP, position: bishopPosition, color: Color.WHITE };
        const actual = handler.getBlockingSquares(bishop, board).sort(SquareUtils.compareSquares());
        const expected = expectedBlockingSquares.sort(SquareUtils.compareSquares());

        expect(actual).withContext(`Expected ${expected} but got ${actual}. board: ${JSON.stringify(board)}, bishopPosition: ${JSON.stringify(bishopPosition)}`).toEqual(expected);
      });
    }

    getBlockingSquares(
      'should return correct squares if bishop is attacking king from bottom right',
      '1k6/8/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_C7, Square.SQ_D6]
    );

    getBlockingSquares(
      'should return correct squares if bishop is attacking king from bottom left',
      '7k/8/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_F6, Square.SQ_G7]
    );

    getBlockingSquares(
      'should return squares even if piece is blocking check',
      '7k/6n1/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_F6, Square.SQ_G7]
    );

    getBlockingSquares(
      'should return no squares if bishop is not attacking king',
      '6k1/6n1/8/4B3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, bishopPosition: Square, expectedAttackingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bishop: Piece = { type: PieceType.BISHOP, position: bishopPosition, color: Color.WHITE };
        const actual = handler.getAttackingSquares(bishop, board).sort(SquareUtils.compareSquares());
        const expected = expectedAttackingSquares.sort(SquareUtils.compareSquares());

        expect(actual).withContext(`Expected ${expected} but got ${actual}.`).toEqual(expected);
      });
    }

    getAttackingSquares(
      'should return correct squares if bishop is not obstructed',
      '8/8/4k3/8/3B4/8/8/4K3 w - - 0 1',
      Square.SQ_D4,
      [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_E5,
        Square.SQ_F6,
        Square.SQ_G7,
        Square.SQ_H8,
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1
      ]
    );

    getAttackingSquares(
      'should ignore enemy king',
      '8/8/5k2/8/3B4/8/8/4K3 w - - 0 1',
      Square.SQ_D4,
      [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_E5,
        Square.SQ_F6, // enemy king
        Square.SQ_G7,
        Square.SQ_H8,
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1
      ]
    );

    getAttackingSquares(
      'should not ignore blocking enemy piece',
      '8/6k1/5n2/8/3B4/8/8/4K3 w - - 0 1',
      Square.SQ_D4,
      [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_E5,
        Square.SQ_F6, // enemy knight
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1
      ]
    );
  });
});