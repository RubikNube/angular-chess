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

  describe('getPieceTypeFromMoveString', () => {
    it('should return "Queen" for "Qe4".', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('Qe4')).toBe(PieceType.QUEEN);
    });

    it('should return "King" for "Ke4".', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('Ke4')).toBe(PieceType.KING);
    });

    it('should return "Queen" for "Re4".', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('Re4')).toBe(PieceType.ROOK);
    });

    it('should return "Bishop" for "Be4".', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('Be4')).toBe(PieceType.BISHOP);
    });

    it('should return "Knight" for "Ne4".', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('Ne4')).toBe(PieceType.KNIGHT);
    });

    it('should return "Pawn" for "e4".', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('e4')).toBe(PieceType.PAWN);
    });

    it('should return "undefined" for empty string', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('')).toBe(undefined);
    });
  });
});