import { TestBed } from '@angular/core/testing';
import { COLOR_BLACK, COLOR_WHITE, Color } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import { ChessBoardService } from './chess-board.service';


describe('ChessBoardService', () => {
  let service: ChessBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('removePiece', () => {
    it('should remove a piece with the given type and position', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");

      let pieceToRemove: Piece = {
        type: PieceType.ROOK,
        position: {
          row: 1,
          column: 1
        },
        color: COLOR_WHITE
      }

      service.removePiece(pieceToRemove);

      expect(service.getBoard().pieces.length).toEqual(31);
    });
  });

  describe('importFen', () => {
    it('should empty the board for empty fen', () => {
      service.importFen("8/8/8//8/8/8/8/8");
      expect(service.getBoard().pieces).toEqual([]);
    });

    it('should load start FEN', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
      expect(service.getBoard().pieces.sort(comparePositions())).toEqual([
        { color: COLOR_WHITE, type: PieceType.ROOK, position: { row: 1, column: 1 } },
        { color: COLOR_WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 2 } },
        { color: COLOR_WHITE, type: PieceType.BISHOP, position: { row: 1, column: 3 } },
        { color: COLOR_WHITE, type: PieceType.QUEEN, position: { row: 1, column: 4 } },
        { color: COLOR_WHITE, type: PieceType.KING, position: { row: 1, column: 5 } },
        { color: COLOR_WHITE, type: PieceType.BISHOP, position: { row: 1, column: 6 } },
        { color: COLOR_WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 7 } },
        { color: COLOR_WHITE, type: PieceType.ROOK, position: { row: 1, column: 8 } },

        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 1 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 2 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 3 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 4 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 5 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 6 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 7 } },
        { color: COLOR_WHITE, type: PieceType.PAWN, position: { row: 2, column: 8 } },

        { color: COLOR_BLACK, type: PieceType.ROOK, position: { row: 8, column: 1 } },
        { color: COLOR_BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 2 } },
        { color: COLOR_BLACK, type: PieceType.BISHOP, position: { row: 8, column: 3 } },
        { color: COLOR_BLACK, type: PieceType.QUEEN, position: { row: 8, column: 4 } },
        { color: COLOR_BLACK, type: PieceType.KING, position: { row: 8, column: 5 } },
        { color: COLOR_BLACK, type: PieceType.BISHOP, position: { row: 8, column: 6 } },
        { color: COLOR_BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 7 } },
        { color: COLOR_BLACK, type: PieceType.ROOK, position: { row: 8, column: 8 } },

        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 1 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 2 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 3 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 4 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 5 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 6 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 7 } },
        { color: COLOR_BLACK, type: PieceType.PAWN, position: { row: 7, column: 8 } },

      ]
        .sort(comparePositions()));
    });

    it('should set white player to move if "w" after position', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");

      expect(service.getPlayerToMove()).toEqual(COLOR_WHITE);
    });

    it('should set black player to move if "b" after position', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b");

      expect(service.getPlayerToMove()).toEqual(COLOR_BLACK);
    });

    it('should set castle rights for "KQkq"', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq");

      expect(service.getCastleRights(COLOR_WHITE)).toEqual({ player: COLOR_WHITE, canLongCastle: true, canShortCastle: true });
      expect(service.getCastleRights(COLOR_BLACK)).toEqual({ player: COLOR_BLACK, canLongCastle: true, canShortCastle: true });
    });

    it('should set castle rights for "KQ"', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ");

      expect(service.getCastleRights(COLOR_WHITE)).toEqual({ player: COLOR_WHITE, canLongCastle: true, canShortCastle: true });
      expect(service.getCastleRights(COLOR_BLACK)).toEqual({ player: COLOR_BLACK, canLongCastle: false, canShortCastle: false });
    });

    it('should set castle rights for "Kk"', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kk");

      expect(service.getCastleRights(COLOR_WHITE)).toEqual({ player: COLOR_WHITE, canLongCastle: false, canShortCastle: true });
      expect(service.getCastleRights(COLOR_BLACK)).toEqual({ player: COLOR_BLACK, canLongCastle: false, canShortCastle: true });
    });

    it('should set castle rights for empty castle fen', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");

      expect(service.getCastleRights(COLOR_WHITE)).toEqual({ player: COLOR_WHITE, canLongCastle: false, canShortCastle: false });
      expect(service.getCastleRights(COLOR_BLACK)).toEqual({ player: COLOR_BLACK, canLongCastle: false, canShortCastle: false });
    });

    it('should set en passant square to e3', () => {
      service.importFen("rnbqkbnr/ppppp1pp/8/8/4Pp2/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");

      expect(service.getEnPassantSquare()).toEqual({ column: 5, row: 3 });
    });

    it('should set en passant square to e6', () => {
      service.importFen("rnbqkbnr/pppp1ppp/8/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 1");

      expect(service.getEnPassantSquare()).toEqual({ column: 5, row: 6 });
    });

    it('should set number of plies to 24', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 24 1");

      expect(service.getPlyCount()).toEqual(24);
    });

    it('should set number of plies to 42', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 42 1");

      expect(service.getPlyCount()).toEqual(42);
    });

    it('should set number of moves to 22', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 22");

      expect(service.getMoveCount()).toEqual(22);
    });

    it('should set number of moves to 42', () => {
      service.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 42");

      expect(service.getMoveCount()).toEqual(42);
    });
  });
});

function comparePositions(): ((a: { color: boolean; type: PieceType; position: { row: number; column: number; }; }, b: { color: boolean; type: PieceType; position: { row: number; column: number; }; }) => number) | undefined {
  return (a, b) => {
    let rowA = a.position.row;
    let columnA = a.position.column;

    let rowB = b.position.row;
    let columnB = b.position.column;

    if (rowA < rowB) {
      return -1;
    } else if (rowA > rowB) {
      return 1;
    } else {
      if (columnA < columnB) {
        return -1;
      } else if (columnA > columnB) {
        return 1;
      } else {
        return 0;
      };
    }
  };
}
