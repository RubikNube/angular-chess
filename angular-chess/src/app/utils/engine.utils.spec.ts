import { Board, Color } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import EngineUtils, { MoveWithScore } from "./engine.utils";
import TestUtils from "./test.utils";

describe('EngineUtils', () => {

  describe('getEngineMove', () => {
    function getEngineMove(description: string, fen: string, expectedMove: MoveWithScore) {
      it(description, async () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);

        const actualMove: MoveWithScore | undefined = await EngineUtils.getEngineMove(board);
        expect(actualMove).toEqual(expectedMove);
      });
    }
    getEngineMove('should find white queen promotions',
      'k7/6P1/8/8/8/8/8/3K4 w - - 0 1',
      {
        piece: { type: PieceType.PAWN, position: { column: 7, row: 7 }, color: Color.WHITE },
        from: { column: 7, row: 7 },
        to: { column: 7, row: 8 },
        promotedPiece: {
          color: Color.WHITE,
          position: { column: 7, row: 8 },
          type: PieceType.QUEEN
        },
        isCheck: true, score: 9
      }
    );

    getEngineMove('should find black queen promotions',
      'k7/6P1/8/8/8/8/6p1/3K4 b - - 0 1',
      {
        piece: { type: PieceType.PAWN, position: { column: 7, row: 2 }, color: Color.BLACK },
        from: { column: 7, row: 2 },
        to: { column: 7, row: 1 },
        promotedPiece: {
          color: Color.BLACK,
          position: { column: 7, row: 1 },
          type: PieceType.QUEEN
        },
        isCheck: true, score: -8
      }
    );
  });

  describe('getPossibleMoves', () => {
    const king: Piece = { color: Color.WHITE, type: PieceType.KING, position: { column: 4, row: 3 } };
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

    const blackBishop: Piece = { color: Color.BLACK, type: PieceType.BISHOP, position: { column: 6, row: 8 } };
    const blackKing: Piece = { color: Color.BLACK, type: PieceType.KING, position: { column: 1, row: 8 } };
    const blackPawn: Piece = { color: Color.BLACK, type: PieceType.PAWN, position: { column: 7, row: 2 } };

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

    getPossibleMoves('should add possible moves for black promotion', "k7/6P1/8/8/8/8/6p1/3K4 b - - 0 1", Color.BLACK, [
      { piece: blackKing, from: { column: 1, row: 8 }, to: { column: 1, row: 7 }, isCheck: false },
      { piece: blackKing, from: { column: 1, row: 8 }, to: { column: 2, row: 7 }, isCheck: false },
      { piece: blackKing, from: { column: 1, row: 8 }, to: { column: 2, row: 8 }, isCheck: false },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: true, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.QUEEN } },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: false, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.BISHOP } },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: false, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.KNIGHT } },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: true, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.ROOK } },
    ]);
  });
});