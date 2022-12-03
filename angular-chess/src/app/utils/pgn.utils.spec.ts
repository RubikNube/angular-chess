import { Color } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import { Board } from "./../types/board.t";
import BoardUtils from "./board.utils";
import PgnUtils, { MoveGroup } from "./pgn.utils";

describe('PgnUtils', () => {
  const wholeGameImport: string = `[Event "IBM Kasparov vs. Deep Blue Rematch"]
[Site "New York, NY USA"]
[Date "1997.05.11"]
[Round "6"]
[White "Deep Blue"]
[Black "Kasparov, Garry"]
[Opening "Caro-Kann: 4...Nd7"]
[ECO "B17"]
[Result "1-0"]
 
1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6
8.Nxe6 Qe7 9.O-O fxe6 10.Bg6+ Kd8 {Kasparov schüttelt kurz den Kopf}
11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.Qd3 Bc6
17.Bf5 exf5 18.Rxe7 Bxe7 19.c4 1-0`;

  const positionB1 = { column: 2, row: 1 };

  const positionC1 = { column: 3, row: 1 };

  const positionC3 = { column: 3, row: 3 };

  const positionD3 = { column: 4, row: 3 };
  const positionD5 = { column: 4, row: 5 };

  const positionE1 = { column: 5, row: 1 };
  const positionE2 = { column: 5, row: 2 };
  const positionE3 = { column: 5, row: 3 };
  const positionE4 = { column: 5, row: 4 };
  const positionE5 = { column: 5, row: 5 };

  const positionF5 = { column: 6, row: 5 };
  const positionF6 = { column: 6, row: 6 };

  const positionG1 = { column: 7, row: 1 };

  describe('extractMovesFromPgn', () => {
    it('should be able to extract pawn moves', () => {
      expect(PgnUtils.extractMovesFromPgn(`1.e4 c6 2.d4 d5`).length).toEqual(4);
    });

    it('should be able to extract whole game', () => {
      expect(PgnUtils.extractMovesFromPgn(wholeGameImport).length).toEqual(37);
    });
  });

  describe('getMoveGroups', () => {
    it('get single move group"', () => {
      const expectedGroup: MoveGroup = {
        moveCount: 1,
        whiteMoveString: 'e4',
        blackMoveString: 'c6'
      };
      expect(PgnUtils.getMoveGroups('1.e4 c6')).toEqual([expectedGroup]);
    });

    it('get two move groups"', () => {
      const expectedGroup1: MoveGroup = {
        moveCount: 1,
        whiteMoveString: 'e4',
        blackMoveString: 'c6'
      };

      const expectedGroup2: MoveGroup = {
        moveCount: 2,
        whiteMoveString: 'd4',
        blackMoveString: 'd5'
      };

      expect(PgnUtils.getMoveGroups('1.e4 c6 2.d4 d5')).toEqual([expectedGroup1, expectedGroup2]);
    });
  });

  describe('getMoveCountFromString', () => {
    it('should return 1 for "1.e4 c6"', () => {
      expect(PgnUtils.getMoveCountFromString('1.e4 c6')).toEqual(1);
    });

    it('should return 42 for "42.e4 c6"', () => {
      expect(PgnUtils.getMoveCountFromString('42.e4 c6')).toEqual(42);
    });

    it('should return undefined for "e4 c6"', () => {
      expect(PgnUtils.getMoveCountFromString('e4 c6')).toEqual(undefined);
    });
  });

  describe('getMoveFromString', () => {
    it('should return pawn e2-e4 for "e4" in initial position', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq');
      const expectedMove: Move = {
        from: positionE2,
        to: positionE4,
        piece: {
          color: Color.WHITE,
          position: positionE2,
          type: PieceType.PAWN
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'e4')).toEqual(expectedMove);
    });

    it('should return pawn e2-e3 for "e3" in initial position', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq');
      const expectedMove: Move = {
        from: positionE2,
        to: positionE3,
        piece: {
          color: Color.WHITE,
          position: positionE2,
          type: PieceType.PAWN
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'e3')).toEqual(expectedMove);
    });

    it('should return white short castle move for "O-O" in "4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1');
      const expectedMove: Move = {
        from: positionE1,
        to: positionG1,
        piece: {
          color: Color.WHITE,
          position: positionE1,
          type: PieceType.KING
        },
        isCheck: false,
        isShortCastle: true
      }

      expect(PgnUtils.getMoveFromString(board, 'O-O')).toEqual(expectedMove);
    });

    it('should return white long castle move for "O-O-O" in "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
      const expectedMove: Move = {
        from: positionE1,
        to: positionC1,
        piece: {
          color: Color.WHITE,
          position: positionE1,
          type: PieceType.KING
        },
        isCheck: false,
        isLongCastle: true
      }

      expect(PgnUtils.getMoveFromString(board, 'O-O-O')).toEqual(expectedMove);
    });

    it('should return white queen capture move for "Qxd5" in "rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5');
      const expectedMove: Move = {
        from: positionD3,
        to: positionD5,
        piece: {
          color: Color.WHITE,
          position: positionD3,
          type: PieceType.QUEEN
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: positionD5
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'Qxd5')).toEqual(expectedMove);
    });

    it('should return white knight capture move for "Nxd5" in "rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5');
      const expectedMove: Move = {
        from: positionC3,
        to: positionD5,
        piece: {
          color: Color.WHITE,
          position: positionC3,
          type: PieceType.KNIGHT
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: positionD5
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'Nxd5')).toEqual(expectedMove);
    });

    it('should return white pawn capture move for "exd5" in "rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5');
      const expectedMove: Move = {
        from: positionE4,
        to: positionD5,
        piece: {
          color: Color.WHITE,
          position: positionE4,
          type: PieceType.PAWN
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: positionD5
        },
        isCheck: false,
        isEnPassant: false
      }

      expect(PgnUtils.getMoveFromString(board, 'exd5')).toEqual(expectedMove);
    });

    it('should return white en passant pawn capture move for "exf6" in "rnbqkbnr/ppppp1p1/7p/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppppp1p1/7p/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3');
      const expectedMove: Move = {
        from: positionE5,
        to: positionF6,
        piece: {
          color: Color.WHITE,
          position: positionE5,
          type: PieceType.PAWN
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: positionF5
        },
        isCheck: false,
        isEnPassant: true
      }

      expect(PgnUtils.getMoveFromString(board, 'exf6')).toEqual(expectedMove);
    });

    it('should return correct knight move pawn if two knights could move to same square for "Nbc3" in "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 3"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp2ppp/3p4/4p3/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 3');
      const expectedMove: Move = {
        from: positionB1,
        to: positionC3,
        piece: {
          color: Color.WHITE,
          position: positionB1,
          type: PieceType.KNIGHT
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'Nbc3')).toEqual(expectedMove);
    });
  });

  describe('extractMoveToPosition', () => {
    it('should return [column:5, row:4] for "e4"', () => {
      expect(PgnUtils.extractMoveToPosition('e4')).toEqual({ column: 5, row: 4 });
    });

    it('should return [column:5, row:2] for "e2"', () => {
      expect(PgnUtils.extractMoveToPosition('e2')).toEqual({ column: 5, row: 2 });
    });

    it('should return [column:5, row:4] for "Ne4"', () => {
      expect(PgnUtils.extractMoveToPosition('Ne4')).toEqual({ column: 5, row: 4 });
    });

    it('should return [column:5, row:4] for "Nxe4"', () => {
      expect(PgnUtils.extractMoveToPosition('Ne4')).toEqual({ column: 5, row: 4 });
    });

    it('should return [column:6, row:3] for "N1f3"', () => {
      expect(PgnUtils.extractMoveToPosition('N1f3')).toEqual({ column: 6, row: 3 });
    });

    it('should return [column:7, row:6] for "Bg6+"', () => {
      expect(PgnUtils.extractMoveToPosition('Bg6+')).toEqual({ column: 7, row: 6 });
    });

    it('should return [column:2, row:5] for "axb5"', () => {
      expect(PgnUtils.extractMoveToPosition('axb5')).toEqual({ column: 2, row: 5 });
    });

    it('should return undefined for "axa"', () => {
      expect(PgnUtils.extractMoveToPosition('axa')).toEqual(undefined);
    });

    it('should return [column:7, row:1] for white "O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O', Color.WHITE)).toEqual({ column: 7, row: 1 });
    });

    it('should return [column:3, row:1] for white "O-O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O-O', Color.WHITE)).toEqual({ column: 3, row: 1 });
    });

    it('should return [column:7, row:8] for black "O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O', Color.BLACK)).toEqual({ column: 7, row: 8 });
    });

    it('should return [column:3, row:8] for black "O-O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O-O', Color.BLACK)).toEqual({ column: 3, row: 8 });
    });
  });

  describe('extractMoveFromPosition', () => {
    it('should return [column:2] for "Nbc4"', () => {
      expect(PgnUtils.extractMoveFromPosition('Nbc4')).toEqual({ column: 2});
    });

    it('should return [column:2] for "bc4"', () => {
      expect(PgnUtils.extractMoveFromPosition('bc4')).toEqual({ column: 2});
    });

    it('should return [] for "c4"', () => {
      expect(PgnUtils.extractMoveFromPosition('c4')).toEqual({});
    });

    it('should return [row:1] for "R1c1"', () => {
      expect(PgnUtils.extractMoveFromPosition('R1c1')).toEqual({row:1});
    });
  });
});