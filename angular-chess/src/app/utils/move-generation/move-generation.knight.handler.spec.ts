import { Board } from "src/app/types/board.t";
import { Color, PieceType, Square } from "src/app/types/compressed.types.t";
import { Piece } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationKnightHandler } from "./move-generation.knight.handler";

describe('MoveGenerationKnightHandler', () => {
  let handler: MoveGenerationKnightHandler;
  beforeEach(async () => {
    handler = new MoveGenerationKnightHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, knightPosition: Square, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const knight: Piece = { type: PieceType.KNIGHT, position: knightPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(knight, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if knight is attacking king from bottom right',
      '8/8/6k1/4N3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return false if knight is not attacking king',
      '8/6k1/8/4N3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, knightPosition: Square, expectedBlockingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const knight: Piece = { type: PieceType.KNIGHT, position: knightPosition, color: Color.WHITE };
        const blockingSquares = SquareUtils.sortSquares(handler.getBlockingSquares(knight, board));

        expect(blockingSquares).toEqual(SquareUtils.sortSquares(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return empty array if knight is not attacking king',
      '8/6k1/8/4N3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );

    getBlockingSquares(
      'should return empty array if knight is attacking king',
      '8/8/6k1/4N3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, knightPosition: Square, expectedAttackingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const knight: Piece = { type: PieceType.KNIGHT, position: knightPosition, color: Color.WHITE };
        const actualSquares = handler.getAttackingSquares(knight, board).sort(SquareUtils.compareSquares());
        const expectedSquares = expectedAttackingSquares.sort(SquareUtils.compareSquares());

        expect(actualSquares).withContext(`Expected ${expectedSquares} but got ${actualSquares}.`).toEqual(expectedSquares);
      });
    }

    getAttackingSquares(
      'should return all squares where the knight can jump to',
      '8/6k1/8/4N3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [
        Square.SQ_C4,
        Square.SQ_C6,
        Square.SQ_D3,
        Square.SQ_D7,
        Square.SQ_F3,
        Square.SQ_F7,
        Square.SQ_G4,
        Square.SQ_G6
      ]
    );

    getAttackingSquares(
      'should return only the squares on the board where the knight can jump to',
      'N7/6k1/8/8/8/8/8/2K5 w - - 0 1',
      Square.SQ_A8,
      [
        Square.SQ_C7,
        Square.SQ_B6
      ]
    );
  });
});