import { Color } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import PgnUtils, { MoveGroup } from "./pgn.utils";

describe('PgnUtils', () => {
  const pgnToImport: string = `[Event "IBM Kasparov vs. Deep Blue Rematch"]\n
[Site "New York, NY USA"]\n
[Date "1997.05.11"]\n
[Round "6"]\n
[White "Deep Blue"]\n
[Black "Kasparov, Garry"]\n
[Opening "Caro-Kann: 4...Nd7"]\n
[ECO "B17"]\n
[Result "1-0"]\n
 
1.e4 c6 2.d4 d5 3.Nc3\n`;

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

  const positionC3 = { column: 3, row: 3 };
  const positionC7 = { column: 3, row: 7 };
  const positionC8 = { column: 3, row: 6 };

  const positionD2 = { column: 4, row: 2 };
  const positionD4 = { column: 4, row: 4 };

  const positionD7 = { column: 4, row: 7 };
  const positionD5 = { column: 4, row: 5 };

  const positionE2 = { column: 5, row: 2 };
  const positionE4 = { column: 5, row: 4 };

  const expectedMoves: Move[] = [{ piece: { type: PieceType.PAWN, color: Color.WHITE, position: positionE2 }, from: positionE2, to: positionE4 },
  { piece: { type: PieceType.PAWN, color: Color.BLACK, position: positionC7 }, from: positionE2, to: positionC8 },
  { piece: { type: PieceType.PAWN, color: Color.WHITE, position: positionD2 }, from: positionD2, to: positionD4 },
  { piece: { type: PieceType.PAWN, color: Color.BLACK, position: positionD7 }, from: positionD7, to: positionD5 },
  { piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: positionB1 }, from: positionB1, to: positionC3 }];


  // describe('extractMovesFromPgn', () => {
  //   it('should be able to extract pawn moves', () => {
  //     const expectedMoves: Move[] = [{ piece: { type: PieceType.PAWN, color: Color.WHITE, position: positionE2 }, from: positionE2, to: positionE4 },
  //     { piece: { type: PieceType.PAWN, color: Color.BLACK, position: positionC7 }, from: positionE2, to: positionC8 },
  //     { piece: { type: PieceType.PAWN, color: Color.WHITE, position: positionD2 }, from: positionD2, to: positionD4 },
  //     { piece: { type: PieceType.PAWN, color: Color.BLACK, position: positionD7 }, from: positionD7, to: positionD5 }
  //     ];

  //     expect(PgnUtils.extractMovesFromPgn(`1.e4 c6 2.d4 d5`)).toEqual(expectedMoves);
  //   });
  // });
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
});