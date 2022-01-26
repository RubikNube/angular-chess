import { Color } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import PieceUtils from './piece.utils';

describe('PieceUtils', () => {
  const whiteKing55: Piece = {
    color: Color.WHITE,
    position: { row: 5, column: 5 },
    type: PieceType.KING
  };

  const whiteKing55OtherInstance: Piece = {
    color: Color.WHITE,
    position: { row: 5, column: 5 },
    type: PieceType.KING
  };

  const blackKing55: Piece = {
    color: Color.BLACK,
    position: { row: 5, column: 5 },
    type: PieceType.KING
  };

  describe('pieceEquals', () => {
    it('should return true for the same instance.', () => {
      expect(PieceUtils.pieceEquals(whiteKing55, whiteKing55)).toBeTrue();
    });

    it('should return true for the different instances with the same values.', () => {
      expect(PieceUtils.pieceEquals(whiteKing55, whiteKing55OtherInstance)).toBeTrue();
    });

    it('should return false for different colors.', () => {
      expect(PieceUtils.pieceEquals(whiteKing55, blackKing55)).toBeFalse();
    });
  });
});