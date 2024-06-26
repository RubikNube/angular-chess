import { Color, PieceType, Square } from "../types/compressed.types.t";
import { Move } from "../types/pieces.t";
import { Board } from "./../types/board.t";
import BoardUtils from "./board.utils";
import PgnUtils, { MoveGroup } from "./pgn.utils";
import TestUtils from "./test.utils";

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

  const gameOnePgn = `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 c5 5. Nf3 Nc6 6. e3 O-O 7. Bd3 d5 8. a3
Bxc3+ 9. bxc3 b6 10. O-O Ba6 11. cxd5 Bxd3 12. Qxd3 Qxd5 13. Re1 c4 14. Qc2 Ne4
15. Nd2 f5 16. f3 Nxd2 17. Bxd2 Na5 18. e4 Qd7 19. exf5 exf5 20. Re5 Nb3 21.
Rae1 Nxd2 22. Qxd2 Rae8 23. Qe2 Rxe5 24. Qxc4+ Qd5 25. Qf1 Rxe1 26. Qxe1 Kf7 27.
Qd2 Rc8 28. Qd3 g6 29. Qa6 Rc7 30. Qd3 Qc4 31. Qe3 Qxc3 32. Qe5 Qc1+ 33. Kf2
Rc2+ 34. Kg3 Qg5+`;

  const gameWith119PlyAndAdditionalSpace = `[Event "Zlatoust"]
[Site "Zlatoust"]
[Date "1961.??.??"]
[EventDate "?"]
[Round "?"]
[Result "1-0"]
[White "Anatoly Karpov"]
[Black "Gaimaletdinov"]
[ECO "C62"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "119"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 d6 4. d4 Bg4 5. d5 a6 6. Bxc6+ bxc6
7. dxc6 h6 8. O-O Nf6 9. Qd3 Be7 10. Nc3 O-O 11. Nd2 Qe8
12. Qc4 Rb8 13. Nb3 Rb6 14. Na5 Kh7 15. b3 Be6 16. Qd3 Nh5
17. Rd1 f5 18. f3 f4 19. Nd5 Bxd5 20. exd5+ Kh8 21. Nb7 Bf6
22. Rb1 Qf7 23. a4 Bg5 24. a5 Rb4 25. c3 Rb5 26. c4 Rxb7
27. cxb7 Rb8 28. b4 Rxb7 29. b5 axb5 30. cxb5 Qe8 31. Qc4 Qa8
32. Qc6 Qa7+ 33. b6 cxb6 34. axb6 Qa6 35. Bd2 Nf6 36. Qxd6 e4
37. Bxf4 Bxf4 38. Qxf4 exf3 39. Qxf3 Rxb6 40. Rxb6 Qxb6+
41. Kh1 Qd6 42. h3 Kh7 43. Qe2 Ng8 44. Qe6 Qxe6 45. dxe6 Nf6
46. e7 Kg8 47. Re1 Kf7 48. Kh2 Ke8 49. Re5 Ng8 50. Kg3 Nxe7
51. Kg4 Kf7 52. h4 Ng8 53. Kf4 Kf6 54. g4 Ne7 55. h5 g5+
56. Ke4 Kf7 57. Ra5 Ng8 58. Ke5 Kg7 59. Ra7+ Kh8 60. Ke6 1-0`;

  const wholeGame100PlyWithPromotion = `[Event "Rated Blitz game"]
[Site "https://lichess.org/jwpBRIs6"]
[Date "2023.02.05"]
[White "RubikNube"]
[Black "Dirk_Gently"]
[Result "0-1"]
[UTCDate "2023.02.05"]
[UTCTime "18:12:41"]
[WhiteElo "2043"]
[BlackElo "2066"]
[WhiteRatingDiff "-5"]
[BlackRatingDiff "+5"]
[Variant "Standard"]
[TimeControl "300+3"]
[ECO "B11"]
[Opening "Caro-Kann Defense: Two Knights Attack, Mindeno Variation, Exchange Line"]
[Termination "Normal"]

1. e4 c6 2. Nc3 d5 3. Nf3 Bg4 4. h3 Bxf3 5. Qxf3 dxe4 6. Nxe4 Nf6 7. c3 Nbd7 8. d4 e6 
9. Bc4 Be7 10. O-O O-O 11. Re1 c5 12. dxc5 Nxc5 13. Nxf6+ Bxf6 14. Be3 b6 
15. Red1 Qc7 16. Rd2 Rad8 17. Rad1 Rxd2 18. Rxd2 g6 19. Qxf6 Ne4 
20. Qd4 Nxd2 21. Bxd2 Rd8 22. Qf4 e5 23. Qg5 Rxd2 24. Qxd2 Qxc4 25. b3 Qe6 
26. c4 a5 27. Kf1 Kg7 28. Ke2 f6 29. a3 Qe7 30. b4 Qb7 31. f3 e4 32. Qd5 exf3+ 
33. Kxf3 Qxd5+ 34. cxd5 axb4 35. axb4 Kf7 36. Ke4 Ke7 37. g4 Kd6 38. Kd4 h6 39. Ke4 b5 
40. Kd4 f5 41. gxf5 gxf5 42. h4 h5 43. Ke3 Kxd5 44. Kf4 Ke6 45. Kg5 Ke5 46. Kxh5 f4 47. Kg6 f3 
48. h5 f2 49. h6 f1=Q 50. h7 Qf8 0-1`;

  describe('extractMovesFromPgn', () => {
    function extractMovesFromPgn(description: string, pgn: string, expectedMoveCount: number) {
      it(description, () => {
        const actualMoves = PgnUtils.extractMovesFromPgn(pgn)
        const actualMoveCount = actualMoves.length;
        expect(actualMoveCount)
          .withContext(`Expected ${expectedMoveCount} moves but got ${actualMoveCount}\nMoves: ${TestUtils.printMoveSequence(actualMoves)}`)
          .toEqual(expectedMoveCount);
      });
    }

    extractMovesFromPgn('should be able to extract pawn moves', `1.e4 c6 2.d4 d5`, 4);
    extractMovesFromPgn('should be able to extract whole game', wholeGameImport, 37);
    extractMovesFromPgn('should be able to extract whole game without meta data', gameOnePgn, 68);
    extractMovesFromPgn('should be able to extract whole game with 119 ply count and addional space', gameWith119PlyAndAdditionalSpace, 119);
    extractMovesFromPgn('should be able to extract whole game with promotion', wholeGame100PlyWithPromotion, 100);
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

    it('get single move group with promotion"', () => {
      const expectedGroup: MoveGroup = {
        moveCount: 49,
        whiteMoveString: 'h6',
        blackMoveString: 'f1=Q'
      };
      expect(PgnUtils.getMoveGroups('49. h6 f1=Q')).toEqual([expectedGroup]);
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
        from: Square.SQ_E2,
        to: Square.SQ_E4,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_E2,
          type: PieceType.PAWN
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'e4')).toEqual(expectedMove);
    });

    it('should return pawn e2-e3 for "e3" in initial position', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq');
      const expectedMove: Move = {
        from: Square.SQ_E2,
        to: Square.SQ_E3,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_E2,
          type: PieceType.PAWN
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'e3')).toEqual(expectedMove);
    });

    it('should return white short castle move for "O-O" in "4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1');
      const expectedMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_G1,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_E1,
          type: PieceType.KING
        },
        isCheck: false,
        isShortCastle: true
      }

      const actualMove: Move | undefined = PgnUtils.getMoveFromString(board, 'O-O');

      TestUtils.checkMove(expectedMove, actualMove);
    });

    it('should return white long castle move for "O-O-O" in "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
      const expectedMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_C1,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_E1,
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
        from: Square.SQ_D3,
        to: Square.SQ_D5,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_D3,
          type: PieceType.QUEEN
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: Square.SQ_D5
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'Qxd5')).toEqual(expectedMove);
    });

    it('should return white knight capture move for "Nxd5" in "rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5');
      const expectedMove: Move = {
        from: Square.SQ_C3,
        to: Square.SQ_D5,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_C3,
          type: PieceType.KNIGHT
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: Square.SQ_D5
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'Nxd5')).toEqual(expectedMove);
    });

    it('should return white pawn capture move for "exd5" in "rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp1pp2/6p1/3p3p/4P3/2NQ4/PPPP1PPP/R1B1KBNR w KQkq - 0 5');
      const expectedMove: Move = {
        from: Square.SQ_E4,
        to: Square.SQ_D5,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_E4,
          type: PieceType.PAWN
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: Square.SQ_D5
        },
        isCheck: false,
        isEnPassant: false
      }

      expect(PgnUtils.getMoveFromString(board, 'exd5')).toEqual(expectedMove);
    });

    it('should return white en passant pawn capture move for "exf6" in "rnbqkbnr/ppppp1p1/7p/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppppp1p1/7p/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3');
      const expectedMove: Move = {
        from: Square.SQ_E5,
        to: Square.SQ_F6,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_E5,
          type: PieceType.PAWN
        },
        capturedPiece: {
          color: Color.BLACK,
          type: PieceType.PAWN,
          position: Square.SQ_F5
        },
        isCheck: false,
        isEnPassant: true
      }

      expect(PgnUtils.getMoveFromString(board, 'exf6')).toEqual(expectedMove);
    });

    it('should return correct knight move pawn if two knights could move to same square for "Nbc3" in "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 3"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/ppp2ppp/3p4/4p3/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 3');
      const expectedMove: Move = {
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_B1,
          type: PieceType.KNIGHT
        },
        isCheck: false
      }

      expect(PgnUtils.getMoveFromString(board, 'Nbc3')).toEqual(expectedMove);
    });

    it('should return correct queen promotion for "f1=Q" in "8/8/6KP/1p2k3/1P6/8/5p2/8 b - - 0 1"', () => {
      const board: Board = BoardUtils.loadBoardFromFen('8/8/6KP/1p2k3/1P6/8/5p2/8 b - - 0 1');
      const expectedMove: Move = {
        from: Square.SQ_F2,
        to: Square.SQ_F1,
        piece: {
          color: Color.BLACK,
          position: Square.SQ_F2,
          type: PieceType.PAWN
        },
        promotedPiece: {
          color: Color.BLACK,
          position: Square.SQ_F1,
          type: PieceType.QUEEN
        },
        isCheck: false
      }

      const actualMove = PgnUtils.getMoveFromString(board, 'f1=Q');
      expect(actualMove).toEqual(expectedMove);
    });
  });

  describe('extractMoveToPosition', () => {
    it('should return [column:5, row:4] for "e4"', () => {
      expect(PgnUtils.extractMoveToPosition('e4')).toEqual(Square.SQ_E4);
    });

    it('should return [column:5, row:2] for "e2"', () => {
      expect(PgnUtils.extractMoveToPosition('e2')).toEqual(Square.SQ_E2);
    });

    it('should return [column:5, row:4] for "Ne4"', () => {
      expect(PgnUtils.extractMoveToPosition('Ne4')).toEqual(Square.SQ_E4);
    });

    it('should return [column:5, row:4] for "Nxe4"', () => {
      expect(PgnUtils.extractMoveToPosition('Ne4')).toEqual(Square.SQ_E4);
    });

    it('should return [column:6, row:3] for "N1f3"', () => {
      expect(PgnUtils.extractMoveToPosition('N1f3')).toEqual(Square.SQ_F3);
    });

    it('should return [column:7, row:6] for "Bg6+"', () => {
      expect(PgnUtils.extractMoveToPosition('Bg6+')).toEqual(Square.SQ_G6);
    });

    it('should return [column:2, row:5] for "axb5"', () => {
      expect(PgnUtils.extractMoveToPosition('axb5')).toEqual(Square.SQ_B5);
    });

    it('should return undefined for "axa"', () => {
      expect(PgnUtils.extractMoveToPosition('axa')).toEqual(undefined);
    });

    it('should return [column:7, row:1] for white "O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O', Color.WHITE)).toEqual(Square.SQ_G1);
    });

    it('should return [column:3, row:1] for white "O-O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O-O', Color.WHITE)).toEqual(Square.SQ_C1);
    });

    it('should return [column:7, row:8] for black "O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O', Color.BLACK)).toEqual(Square.SQ_G8);
    });

    it('should return [column:3, row:8] for black "O-O-O"', () => {
      expect(PgnUtils.extractMoveToPosition('O-O-O', Color.BLACK)).toEqual(Square.SQ_C8);
    });
  });

  describe('extractMoveFromPosition', () => {
    it('should return [column:2] for "Nbc4"', () => {
      expect(PgnUtils.extractMoveFromPosition('Nbc4')).toEqual({ column: 2 });
    });

    it('should return [column:2] for "bc4"', () => {
      expect(PgnUtils.extractMoveFromPosition('bc4')).toEqual({ column: 2 });
    });

    it('should return [] for "c4"', () => {
      expect(PgnUtils.extractMoveFromPosition('c4')).toEqual({});
    });

    it('should return [row:1] for "R1c1"', () => {
      expect(PgnUtils.extractMoveFromPosition('R1c1')).toEqual({ row: 1 });
    });
  });

  describe('extractPgnFromMoves', () => {
    it('should return pgn for game one', () => {
      const moves: Move[] = PgnUtils.extractMovesFromPgn(gameOnePgn);
      const actualPgn = PgnUtils.extractPgnFromMoves(moves);
      expect(actualPgn)
        .withContext(`Expected ${JSON.stringify(actualPgn)}\nActual: ${JSON.stringify(gameOnePgn)}`)
        .toEqual(gameOnePgn);
    });
  });
});