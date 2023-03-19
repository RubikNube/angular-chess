import { Board, Color, Position } from "src/app/types/board.t";
import { Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationKnightHandler } from "./move-generation.knight.handler";

describe('MoveGenerationKnightHandler', () => {
  let handler: MoveGenerationKnightHandler;
  beforeEach(async () => {
    handler = new MoveGenerationKnightHandler();
  });

  describe('isAttackingKing', () => {
    function isAttackingKing(description: string, fen: string, knightPosition: Position, expected: boolean) {
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
      { column: 5, row: 5 },
      true
    );

    isAttackingKing(
      'should return false if knight is not attacking king',
      '8/6k1/8/4N3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      false
    );
  });

  describe('getBlockingSquares', () => {
    function getBlockingSquares(description: string, fen: string, knightPosition: Position, expectedBlockingSquares: Position[]) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const knight: Piece = { type: PieceType.KNIGHT, position: knightPosition, color: Color.WHITE };
        const blockingSquares = PositionUtils.sortPositions(handler.getBlockingSquares(knight, board));

        expect(blockingSquares).toEqual(PositionUtils.sortPositions(expectedBlockingSquares));
      });
    }

    getBlockingSquares(
      'should return empty array if knight is not attacking king',
      '8/6k1/8/4N3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );

    getBlockingSquares(
      'should return empty array if knight is attacking king',
      '8/8/6k1/4N3/8/8/8/2K5 w - - 0 1',
      { column: 5, row: 5 },
      []
    );
  });
});