import { TestBed } from "@angular/core/testing";
import { Board, Color } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";

describe('BoardUtils', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('isProtected', () => {
    it('should return true if piece is protected by own piece', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/1b6/8/8/8/8/6q1/4K3 w - - 0 1");
      let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: { column: 7, row: 2 } };

      expect(BoardUtils.isProtected(board, queen)).toBeTruthy();
    });

    it('should return true if bishop is protected by own king', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4r3/8/8/4k3/4B3/4K3/8/8 b - - 5 1");
      let bishop: Piece = { type: PieceType.BISHOP, color: Color.WHITE, position: { column: 5, row: 4 } };

      expect(BoardUtils.isProtected(board, bishop)).toBeTruthy();
    });

    it('should return false if piece is not protected by own piece', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/6q1/4K3 w - - 0 1");
      let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: { column: 7, row: 2 } };

      expect(BoardUtils.isProtected(board, queen)).toBeFalsy();
    });
  });

  describe('getRowFen', () => {
    it('should return correct FEN for single white king', () => {
      const king: Piece = {
        type: PieceType.KING,
        color: Color.WHITE,
        position: {
          row: 1,
          column: 5
        }
      }
      const row: Piece[] = [king];

      const actualFen = BoardUtils.getRowFen(row);
      expect(actualFen).toEqual("4K3");
    });

    it('should return 8 for empty row', () => {
      const row: Piece[] = [];

      const actualFen = BoardUtils.getRowFen(row);
      expect(actualFen).toEqual("8");
    });
  });

  describe('getRowFen', () => {
    it('should return piece FEN for starting position', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPieceFen(board);
      expect(actualFen).toEqual("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    });

    it('should return piece FEN for position with two kings', () => {
      const initFen = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPieceFen(board);
      expect(actualFen).toEqual("4k3/8/8/8/8/8/8/4K3");
    });
  });

  describe('getMoveRightFen', () => {
    it('should return FEN for white move right', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveRightFen(board);
      expect(actualFen).toEqual("w");
    });

    it('should return FEN for black move right', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveRightFen(board);
      expect(actualFen).toEqual("b");
    });
  });

  describe('getCastleRightFen', () => {
    it('should return castle right FEN for starting postiion', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("KQkq");
    });

    it('should return - for no castle rights', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("-");
    });

    it('should return KQ for no white castle rights', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("KQ");
    });

    it('should return kq for no black castle rights', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("kq");
    });
  });

  describe('getEnPassantFen', () => {
    it('should return - for no enPassant square', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getEnPassantFen(board);
      expect(actualFen).toEqual("-");
    });

    it('should return enPassantFen for f6', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq f6 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getEnPassantFen(board);
      expect(actualFen).toEqual("f6");
    });

    it('should return enPassantFen for d6', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq d6 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getEnPassantFen(board);
      expect(actualFen).toEqual("d6");
    });
  });

  describe('getPlyFen', () => {
    it('should return 25 for ply 25', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 25 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPlyFen(board);
      expect(actualFen).toEqual("25");
    });

    it('should return 42 for ply 42', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 42 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPlyFen(board);
      expect(actualFen).toEqual("42");
    });
  });

  describe('getMoveFen', () => {
    it('should return 25 for move 25', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 25";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveFen(board);
      expect(actualFen).toEqual("25");
    });

    it('should return 42 for move 42', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 42";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveFen(board);
      expect(actualFen).toEqual("42");
    });
  });

  describe('getFen', () => {
    it('should return FEN for starting position', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getFen(board);
      expect(actualFen).toEqual(initFen);
    });

    it('should return FEN for position with two kings', () => {
      const initFen = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getFen(board);
      expect(actualFen).toEqual(initFen);
    });
  });

  describe('calculateMovesThatCapturePiece', () => {
    it('should be able to return many pieces', () => {
      const initFen = "rnb1kbnr/ppp1pppp/8/8/8/5N2/PPPq1PPP/RNBQKB1R w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);
      let attackingQueen: Piece = {
        color: Color.BLACK,
        type: PieceType.QUEEN,
        position: { row: 2, column: 4 }
      }
      const moveThatCanCapturePiece: Move[] = BoardUtils.calculateMovesThatCapturePiece(board, attackingQueen);

      expect(moveThatCanCapturePiece.length).toEqual(5);
    });
  });
});