import { Board } from "src/app/types/board.t";
import { Color, Square } from "src/app/types/compressed.types.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationRookHandler } from "./move-generation.rook.handler";

describe('MoveGenerationRookHandler', () => {
  let handler: MoveGenerationRookHandler;
  beforeEach(async () => {
    handler = new MoveGenerationRookHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, rookPosition: Square, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(rook, board);

        expect(isAttackingKing).withContext(`Expected that ${JSON.stringify(rook)} is attacking king on ${JSON.stringify(board)}.`).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if rook is attacking king from right',
      '8/8/8/k3R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return false if rook is not attacking king',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );

    isAttackingKing(
      'should return false if rook piece is blocking check',
      '8/8/8/kN2R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, rookPosition: Square, expectedBlockingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const blockingSquares = SquareUtils.sortSquares(handler.getBlockingSquares(rook, board));

        expect(blockingSquares).toEqual(SquareUtils.sortSquares(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return empty array if rook is not attacking king',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );

    getBlockingSquares(
      'should return blocking squares if rook is attacking king from right',
      '8/8/8/k3R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_B5, Square.SQ_C5, Square.SQ_D5]
    );

    getBlockingSquares(
      'should return blocking squares if rook is attacking king from top',
      '8/8/8/4R3/8/8/8/2K1k3 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_E2, Square.SQ_E3, Square.SQ_E4]
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, rookPosition: Square, expectedAttackingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const actual = handler.getAttackingSquares(rook, board).sort(SquareUtils.compareSquares());
        const expected = expectedAttackingSquares.sort(SquareUtils.compareSquares());

        expect(actual)
          .withContext(`Expected ${expected} but got ${actual}. Rook: ${JSON.stringify(rook)}, Board: ${JSON.stringify(board)}`)
          .toEqual(expected);
      });
    }

    getAttackingSquares(
      'should return free squares where the rook can move',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_A5,
        Square.SQ_B5,
        Square.SQ_C5,
        Square.SQ_D5,
        Square.SQ_E1,
        Square.SQ_E2,
        Square.SQ_E3,
        Square.SQ_E4,
        Square.SQ_E6,
        Square.SQ_E7,
        Square.SQ_E8,
        Square.SQ_F5,
        Square.SQ_G5,
        Square.SQ_H5
      ]
    );

    getAttackingSquares(
      'should ignore the enemy king',
      '8/8/8/2k1R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_A5,
        Square.SQ_B5,
        Square.SQ_C5,
        Square.SQ_D5,
        Square.SQ_E1,
        Square.SQ_E2,
        Square.SQ_E3,
        Square.SQ_E4,
        Square.SQ_E6,
        Square.SQ_E7,
        Square.SQ_E8,
        Square.SQ_F5,
        Square.SQ_G5,
        Square.SQ_H5
      ]
    );

    getAttackingSquares(
      'should not ignore blocking pieces',
      '8/8/8/1kn1R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_C5,
        Square.SQ_D5,
        Square.SQ_E1,
        Square.SQ_E2,
        Square.SQ_E3,
        Square.SQ_E4,
        Square.SQ_E6,
        Square.SQ_E7,
        Square.SQ_E8,
        Square.SQ_F5,
        Square.SQ_G5,
        Square.SQ_H5
      ]
    );
  });

  describe('getOccupiedSquares', () => {
    function testGetOccupiedSquares(description: string, fen: string, rookPosition: Square, expectedOccupiedSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };
        const occupiedSquares = handler.getOccupiedSquares(board, rook);

        const actualSquares = occupiedSquares.sort(SquareUtils.compareSquares());
        const expectedSquares = expectedOccupiedSquares.sort(SquareUtils.compareSquares());
        expect(actualSquares).withContext(`Expected ${expectedSquares} but got ${actualSquares} on board ${JSON.stringify(board)}`).toEqual(expectedSquares);
      });
    }

    testGetOccupiedSquares(
      'should return the no occupied squares for a rook in the middle of an empty board',
      '8/8/8/4R3/8/8/8/8 w - - 0 1',
      Square.SQ_E5,
      []
    );

    testGetOccupiedSquares(
      'should return the correct occupied squares in the middle of the board',
      '8/8/8/4p3/p3R2p/8/8/4p3 w - - 0 1',
      Square.SQ_E4,
      [
        Square.SQ_A4,
        Square.SQ_E5,
        Square.SQ_H4,
        Square.SQ_E1
      ]
    );

    testGetOccupiedSquares(
      'should return no occupied squares if the rook is attacking nothing',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );
  });

  describe('getMoves', () => {
    function getMoves(description: string, fen: string, rookPosition: Square, expectedMoves: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const rook: Piece = { type: PieceType.ROOK, position: rookPosition, color: Color.WHITE };

        const actual = handler.getMoves(rook, board).map(m => m.to).sort(SquareUtils.compareSquares());
        const expected = expectedMoves.sort(SquareUtils.compareSquares());
        expect(actual).withContext(`Expected ${expected} but got ${actual}. Rook position: ${JSON.stringify(rook)}, Board: ${JSON.stringify(board)}`).toEqual(expected);
      });
    }

    getMoves(
      'should return all squares the rook can move to',
      '8/8/k7/4R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_E1,
        Square.SQ_E2,
        Square.SQ_E3,
        Square.SQ_E4,
        Square.SQ_E6,
        Square.SQ_E7,
        Square.SQ_E8,
        Square.SQ_A5,
        Square.SQ_B5,
        Square.SQ_C5,
        Square.SQ_D5,
        Square.SQ_F5,
        Square.SQ_G5,
        Square.SQ_H5
      ]
    );

    getMoves(
      'should return squares that are not blocked by an enemy piece',
      '8/8/8/1kn1R3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_E1,
        Square.SQ_E2,
        Square.SQ_E3,
        Square.SQ_E4,
        Square.SQ_E6,
        Square.SQ_E7,
        Square.SQ_E8,
        Square.SQ_D5,
        Square.SQ_F5,
        Square.SQ_G5,
        Square.SQ_H5
      ]
    );

    getMoves(
      'should generate rook moves when same colored rook is "pinning" it',
      'r4rk1/p1q2ppp/1p2pb2/2n5/2B5/2P1BQ1P/PP3PP1/R2R2K1 w - - 0 1',
      Square.SQ_D1,
      [
        Square.SQ_B1,
        Square.SQ_C1,
        Square.SQ_E1,
        Square.SQ_F1,
        Square.SQ_D2,
        Square.SQ_D3,
        Square.SQ_D4,
        Square.SQ_D5,
        Square.SQ_D6,
        Square.SQ_D7,
        Square.SQ_D8
      ]);
  });
});