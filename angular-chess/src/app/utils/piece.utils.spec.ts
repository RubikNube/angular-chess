import { Board } from '../types/board.t';
import { Color, PieceType, Square } from '../types/compressed.types.t';
import { Piece } from '../types/pieces.t';
import BoardUtils from './board.utils';
import PieceUtils from './piece.utils';
import PositionUtils from './position.utils';

describe('PieceUtils', () => {
  const whiteKing55: Piece = {
    color: Color.WHITE,
    position: Square.SQ_E5,
    type: PieceType.KING
  };

  const whiteKing55OtherInstance: Piece = {
    color: Color.WHITE,
    position: Square.SQ_E5,
    type: PieceType.KING
  };

  const blackKing55: Piece = {
    color: Color.BLACK,
    position: Square.SQ_E5,
    type: PieceType.KING
  };

  describe('pieceEquals', () => {
    it('should return true for the same instance.', () => {
      expect(PieceUtils.pieceEquals(whiteKing55, whiteKing55)).toBeTruthy();
    });

    it('should return true for the different instances with the same values.', () => {
      expect(PieceUtils.pieceEquals(whiteKing55, whiteKing55OtherInstance)).toBeTruthy();
    });

    it('should return false for different colors.', () => {
      expect(PieceUtils.pieceEquals(whiteKing55, blackKing55)).toBeFalsy();
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
    it('should return true if piece is pinned diagonally by a lower right bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("3k4/4n3/8/8/7B/8/8/3K4 b - - 0 1");
      let piecePosition: Square = Square.SQ_E7;

      expect(PieceUtils.isPinnedDiagonally(piecePosition, board)).toBeTruthy();
    });

    it('should return true if piece is pinned diagonally by a lower left bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("3k4/2n5/8/B7/8/8/8/3K4 b - - 0 1");
      let piecePosition: Square = Square.SQ_C7;

      expect(PieceUtils.isPinnedDiagonally(piecePosition, board)).toBeTruthy();
    });

    it('should return true if piece is pinned diagonally by a upper right bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/6B1/8/4n3/3k4/8/8/3K4 b - - 0 1");
      let piecePosition: Square = Square.SQ_E5;

      expect(PieceUtils.isPinnedDiagonally(piecePosition, board)).toBeTruthy();
    });

    it('should return true if piece is pinned diagonally by a upper left bishop.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/B7/8/2n5/3k4/8/8/3K4 b - - 0 1");
      let piecePosition: Square = Square.SQ_C5;

      expect(PieceUtils.isPinnedDiagonally(piecePosition, board)).toBeTruthy();
    });
  });

  describe('isPinnedHorizontally', () => {
    it('should return true if piece is pinned horizontally by a rook from the right side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/3K1P1r/8 w - - 0 1");
      let piecePosition: Square = Square.SQ_F2;

      expect(PieceUtils.isPinnedHorizontally(piecePosition, board)).toBeTruthy();
    });

    it('should return true if piece is pinned horizontally by a rook from the left side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/r1P1K3/8 w - - 0 1");
      let piecePosition: Square = Square.SQ_C2;

      expect(PieceUtils.isPinnedHorizontally(piecePosition, board)).toBeTruthy();
    });
  });

  describe('isPinnedVertically', () => {
    it('should return true if piece is pinned vertically by a rook from the top side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("3r4/8/3B4/8/3K2k1/8/8/8 w - - 0 1");
      let piecePosition: Square = Square.SQ_D6;

      expect(PieceUtils.isPinnedVertically(piecePosition, board)).toBeTruthy();
    });

    it('should return true if piece is pinned vertically by a rook from the bottom side.', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/8/3K4/8/1k1B4/8/3r4/8 w - - 0 1");
      let piecePosition: Square = Square.SQ_D4;

      expect(PieceUtils.isPinnedVertically(piecePosition, board)).toBeTruthy();
    });
  });

  describe('sortByDistanceToPiece', () => {
    it('should return pieces sorted by distance to the bishop on e5', () => {
      const board: Board = BoardUtils.loadBoardFromFen("7B/6B1/8/4b3/8/2k5/1N6/K7 b - - 0 1");
      const bishop: Piece = PositionUtils.getPieceOnPos(board, { column: 5, row: 5 })!;
      const piecesOnDiagonal: Piece[] = [
        PositionUtils.getPieceOnPos(board, { column: 1, row: 1 })!,
        PositionUtils.getPieceOnPos(board, { column: 2, row: 2 })!,
        PositionUtils.getPieceOnPos(board, { column: 3, row: 3 })!,
        PositionUtils.getPieceOnPos(board, { column: 5, row: 5 })!,
        PositionUtils.getPieceOnPos(board, { column: 7, row: 7 })!,
        PositionUtils.getPieceOnPos(board, { column: 8, row: 8 })!
      ]

      const sortedPieces: Piece[] = [
        PositionUtils.getPieceOnPos(board, { column: 5, row: 5 })!,
        PositionUtils.getPieceOnPos(board, { column: 3, row: 3 })!,
        PositionUtils.getPieceOnPos(board, { column: 7, row: 7 })!,
        PositionUtils.getPieceOnPos(board, { column: 2, row: 2 })!,
        PositionUtils.getPieceOnPos(board, { column: 8, row: 8 })!,
        PositionUtils.getPieceOnPos(board, { column: 1, row: 1 })!
      ]

      const actualClosestPieces = PieceUtils.sortByDistanceToPiece(bishop, piecesOnDiagonal);
      expect(actualClosestPieces).toEqual(sortedPieces);
    });

    it('should not change input piece array', () => {
      const board: Board = BoardUtils.loadBoardFromFen("7B/6B1/8/4b3/8/2k5/1N6/K7 b - - 0 1");
      const bishop: Piece = PositionUtils.getPieceOnPos(board, { column: 5, row: 5 })!;
      const piecesOnDiagonal: Piece[] = [
        PositionUtils.getPieceOnPos(board, { column: 1, row: 1 })!,
        PositionUtils.getPieceOnPos(board, { column: 2, row: 2 })!,
        PositionUtils.getPieceOnPos(board, { column: 3, row: 3 })!,
        PositionUtils.getPieceOnPos(board, { column: 5, row: 5 })!,
        PositionUtils.getPieceOnPos(board, { column: 7, row: 7 })!,
        PositionUtils.getPieceOnPos(board, { column: 8, row: 8 })!
      ];

      const actualClosestPieces = PieceUtils.sortByDistanceToPiece(bishop, piecesOnDiagonal);

      expect(actualClosestPieces).not.toEqual(piecesOnDiagonal);
    });
  });
});