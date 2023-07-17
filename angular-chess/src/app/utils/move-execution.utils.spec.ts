import { Board, COLOR_WHITE, Color } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveExecutionUtils from "./move-execution.utils";
import TestUtils from "./test.utils";

describe('MoveExecutionUtils', () => {

  describe('executeMove', () => {
    it('should be able to execute queen promotion', () => {
      const moveToExecute: Move = {
        from: { row: 7, column: 7 },
        to: { column: 7, row: 8, },
        piece: {
          color: COLOR_WHITE,
          position: { row: 7, column: 7 },
          type: PieceType.PAWN
        },
        promotedPiece: {
          color: COLOR_WHITE,
          position: { row: 7, column: 8 },
          type: PieceType.QUEEN
        },
        isCheck: false
      }

      const board: Board = BoardUtils.loadBoardFromFen('8/6P1/8/2k5/8/2K5/8/8 w - - 0 1');
      const executedMove: Move | undefined = MoveExecutionUtils.executeMove(moveToExecute, board);
      const expectedBoardAfterMove:Board=BoardUtils.loadBoardFromFen('6Q1/8/8/2k5/8/2K5/8/8 b - - 0 1');

      TestUtils.checkBoards(executedMove?.boardAfterMove, expectedBoardAfterMove);    
    });
  });
});