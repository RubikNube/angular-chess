import { Color } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import PgnUtils from "./pgn.utils";

describe('PgnUtils', () => {
  const pgnToImport: string = `[Event "IBM Kasparov vs. Deep Blue Rematch"]
[Site "New York, NY USA"]
[Date "1997.05.11"]
[Round "6"]
[White "Deep Blue"]
[Black "Kasparov, Garry"]
[Opening "Caro-Kann: 4...Nd7"]
[ECO "B17"]
[Result "1-0"]
 
1.e4 c6 2.d4 d5`;

  const positionD2 = { column: 4, row: 2 };
  const positionD4 = { column: 4, row: 4 };

  const positionD7 = { column: 4, row: 7 };
  const positionD5 = { column: 4, row: 5 };

  const positionE2 = { column: 5, row: 2 };
  const positionE4 = { column: 5, row: 4 };

  const positionC7 = { column: 3, row: 7 };
  const positionC8 = { column: 3, row: 6 };
  const expextedMoves: Move[] = [{ piece: { type: PieceType.PAWN, color: Color.WHITE, position: positionE2 }, from: positionE2, to: positionE4 },
  { piece: { type: PieceType.PAWN, color: Color.BLACK, position: positionC7 }, from: positionE2, to: positionC8 },
  { piece: { type: PieceType.PAWN, color: Color.WHITE, position: positionD2 }, from: positionD2, to: positionD4 },
  { piece: { type: PieceType.PAWN, color: Color.BLACK, position: positionD7 }, from: positionD7, to: positionD5 }];


  describe('extractMovesFromPgn', () => {
    it('should be able to extract pawn moves', () => {
      expect(PgnUtils.extractMovesFromPgn(pgnToImport)).toEqual(expextedMoves);
    });
  });
});