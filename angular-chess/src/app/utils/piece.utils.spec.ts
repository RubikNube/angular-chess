import { Board, Color, Position } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import BoardUtils from './board.utils';
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

    it('should return "King" for "O-O"', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('O-O')).toBe(PieceType.KING);
    });

    it('should return "King" for "O-O-O"', () => {
      expect(PieceUtils.getPieceTypeFromMoveString('O-O-O')).toBe(PieceType.KING);
    });
  });

  describe('isPinnedDiagonally', () => {
    it('should return true if pawn is pinned diagonally by a bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("3k4/4p3/8/8/7B/8/8/3K4 b - - 0 1");
      let pawnPosition: Position = { column: 5, row: 7 };

      expect(PieceUtils.isPinnedDiagonally(pawnPosition, board)).toBeTrue();
    });

    it('should return true if knight is pinned diagonally by a lower right bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("3k4/4n3/8/8/7B/8/8/3K4 b - - 0 1");
      let knightPosition: Position = { column: 5, row: 7 };

      expect(PieceUtils.isPinnedDiagonally(knightPosition, board)).toBeTrue();
    });

    it('should return true if knight is pinned diagonally by a lower left bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("3k4/2n5/8/B7/8/8/8/3K4 b - - 0 1");
      let knightPosition: Position = { column: 3, row: 7 };

      expect(PieceUtils.isPinnedDiagonally(knightPosition, board)).toBeTrue();
    });

    it('should return true if knight is pinned diagonally by a upper right bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/6B1/8/4n3/3k4/8/8/3K4 b - - 0 1");
      let knightPosition: Position = { column: 5, row: 5 };

      expect(PieceUtils.isPinnedDiagonally(knightPosition, board)).toBeTrue();
    });

    it('should return true if knight is pinned diagonally by a upper left bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/B7/8/2n5/3k4/8/8/3K4 b - - 0 1");
      let knightPosition: Position = { column: 3, row: 5 };

      expect(PieceUtils.isPinnedDiagonally(knightPosition, board)).toBeTrue();
    });
  });

  describe('isPinnedHorizontally', () => {
    it('should return true if pawn is pinned horizontally by a rook from the right side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/3K1P1r/8 w - - 0 1");
      let pawnPosition: Position = { column: 6, row: 2 };

      expect(PieceUtils.isPinnedHorizontally(pawnPosition, board)).toBeTrue();
    });

    it('should return true if pawn is pinned horizontally by a rook from the left side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/r1P1K3/8 w - - 0 1");
      let pawnPosition: Position = { column: 3, row: 2 };

      expect(PieceUtils.isPinnedHorizontally(pawnPosition, board)).toBeTrue();
    });

    it('should return true if knight is pinned horizontally by a rook from the right side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/3K1N1r/8 w - - 0 1");
      let knightPosition: Position = { column: 6, row: 2 };

      expect(PieceUtils.isPinnedHorizontally(knightPosition, board)).toBeTrue();
    });

    it('should return true if knight is pinned horizontally by a rook from the left side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/r1N1K3/8 w - - 0 1");
      let knightPosition: Position = { column: 3, row: 2 };

      expect(PieceUtils.isPinnedHorizontally(knightPosition, board)).toBeTrue();
    });
  });
});