import { Position } from '../types/board.t';
import { Square } from '../types/compressed.types.t';
import SquareUtils from './square.utils';

describe('SquareUtils', () => {
  describe('convertPositionToSquare', () => {
    it('should convert position (r: 1, c: 1) to square a1', () => {
      const position: Position = { row: 1, column: 1 };
      const expectedSquare: Square = Square.SQ_A1;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (r: 1, c: 2) to square a2', () => {
      const position: Position = { row: 1, column: 2 };
      const expectedSquare: Square = Square.SQ_A2;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (r:5,c:2) to square e2', () => {
      const position: Position = { row: 5, column: 2 };
      const expectedSquare: Square = Square.SQ_E2;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (r:5,c:3) to square e3', () => {
      const position: Position = { row: 5, column: 3 };
      const expectedSquare: Square = Square.SQ_E3;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (r: 8, c: 1) to square h1', () => {
      const position: Position = { row: 8, column: 1 };
      const expectedSquare: Square = Square.SQ_H1;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (r: 8, c: 8) to square h8', () => {
      const position: Position = { row: 8, column: 8 };
      const expectedSquare: Square = Square.SQ_H8;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });
  });

  describe('convertPositionToSquare', () => {
    it('should convert square a1 to position (r: 1, c: 1)', () => {
      const square: Square = Square.SQ_A1;
      const expectedPosition: Position = { row: 1, column: 1 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square a2 to position (r: 1, c: 2)', () => {
      const square: Square = Square.SQ_A2;
      const expectedPosition: Position = { row: 1, column: 2 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square e2 to position (r: 5, c: 2)', () => {
      const square: Square = Square.SQ_E2;
      const expectedPosition: Position = { row: 5, column: 2 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square e3 to position (r: 5, c: 3)', () => {
      const square: Square = Square.SQ_E3;
      const expectedPosition: Position = { row: 5, column: 3 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square h1 to position (r: 8, c: 1)', () => {
      const square: Square = Square.SQ_H1;
      const expectedPosition: Position = { row: 8, column: 1 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square h8 to position (r: 8, c: 8)', () => {
      const square: Square = Square.SQ_H8;
      const expectedPosition: Position = { row: 8, column: 8 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });
  });
});