import { Board, COLOR_WHITE, Position } from "src/app/types/board.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationQueenHandler } from "./move-generation.queen.handler";

describe('MoveGenerationQueenHandler', () => {
  let handler: MoveGenerationQueenHandler;
  beforeEach(async () => {
    handler = new MoveGenerationQueenHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, queenPosition: Position, expected: boolean) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: COLOR_WHITE };
        const isAttackingKing = handler.isAttackingKing(queen, board);

        expect(isAttackingKing).toBe(expected);
      });
    }

    isAttackingKing(
      'should return true if queen is attacking king from right',
      '8/8/8/k3Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return false if queen is not attacking king',
      '8/8/k7/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );

    isAttackingKing(
      'should return false if queen piece is blocking check horizontally',
      '8/8/8/kN2Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );

    isAttackingKing(
      'should return true if queen is attacking king from bottom right',
      '1k6/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if queen is attacking king from bottom left',
      '7k/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if queen is attacking king from top left',
      '8/8/8/4Q3/8/8/7k/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return true if queen is attacking king from top right',
      '8/8/8/4Q3/8/2k5/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return false if queen is not attacking king',
      '8/8/8/4Q3/1k6/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );

    isAttackingKing(
      'should return false if piece is blocking check diagonally',
      '1k6/2n5/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, queenPosition: Position, expectedBlockingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: COLOR_WHITE };
        const blockingSquares = PositionUtils.sortPositions(handler.getBlockingSquares(queen, board));

        expect(blockingSquares).toEqual(PositionUtils.sortPositions(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return empty array if queen is not attacking king',
      '8/8/k7/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );

    getBlockingSquares(
      'should return blocking squares if queen is attacking king from right',
      '8/8/8/k3Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 2, row: 5 }, { column: 3, row: 5 }, { column: 4, row: 5 }]
    );

    getBlockingSquares(
      'should return blocking squares if queen is attacking king from top',
      '8/8/8/4Q3/8/8/8/2K1k3 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 5, row: 2 }, { column: 5, row: 3 }, { column: 5, row: 4 }]
    );

    getBlockingSquares(
      'should return correct squares if queen is attacking king from bottom right',
      '1k6/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 3, row: 7 }, { column: 4, row: 6 }]
    );

    getBlockingSquares(
      'should return correct squares if queen is attacking king from bottom left',
      '7k/8/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 6, row: 6 }, { column: 7, row: 7 }]
    );

    getBlockingSquares(
      'should return squares even if piece is blocking check diagonally',
      '7k/6n1/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      [{ column: 6, row: 6 }, { column: 7, row: 7 }]
    );

    getBlockingSquares(
      'should return no squares if queen is not attacking king',
      '6k1/6n1/8/4Q3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );
  });

  describe('getAttackingSquares', () => {
    function getAttackingSquares(description: string, fen: string, queenPosition: Position, expectedAttackingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const queen: Piece = { type: PieceType.QUEEN, position: queenPosition, color: COLOR_WHITE };
        const attackingSquares = PositionUtils.sortPositions(handler.getAttackingSquares(queen, board));

        expect(attackingSquares).toEqual(PositionUtils.sortPositions(expectedAttackingSquares));
      });
    }

    getAttackingSquares(
      'should return correct squares if queen is not obstructed',
      '8/8/4k3/8/3Q4/8/8/4K3 w - - 0 1',
      { column: 4, row: 4 },
      [
        { column: 1, row: 1 }, 
        { column: 2, row: 2 }, 
        { column: 3, row: 3 }, 
        { column: 5, row: 5 }, 
        { column: 6, row: 6 }, 
        { column: 7, row: 7 }, 
        { column: 8, row: 8 },
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 },
        { column: 1, row: 4 },
        { column: 2, row: 4 },
        { column: 3, row: 4 },
        { column: 5, row: 4 },
        { column: 6, row: 4 },
        { column: 7, row: 4 },
        { column: 8, row: 4 },
        { column: 4, row: 1 },
        { column: 4, row: 2 },
        { column: 4, row: 3 },
        { column: 4, row: 5 },
        { column: 4, row: 6 },
        { column: 4, row: 7 },
        { column: 4, row: 8 }        
      ]
    );

    getAttackingSquares(
      'should ignore enemy king',
      '8/8/5k2/8/3Q4/8/8/4K3 w - - 0 1',
      { column: 4, row: 4 },
      [
        { column: 1, row: 1 }, 
        { column: 2, row: 2 }, 
        { column: 3, row: 3 }, 
        { column: 5, row: 5 }, 
        { column: 6, row: 6 }, 
        { column: 7, row: 7 }, 
        { column: 8, row: 8 },
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 },
        { column: 1, row: 4 },
        { column: 2, row: 4 },
        { column: 3, row: 4 },
        { column: 5, row: 4 },
        { column: 6, row: 4 },
        { column: 7, row: 4 },
        { column: 8, row: 4 },
        { column: 4, row: 1 },
        { column: 4, row: 2 },
        { column: 4, row: 3 },
        { column: 4, row: 5 },
        { column: 4, row: 6 },
        { column: 4, row: 7 },
        { column: 4, row: 8 }        
      ]
    );

    getAttackingSquares(
      'should not ignore blocking enemy piece',
      '8/6k1/5n2/8/3Q4/8/8/4K3 w - - 0 1',
      { column: 4, row: 4 },
      [
        { column: 1, row: 1 }, 
        { column: 2, row: 2 }, 
        { column: 3, row: 3 }, 
        { column: 5, row: 5 }, 
        { column: 6, row: 6 }, 
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 },
        { column: 1, row: 4 },
        { column: 2, row: 4 },
        { column: 3, row: 4 },
        { column: 5, row: 4 },
        { column: 6, row: 4 },
        { column: 7, row: 4 },
        { column: 8, row: 4 },
        { column: 4, row: 1 },
        { column: 4, row: 2 },
        { column: 4, row: 3 },
        { column: 4, row: 5 },
        { column: 4, row: 6 },
        { column: 4, row: 7 },
        { column: 4, row: 8 }        
      ]
    );
  });
});