import { Board } from "src/app/types/board.t";
import { Color, Square } from "src/app/types/compressed.types.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationPawnHandler } from "./move-generation.pawn.handler";

describe('MoveGenerationPawnHandler', () => {
  let handler: MoveGenerationPawnHandler;
  beforeEach(async () => {
    handler = new MoveGenerationPawnHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, pawnPosition: Square, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(pawn, board);

        expect(isAttackingKing).withContext(`Expected ${isAttackingKing} to be ${expected}. Board: ${JSON.stringify(board)}, pawn: ${JSON.stringify(pawn)}`).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if pawn is attacking king from left',
      '8/8/5k2/4P3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if pawn is attacking king from left',
      '8/8/3k4/4P3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return false if pawn is not attacking king',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, pawnPosition: Square, expectedBlockingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: Color.WHITE };
        const blockingSquares = SquareUtils.sortSquares(handler.getBlockingSquares(pawn, board));

        expect(blockingSquares).toEqual(SquareUtils.sortSquares(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return no squares if pawn is not attacking king',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );

    getBlockingSquares(
      'should return no squares if pawn is attacking king',
      '8/8/5k2/4P3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, pawnPosition: Square, expectedAttackingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: Color.WHITE };
        const actual = handler.getAttackingSquares(pawn, board).sort(SquareUtils.compareSquares());
        const expected = expectedAttackingSquares.sort(SquareUtils.compareSquares());

        expect(actual).withContext(`Expected ${actual} to be ${expected}. Board: ${JSON.stringify(board)}, pawn: ${JSON.stringify(pawn)}`).toEqual(expected);
      });
    }

    getAttackingSquares(
      'should return upper left and upper right squares',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_D6,
        Square.SQ_F6
      ]
    );

    getAttackingSquares(
      'should return only attacked squares on the board',
      '8/8/4k3/P7/8/8/8/2K5 w - - 0 1',
      Square.SQ_A5,
      [
        Square.SQ_B6
      ]
    );
  });

  describe('getCaptureCandidates', () => {
    function getCaptureCandidates(description: string, color: Color, position: Square, expectedCaptureCandidates: Square[]) {
      it(description, () => {
        const pawn: Piece = { type: PieceType.PAWN, position: position, color };
        const actual = MoveGenerationPawnHandler.getCaptureCandidates(pawn).sort(SquareUtils.compareSquares());
        const expected = expectedCaptureCandidates.sort(SquareUtils.compareSquares());

        expect(actual).withContext(`Expected ${actual} to be ${expected}.`).toEqual(expected);
      });
    }

    getCaptureCandidates(
      'should return upper left and upper right squares for white pawn',
      Color.WHITE,
      Square.SQ_E5,
      [
        Square.SQ_D6,
        Square.SQ_F6
      ]
    );

    getCaptureCandidates(
      'should return lower left and lower right squares for black pawn',
      Color.BLACK,
      Square.SQ_E5,
      [
        Square.SQ_D4,
        Square.SQ_F4
      ]
    );
  });

  describe('getMoves', () => {
    function getMoves(description: string, fen: string, color: Color, pawnPosition: Square, expectedMoves: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const pawn: Piece = { type: PieceType.PAWN, position: pawnPosition, color: color };

        const actual = handler.getMoves(pawn, board).map(m => m.to).sort(SquareUtils.compareSquares());
        const expected = expectedMoves.sort(SquareUtils.compareSquares());
        expect(actual).withContext(`Expected ${actual} to be ${expected}. Pawn position: ${JSON.stringify(pawn)}, Board: ${JSON.stringify(board)}`).toEqual(expected);
      });
    }

    getMoves(
      'should return no squares if white pawn is blocked',
      '8/8/4k3/4P3/8/8/8/2K5 w - - 0 1',
      Color.WHITE,
      Square.SQ_E5,
      []
    );

    getMoves(
      'should return no squares if black pawn is blocked',
      '8/8/4k3/8/4p3/4K3/8/8 b - - 0 1',
      Color.BLACK,
      Square.SQ_E5,
      []
    );

    getMoves(
      'should return two north squares for white pawn in starting position',
      '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1',
      Color.WHITE,
      Square.SQ_E2,
      [
        Square.SQ_E3,
        Square.SQ_E4,
      ]
    );

    getMoves(
      'should return promotion squares for white pawn',
      'k7/4P3/8/8/8/8/8/4K3 w - - 0 1',
      Color.WHITE,
      Square.SQ_E7,
      [
        Square.SQ_E8
      ]
    );

    getMoves(
      'should return promotion squares for black pawn',
      'k7/8/8/8/8/8/4p3/1K6 b - - 0 1',
      Color.BLACK,
      Square.SQ_E2,
      [
        Square.SQ_E1
      ]
    );
  });
});