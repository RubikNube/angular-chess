import { Board } from "src/app/types/board.t";
import { Color, Square } from "src/app/types/compressed.types.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationKingHandler } from "./move-generation.king.handler";

describe('MoveGenerationKingHandler', () => {
  let handler: MoveGenerationKingHandler;
  beforeEach(async () => {
    handler = new MoveGenerationKingHandler();
  });

  describe('isAttackingKing', () => {
    it('should return false', () => {
      expect(handler.isAttackingKing()).toBe(false);
    });
  });

  describe('getBlockingSquares', () => {
    it('should return no squares', () => {
      expect(handler.getBlockingSquares()).toEqual([]);
    });
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, kingSquare: Square, expectedAttackingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const king: Piece = { type: PieceType.KING, position: kingSquare, color: Color.WHITE };

        const actualSquares = handler.getAttackingSquares(king, board).sort(SquareUtils.compareSquares());
        const expectedSquares = expectedAttackingSquares.sort(SquareUtils.compareSquares());
        expect(actualSquares).toEqual(expectedSquares);
      });
    }

    getAttackingSquares(
      'should return all squares around king',
      '3k4/8/8/4K3/8/8/8/8 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_D4,
        Square.SQ_E4,
        Square.SQ_F4,
        Square.SQ_D5,
        Square.SQ_F5,
        Square.SQ_D6,
        Square.SQ_E6,
        Square.SQ_F6,
      ]
    );

    getAttackingSquares(
      'should return all squares around king that are on the board',
      '3k4/8/8/8/8/8/8/K7 w - - 0 1',
      Square.SQ_A1,
      [
        Square.SQ_A2,
        Square.SQ_B1,
        Square.SQ_B2,
      ]
    );
  });

  describe('getMoves', () => {
    function getMoves(description: string, fen: string, kingSquare: Square, kingColor: Color, expectedMoves: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const king: Piece = { type: PieceType.KING, position: kingSquare, color: kingColor };

        const actual = handler.getMoves(king, board).map(m => m.to).sort(SquareUtils.compareSquares());
        const expected = expectedMoves.sort(SquareUtils.compareSquares());
        expect(actual).withContext(`Expected ${expected} but got ${actual}. King position: ${JSON.stringify(king)}, Board: ${JSON.stringify(board)}`).toEqual(expected);
      });
    }

    getMoves(
      'should return all surrounding squares',
      '3k4/8/8/4K3/8/8/8/8 w - - 0 1',
      Square.SQ_E5,
      Color.WHITE,
      [
        Square.SQ_D4, Square.SQ_E4, Square.SQ_F4,
        Square.SQ_D5, /* Square.SQ_F5, */ Square.SQ_F5,
        Square.SQ_D6, Square.SQ_E6, Square.SQ_F6,
      ]
    );

    getMoves(
      'should return all surrounding squares that are on the board',
      '3k4/8/8/8/8/8/8/K7 w - - 0 1',
      Square.SQ_A1,
      Color.WHITE,
      [
        Square.SQ_A2,
        Square.SQ_B1,
        Square.SQ_B2,
      ]
    );

    getMoves(
      'should return all surrounding squares that are on the board',
      '8/8/8/8/8/8/8/K7 w - - 0 1',
      Square.SQ_H1,
      Color.WHITE,
      [
        Square.SQ_G1,
        Square.SQ_G2,
        Square.SQ_H2,
      ]
    );

    getMoves(
      'should return all surrounding squares that are on the board',
      '8/8/8/8/8/8/k7/8 w - - 0 1',
      Square.SQ_H8,
      Color.WHITE,
      [
        Square.SQ_G8,
        Square.SQ_G7,
        Square.SQ_H7,
      ]
    );

    getMoves(
      'should return white long castle',
      '8/8/8/8/8/8/8/R3K3 w Q - 1 1',
      Square.SQ_E1,
      Color.WHITE,
      [
        Square.SQ_D1,/* Square.SQ_E1, */ Square.SQ_F1,
        Square.SQ_D2, Square.SQ_E2, Square.SQ_F2,
        Square.SQ_C1 // long castle
      ]
    );

    getMoves(
      'should return black long castle',
      'r3k3/8/8/8/8/8/8/R3K3 b Qq - 1 1',
      Square.SQ_E8,
      Color.BLACK,
      [
        Square.SQ_D8,/* Square.SQ_E8, */ Square.SQ_F8,
        Square.SQ_D7, Square.SQ_E7, Square.SQ_F7,
        Square.SQ_C8 // long castle
      ]
    );

    getMoves(
      'should return white short castle',
      '8/8/8/8/8/8/8/4K2R w K - 0 1',
      Square.SQ_E1,
      Color.WHITE,
      [
        Square.SQ_D1,/* Square.SQ_E1, */ Square.SQ_F1,
        Square.SQ_D2, Square.SQ_E2, Square.SQ_F2,
        Square.SQ_G1 // short castle
      ]
    );

    getMoves(
      'should return black short castle',
      '4k2r/8/8/8/8/8/8/4K2R b Kk - 0 1',
      Square.SQ_E8,
      Color.BLACK,
      [
        Square.SQ_D8,/* Square.SQ_E8, */ Square.SQ_F8,
        Square.SQ_D7, Square.SQ_E7, Square.SQ_F7,
        Square.SQ_G8 // short castle
      ]
    );
  });
});