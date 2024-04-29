import { Board } from "../types/board.t";
import { Color } from "../types/compressed.types.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveSearchUtils from "./move.search.utils";

describe('MoveSearchUtils', () => {
  describe('searchBestMove', () => {
    describe('should find mate in one', () => {
      it('for position rnb1r1k1/ppp2ppp/8/8/1P1q1n2/2NP1N2/1PPK2PP/R2Q1B1R b - - 4 13', () => {
        const board: Board = BoardUtils.loadBoardFromFen("rnb1r1k1/ppp2ppp/8/8/1P1q1n2/2NP1N2/1PPK2PP/R2Q1B1R b - - 4 13");
        const bestMove: Move | undefined = MoveSearchUtils.searchBestMove(board, 3, board.playerToMove, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        const expectedMove: Move = { from: { row: 4, column: 4 }, to: { row: 3, column: 5 }, piece: { type: PieceType.QUEEN, color: Color.BLACK, position: { row: 4, column: 4 } }, isCheck: true };
        expect(bestMove).toEqual(expectedMove);
      });
    });

    describe('should find mate in two', () => {
      it('for position r3r2k/p1pR2R1/2N2p2/6p1/5nNn/P1P4P/1P3P2/6K1 b - - 6 30', () => {
        const board: Board = BoardUtils.loadBoardFromFen("r3r2k/p1pR2R1/2N2p2/6p1/5nNn/P1P4P/1P3P2/6K1 b - - 6 30");
        const bestMove: Move | undefined = MoveSearchUtils.searchBestMove(board, 3, board.playerToMove, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        const expectedMove: Move = { from: { row: 4, column: 8 }, to: { row: 3, column: 6 }, piece: { type: PieceType.KNIGHT, color: Color.BLACK, position: { row: 4, column: 8 } }, isCheck: true };
        expect(bestMove).toEqual(expectedMove);
      });
    });

  });
});
