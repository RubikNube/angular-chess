import { Board, Color } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import EngineUtils from "./engine.utils";
import TestUtils from "./test.utils";

describe('EngineUtils', () => {

  describe('getEngineMove', () => {
    it('should find queen promotions', async () => {
      const board: Board = BoardUtils.loadBoardFromFen('k7/6P1/8/8/8/8/8/3K4 w - - 0 1');

      let pawn: Piece = { type: PieceType.PAWN, position: { column: 7, row: 7 }, color: Color.WHITE };

      const expectedMove: Move = { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN }, isCheck: true };

      const actualMove: Move | undefined = await EngineUtils.getEngineMove(board);
      expect(actualMove).toEqual(expectedMove);
    });
  });

  describe('getPossibleMoves', () => {
    const king: Piece = { color: Color.WHITE, type: PieceType.KING, position: { column: 4, row: 3 } };
    const blackBishop: Piece = { color: Color.BLACK, type: PieceType.BISHOP, position: { column: 6, row: 8 } };
    const pawn: Piece = { color: Color.WHITE, type: PieceType.PAWN, position: { column: 7, row: 7 } };
    const kingMoves: Move[] = [
      { piece: king, from: { column: 4, row: 3 }, to: { column: 3, row: 2 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 3, row: 3 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 3, row: 4 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 4, row: 2 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 4, row: 4 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 5, row: 2 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 5, row: 3 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 5, row: 4 }, isCheck: false }
    ];


    function getPossibleMoves(description: string, fen: string, color: Color, expectedMoves: Move[]): void {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);

        const actualPossibleMoves: Move[] = EngineUtils.getPossibleMoves(board, color)
          .sort(TestUtils.sortMoves);

        const expectedPossibleMoves = expectedMoves
          .sort(TestUtils.sortMoves);

        console.log('actualPossibleMoves', actualPossibleMoves);
        console.log('expectedPossibleMoves', expectedPossibleMoves);
        expect(actualPossibleMoves).toEqual(expectedPossibleMoves);
      });
    }

    getPossibleMoves('should return all possible moves for white king', "8/3k4/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves);

    getPossibleMoves('should return all possible pawn promotions and add checks', "3k4/6P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should return all possible pawn promotions and add mate', "3k4/2ppp1P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should not add mate flag if the check can be blocked', "3k4/2ppb1P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should add possible captures with promotion', "3k1b2/2pp2P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat(
      [
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
      ])
      .concat([
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.QUEEN }, capturedPiece: blackBishop },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.BISHOP }, capturedPiece: blackBishop },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.KNIGHT }, capturedPiece: blackBishop },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.ROOK }, capturedPiece: blackBishop },
      ]));
  });
});