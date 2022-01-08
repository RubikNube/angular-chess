import { TestBed } from '@angular/core/testing';
import { Board, Color } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';

import { MoveGenerationService } from './move-generation.service';

describe('MoveGenerationService', () => {
  let service: MoveGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate white pawn moves for one and two squares', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1");
    let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 2 }, color: Color.WHITE };
    let validMoves = service.getValidMoves(board, pawn);

    expect(validMoves.length).toEqual(2);
    expect(validMoves[0]).toEqual({ piece: pawn, from: { column: 5, row: 2 }, to: { column: 5, row: 3 }, isCheck: false })
    expect(validMoves[1]).toEqual({ piece: pawn, from: { column: 5, row: 2 }, to: { column: 5, row: 4 }, isCheck: false })
  });

  it('should generate black pawn moves for one and two squares', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/4p3/8/8/8/8/4P3/4K3 b - - 0 1");
    let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 7 }, color: Color.BLACK };
    let validMoves = service.getValidMoves(board, pawn);

    expect(validMoves.length).toEqual(2);
    expect(validMoves[0]).toEqual({ piece: pawn, from: { column: 5, row: 7 }, to: { column: 5, row: 6 }, isCheck: false })
    expect(validMoves[1]).toEqual({ piece: pawn, from: { column: 5, row: 7 }, to: { column: 5, row: 5 }, isCheck: false })
  });

  it('should generate white pawn captures for left and right', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/4p3/8/3p1p2/4P3/8/8/4K3 w - - 0 1");
    let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 4 }, color: Color.WHITE };
    let validMoves = service.getValidCaptures(board, pawn);

    expect(validMoves.length).toEqual(2);
    expect(validMoves[0]).toEqual({
      piece: pawn,
      capturedPiece: { type: PieceType.PAWN, position: { column: 4, row: 5 }, color: Color.BLACK },
      from: { column: 5, row: 4 },
      to: { column: 4, row: 5 },
      isCheck: false,
      isEnPassant: false
    })
    expect(validMoves[1]).toEqual({
      piece: pawn,
      capturedPiece: { type: PieceType.PAWN, position: { column: 6, row: 5 }, color: Color.BLACK },
      from: { column: 5, row: 4 },
      to: { column: 6, row: 5 },
      isCheck: false,
      isEnPassant: false
    })
  });

  it('should generate black pawn captures for left and right', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/4p3/3P1P2/8/8/4K3 b - - 0 1");
    let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 5 }, color: Color.BLACK };
    let validMoves = service.getValidCaptures(board, pawn);

    expect(validMoves.length).toEqual(2);
    expect(validMoves[0]).toEqual({
      piece: pawn,
      capturedPiece: { type: PieceType.PAWN, position: { column: 4, row: 4 }, color: Color.WHITE },
      from: { column: 5, row: 5 },
      to: { column: 4, row: 4 },
      isCheck: false,
      isEnPassant: false
    })
    expect(validMoves[1]).toEqual({
      piece: pawn,
      capturedPiece: { type: PieceType.PAWN, position: { column: 6, row: 4 }, color: Color.WHITE },
      from: { column: 5, row: 5 },
      to: { column: 6, row: 4 },
      isCheck: false,
      isEnPassant: false
    })
  });

  it('should generate white pawn en passant capture', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppp1ppp/8/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 1");
    let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 5 }, color: Color.WHITE };
    let validMoves = service.getValidCaptures(board, pawn);

    expect(validMoves.length).toEqual(1);
    expect(validMoves[0]).toEqual({
      piece: pawn,
      capturedPiece: { type: PieceType.PAWN, position: { column: 5, row: 5 }, color: Color.BLACK },
      from: { column: 4, row: 5 },
      to: { column: 5, row: 6 },
      isCheck: false,
      isEnPassant: true
    })
  });

  it('should generate black pawn en passant capture', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/ppppp1pp/8/8/4Pp2/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
    let pawn: Piece = { type: PieceType.PAWN, position: { column: 6, row: 4 }, color: Color.BLACK };
    let validMoves = service.getValidCaptures(board, pawn);

    expect(validMoves.length).toEqual(1);
    expect(validMoves[0]).toEqual({
      piece: pawn,
      capturedPiece: { type: PieceType.PAWN, position: { column: 5, row: 4 }, color: Color.WHITE },
      from: { column: 6, row: 4 },
      to: { column: 5, row: 3 },
      isCheck: false,
      isEnPassant: true
    })
  });

  it('should generate white king short castle', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).toContain({
      piece: king,
      from: { column: 5, row: 1 },
      to: { column: 7, row: 1 },
      isCheck: false,
      isShortCastle: true
    });
  });

  it('should not generate white king short castle when f1 is attacked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4kr2/8/8/8/8/8/8/R3K2R w KQ - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).not.toContain({
      piece: king,
      from: { column: 5, row: 1 },
      to: { column: 7, row: 1 },
      isCheck: false,
      isShortCastle: true
    });
  });

  it('should generate white king long castle', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).toContain({
      piece: king,
      from: { column: 5, row: 1 },
      to: { column: 3, row: 1 },
      isCheck: false,
      isLongCastle: true
    });
  });

  it('should not generate white king long castle when d1 is attacked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("3rk3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).not.toContain({
      piece: king,
      from: { column: 5, row: 1 },
      to: { column: 3, row: 1 },
      isCheck: false,
      isLongCastle: true
    });
  });

  it('should generate black king short castle', () => {
    let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).toContain({
      piece: king,
      from: { column: 5, row: 8 },
      to: { column: 7, row: 8 },
      isCheck: false,
      isShortCastle: true
    });
  });

  it('should generate black king long castle', () => {
    let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).toContain({
      piece: king,
      from: { column: 5, row: 8 },
      to: { column: 3, row: 8 },
      isCheck: false,
      isLongCastle: true
    });
  });

  it('should not generate black king short castle if f8 is attacked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/4KR2 b - - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).not.toContain({
      piece: king,
      from: { column: 5, row: 8 },
      to: { column: 7, row: 8 },
      isCheck: false,
      isShortCastle: true
    });
  });

  it('should not generate black king long castle if d8 is attacked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/3RK3 b - - 0 1");
    let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
    let validMoves = service.getValidMoves(board, king);

    expect(validMoves).not.toContain({
      piece: king,
      from: { column: 5, row: 8 },
      to: { column: 3, row: 8 },
      isCheck: false,
      isLongCastle: true
    });
  });
});
