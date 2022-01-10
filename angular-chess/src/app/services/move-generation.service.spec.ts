import { TestBed } from '@angular/core/testing';
import { Board, Color } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import PositionUtils from '../utils/position.utils';

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

  it('should generate black queen captures', () => {
    let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/7q/8/7P/4K3 w - - 0 1");
    let queen: Piece = { type: PieceType.QUEEN, position: { column: 8, row: 4 }, color: Color.BLACK };
    let pp = PositionUtils.getPieceOnPos(board, { column: 8, row: 4 });
    let validCaptures = service.getValidCaptures(board, queen);

    expect(validCaptures.length).toEqual(2);
    expect(validCaptures).toContain({
      piece: queen,
      capturedPiece: { type: PieceType.PAWN, position: { column: 8, row: 2 }, color: Color.WHITE },
      from: { column: 8, row: 4 },
      to: { column: 8, row: 2 },
      isCheck: false
    })

    expect(validCaptures).toContain({
      piece: queen,
      capturedPiece: { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE },
      from: { column: 8, row: 4 },
      to: { column: 5, row: 1 },
      isCheck: false
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

describe('isMate', () => {
  let service: MoveGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveGenerationService);
  });

  it('should return false if king is not attacked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });

  it('should return true if king has no escape squares, attacking piece cant be captured and no piece can block the check', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 0 1");

    expect(service.isMate(board)).toBeTrue();
  });

  it('should return false if check giving piece can be captured', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppp1ppp/8/4p3/5PPq/5N2/PPPPP2P/RNBQKB1R w KQkq - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });

  it('should return true if check giving piece cant be captured by the king because its protected', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnb1k1nr/pppppppp/8/2b5/8/8/PPPPPqPP/RNBQKBNR w KQkq - 0 1");

    expect(service.isMate(board)).toBeTrue();
  });

  it('should return false if check giving piece can be captured by the king', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppppppp/8/8/8/8/PPPPPqPP/RNBQKBNR w KQkq - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });

  it('should return false if check giving piece can be blocked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppppppp/8/8/5P1q/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });

  it('should return false if check giving piece on the same column can be blocked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/4r3/8/8/PPPP1PPP/RNBQKBNR w KQq - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });

  it('should return true if check giving piece on the same column cannot be blocked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/4r3/8/7N/PPPP1PPP/1NBRKR2 w q - 0 1");

    expect(service.isMate(board)).toBeTrue();
  });

  it('should return false if check giving piece on the same row can be blocked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/1PPN4/1PK1r3/1PPR3P/PPP2PPP/2B2R2 w q - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });

  it('should return true if check giving piece on the row column cannot be blocked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnbqkbn1/pppppppp/8/1PPN4/1PK1r3/1PPN3P/PPP2PPP/2BR1R2 w q - 0 1");

    expect(service.isMate(board)).toBeTrue();
  });
  
  it('should return false if upper right check giving piece can be blocked', () => {
    let board: Board = BoardUtils.loadBoardFromFen("rnb1kbnr/pppppppp/8/8/5P1q/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1");

    expect(service.isMate(board)).toBeFalse();
  });
});
