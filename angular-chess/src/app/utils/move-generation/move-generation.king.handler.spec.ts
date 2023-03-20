import { Board, Color, Position } from "src/app/types/board.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PositionUtils from "../position.utils";
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
    function getAttackingSquares(description: string, fen: string, kingPosition: Position, expectedAttackingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const king: Piece = { type: PieceType.KING, position: kingPosition, color: Color.WHITE };

        const actualSquares = handler.getAttackingSquares(king, board).sort(PositionUtils.comparePositions());
        const expectedSquares = expectedAttackingSquares.sort(PositionUtils.comparePositions());
        expect(actualSquares).toEqual(expectedSquares);
      });
    }

    getAttackingSquares(
      'should return all squares around king',
      '3k4/8/8/4K3/8/8/8/8 w - - 0 1',
      { column: 5, row: 5 },
      [
        { column: 4, row: 4 },
        { column: 5, row: 4 },
        { column: 6, row: 4 },
        { column: 4, row: 5 },
        { column: 6, row: 5 },
        { column: 4, row: 6 },
        { column: 5, row: 6 },
        { column: 6, row: 6 },
      ]
    );

    getAttackingSquares(
      'should return all squares around king that are on the board',
      '3k4/8/8/8/8/8/8/K7 w - - 0 1',
      { column: 1, row: 1 },
      [
        { column: 1, row: 2 },
        { column: 2, row: 1 },
        { column: 2, row: 2 },
      ]
    );
  });
});