import { Board } from "src/app/types/board.t";
import { Color, PieceType, Square } from "src/app/types/compressed.types.t";
import { Move, Piece } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import SquareUtils from "../square.utils";
import TestUtils from "../test.utils";
import { MoveGenerationQueenHandler } from "./move-generation.queen.handler";

describe('MoveGenerationQueenHandler', () => {
  let handler: MoveGenerationQueenHandler;
  beforeEach(async () => {
    handler = new MoveGenerationQueenHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, queenPosition: Square, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: Color.WHITE };
        const isAttackingKing = handler.isAttackingKing(queen, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if queen is attacking king from right',
      '8/8/8/k3Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return false if queen is not attacking king',
      '8/8/k7/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );

    isAttackingKing(
      'should return false if queen piece is blocking check horizontally',
      '8/8/8/kN2Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );

    isAttackingKing(
      'should return true if queen is attacking king from bottom right',
      '1k6/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if queen is attacking king from bottom left',
      '7k/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if queen is attacking king from top left',
      '8/8/8/4Q3/8/8/7k/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return true if queen is attacking king from top right',
      '8/8/8/4Q3/8/2k5/8/2K5 w - - 0 1',
      Square.SQ_E5,
      true
    );

    isAttackingKing(
      'should return false if queen is not attacking king',
      '8/8/8/4Q3/1k6/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );

    isAttackingKing(
      'should return false if piece is blocking check diagonally',
      '1k6/2n5/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, queenPosition: Square, expectedBlockingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: Color.WHITE };
        const blockingSquares = SquareUtils.sortSquares(handler.getBlockingSquares(queen, board));

        expect(blockingSquares).toEqual(SquareUtils.sortSquares(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return empty array if queen is not attacking king',
      '8/8/k7/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );

    getBlockingSquares(
      'should return blocking squares if queen is attacking king from right',
      '8/8/8/k3Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_B5, Square.SQ_C5, Square.SQ_D5]
    );

    getBlockingSquares(
      'should return blocking squares if queen is attacking king from top',
      '8/8/8/4Q3/8/8/8/2K1k3 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_E2, Square.SQ_E3, Square.SQ_E4]
    );

    getBlockingSquares(
      'should return correct squares if queen is attacking king from bottom right',
      '1k6/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_C7, Square.SQ_D6]
    );

    getBlockingSquares(
      'should return correct squares if queen is attacking king from bottom left',
      '7k/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_F6, Square.SQ_G7]
    );

    getBlockingSquares(
      'should return squares even if piece is blocking check diagonally',
      '7k/6n1/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      [Square.SQ_F6, Square.SQ_G7]
    );

    getBlockingSquares(
      'should return no squares if queen is not attacking king',
      '6k1/6n1/8/4Q3/8/8/8/2K5 w - - 0 1',
      Square.SQ_E5,
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, queenPosition: Square, expectedAttackingSquares: Square[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: Color.WHITE };
        const attackingSquares = SquareUtils.sortSquares(handler.getAttackingSquares(queen, board));

        expect(attackingSquares).toEqual(SquareUtils.sortSquares(expectedAttackingSquares));
      });
    }

    getAttackingSquares(
      'should return correct squares if queen is not obstructed',
      '8/8/4k3/8/3Q4/8/8/4K3 w - - 0 1',
      Square.SQ_D4,
      [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_E5,
        Square.SQ_F6,
        Square.SQ_G7,
        Square.SQ_H8,
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1,
        Square.SQ_A4,
        Square.SQ_B4,
        Square.SQ_C4,
        Square.SQ_E4,
        Square.SQ_F4,
        Square.SQ_G4,
        Square.SQ_H4,
        Square.SQ_D1,
        Square.SQ_D2,
        Square.SQ_D3,
        Square.SQ_D5,
        Square.SQ_D6,
        Square.SQ_D7,
        Square.SQ_D8
      ]
    );

    getAttackingSquares(
      'should ignore enemy king',
      '8/8/5k2/8/3Q4/8/8/4K3 w - - 0 1',
      Square.SQ_D4,
      [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_E5,
        Square.SQ_F6,
        Square.SQ_G7,
        Square.SQ_H8,
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1,
        Square.SQ_A4,
        Square.SQ_B4,
        Square.SQ_C4,
        Square.SQ_E4,
        Square.SQ_F4,
        Square.SQ_G4,
        Square.SQ_H4,
        Square.SQ_D1,
        Square.SQ_D2,
        Square.SQ_D3,
        Square.SQ_D5,
        Square.SQ_D6,
        Square.SQ_D7,
        Square.SQ_D8
      ]
    );

    getAttackingSquares(
      'should not ignore blocking enemy piece',
      '8/6k1/5n2/8/3Q4/8/8/4K3 w - - 0 1',
      Square.SQ_D4,
      [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_E5,
        Square.SQ_F6,
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1,
        Square.SQ_A4,
        Square.SQ_B4,
        Square.SQ_C4,
        Square.SQ_E4,
        Square.SQ_F4,
        Square.SQ_G4,
        Square.SQ_H4,
        Square.SQ_D1,
        Square.SQ_D2,
        Square.SQ_D3,
        Square.SQ_D5,
        Square.SQ_D6,
        Square.SQ_D7,
        Square.SQ_D8
      ]
    );
  });

  describe('getMoves', () => {
    function getMoves(description: string, fen: string, color: Color, queenPosition: Square, expectedMoves: Move[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: color };
        const moves = handler.getMoves(queen, board);

        TestUtils.checkMoves(expectedMoves, moves);
      });
    }

    getMoves(
      'should return all squares the queen can move to',
      '8/p4k1p/1p4p1/4Qp2/3P4/P4PK1/2r3PP/2q5 b - - 0 1',
      Color.BLACK,
      Square.SQ_C1,
      [
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_A1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_B1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_B2 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_D1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_D2 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_E1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_F1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_G1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_H1 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_E3 },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_F4, isCheck: true },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_G5, isCheck: true },
        { piece: { type: PieceType.QUEEN, position: Square.SQ_C1, color: Color.BLACK }, from: Square.SQ_C1, to: Square.SQ_H6 },
      ]
    );
  });
});