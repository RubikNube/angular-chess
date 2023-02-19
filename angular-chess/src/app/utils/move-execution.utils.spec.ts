import { Board, Color } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import CopyUtils from "./copy.utils";
import MoveExecutionUtils from "./move-execution.utils";

describe('MoveExecutionUtils', () => {
  describe('executeMove', () => {
    it('should should be able to move "e4" in starting position.', () => {
      const boardBeforeMove: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0");
      const moveToExecute: Move = {
        from: { column: 4, row: 2 },
        to: { column: 4, row: 4 },
        piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 4, row: 2 } },
      }

      const boardAfterMove: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 0");
      const expectedExecutedMoveWithoutBoard: Move = {
        from: { column: 4, row: 2 },
        to: { column: 4, row: 4 },
        piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 4, row: 4 } },
        isCheck: false,
        boardAfterMove: undefined
      }

      const executedMove: Move | undefined = MoveExecutionUtils.executeMove(moveToExecute, boardBeforeMove);

      const executedMoveWithoutBoard: Move | undefined = CopyUtils.deepCopyElement(executedMove);
      executedMoveWithoutBoard!.boardAfterMove = undefined;

      expect(executedMoveWithoutBoard).toEqual(expectedExecutedMoveWithoutBoard);
      expect(executedMove?.boardAfterMove?.pieces.length).toEqual(32);
      const pawnAfterMove: Piece = {
        color: Color.WHITE, type: PieceType.PAWN, position: { column: 4, row: 4 }
      };
      expect(executedMove?.boardAfterMove?.pieces).toContain(pawnAfterMove);
    });
  });
});