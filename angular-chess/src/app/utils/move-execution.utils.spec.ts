import { Board } from "../types/board.t";
import { Color, Square } from "../types/compressed.types.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveExecutionUtils from "./move-execution.utils";
import TestUtils from "./test.utils";

describe('MoveExecutionUtils', () => {

  describe('executeMove', () => {
    it('should be able to execute queen promotion', () => {
      const moveToExecute: Move = {
        from: Square.SQ_G7,
        to: Square.SQ_G8,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_G7,
          type: PieceType.PAWN
        },
        promotedPiece: {
          color: Color.WHITE,
          position: Square.SQ_H7,
          type: PieceType.QUEEN
        },
        isCheck: false
      }

      const board: Board = BoardUtils.loadBoardFromFen('8/6P1/8/2k5/8/2K5/8/8 w - - 0 1');
      const executedMove: Move | undefined = MoveExecutionUtils.executeMove(moveToExecute, board);
      const expectedBoardAfterMove: Board = BoardUtils.loadBoardFromFen('6Q1/8/8/2k5/8/2K5/8/8 b - - 0 1');

      TestUtils.checkBoards(executedMove?.boardAfterMove, expectedBoardAfterMove);
    });

    it('should be able to set en passant square b3', () => {
      const moveToExecute: Move = {
        from: Square.SQ_B2,
        to: Square.SQ_B4,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_B2,
          type: PieceType.PAWN
        },
        isCheck: false
      }

      const board: Board = BoardUtils.loadBoardFromFen('4k3/8/8/8/8/8/1P6/4K3 w - - 0 1');
      const executedMove: Move | undefined = MoveExecutionUtils.executeMove(moveToExecute, board);
      const expectedBoardAfterMove: Board = BoardUtils.loadBoardFromFen('4k3/8/8/8/1P6/8/8/4K3 b - b3 0 1');

      TestUtils.checkBoards(expectedBoardAfterMove, executedMove?.boardAfterMove);
    });

    it('should be able to set en passant square a3', () => {
      const moveToExecute: Move = {
        from: Square.SQ_A2,
        to: Square.SQ_A4,
        piece: {
          color: Color.WHITE,
          position: Square.SQ_A2,
          type: PieceType.PAWN
        },
        isCheck: false
      }

      const board: Board = BoardUtils.loadBoardFromFen('4k3/8/8/8/8/8/P7/4K3 w - - 0 1');
      const executedMove: Move | undefined = MoveExecutionUtils.executeMove(moveToExecute, board);
      const expectedBoardAfterMove: Board = BoardUtils.loadBoardFromFen('4k3/8/8/8/P7/8/8/4K3 b - a3 0 1');

      TestUtils.checkBoards(expectedBoardAfterMove, executedMove?.boardAfterMove);
    });
  });
});