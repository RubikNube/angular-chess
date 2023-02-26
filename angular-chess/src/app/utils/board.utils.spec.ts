import { TestBed } from "@angular/core/testing";
import { Board, Color, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";

describe('BoardUtils', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('calculateAttackedSquares', () => {
    it('should generate attacked squares for queen', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/7q/8/7P/4K3 w - - 0 1");
      let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(board, Color.BLACK);

      expect(attackedSquares).toContain({ column: 5, row: 1 });
      expect(attackedSquares).toContain({ column: 8, row: 2 });
    });

    it('should generate attacked squares for black pawn', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/8/4p3/8/8/2P5/8/8 w - - 0 1");
      let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(board, Color.BLACK);

      expect(attackedSquares).toContain({ column: 4, row: 5 });
      expect(attackedSquares).toContain({ column: 6, row: 5 });
    });

    it('should generate attacked squares for white pawn', () => {
      let board: Board = BoardUtils.loadBoardFromFen("8/8/4p3/8/8/2P5/8/8 w - - 0 1");
      let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(board, Color.WHITE);

      expect(attackedSquares).toContain({ column: 2, row: 4 });
      expect(attackedSquares).toContain({ column: 4, row: 4 });
    });
  });

  describe('isProtected', () => {
    it('should return true if piece is protected by own piece', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/1b6/8/8/8/8/6q1/4K3 w - - 0 1");
      let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: { column: 7, row: 2 } };

      expect(BoardUtils.isProtected(board, queen)).toBeTrue();
    });

    it('should return false if piece is not protected by own piece', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/6q1/4K3 w - - 0 1");
      let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: { column: 7, row: 2 } };

      expect(BoardUtils.isProtected(board, queen)).toBeFalse();
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

  describe('isMate', () => {
    it('should return false if king is not attacked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return true if king has no escape squares, attacking piece cant be captured and no piece can block the check', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeTrue();
    });

    it('should return false if check giving piece can be captured', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppp1ppp/8/4p3/5PPq/5N2/PPPPP2P/RNBQKB1R w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return true if check giving piece cant be captured by the king because its protected', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1k1nr/pppppppp/8/2b5/8/8/PPPPPqPP/RNBQKBNR w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeTrue();
    });

    it('should return false if check giving piece can be captured by the king', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppppppp/8/8/8/8/PPPPPqPP/RNBQKBNR w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return false if check giving piece on the same column can be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/4r3/8/8/PPPP1PPP/RNBQKBNR w KQq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return true if check giving piece on the same column cannot be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/4r3/8/7N/PPPP1PPP/1NBRKR2 w q - 0 1");

      expect(BoardUtils.isMate(board)).toBeTrue();
    });

    it('should return false if check giving piece on the same row can be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/1PPN4/1PK1r3/1PPR3P/PPP2PPP/2B2R2 w q - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return true if check giving piece on the row column cannot be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/1PPN4/1PK1r3/1PPN3P/PPP2PPP/2BR1R2 w q - 0 1");

      expect(BoardUtils.isMate(board)).toBeTrue();
    });

    it('should return false if upper right check giving piece can be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppppppp/8/8/5P1q/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return false if upper left check giving piece can be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppppppp/8/q7/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return false if lower right check giving piece can be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/ppppp1pp/8/5p1Q/8/8/PPPPPPPP/RNB1KBNR b KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return false if lower left check giving piece can be blocked', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/ppp1pppp/8/3p4/Q7/8/PPPPPPPP/RNB1KBNR b KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });

    it('should return false if check giving piece can be captured', () => {
      let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/ppp1pppp/8/8/8/5N2/PPPq1PPP/RNBQKB1R w KQkq - 0 1");

      expect(BoardUtils.isMate(board)).toBeFalse();
    });
  });
});