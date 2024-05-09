import { Board } from "../types/board.t";
import { Color, Square } from "../types/compressed.types.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveSearchUtils from "./move.search.utils";
import TestUtils from "./test.utils";

describe('MoveSearchUtils', () => {
  describe('searchBestMove', () => {
    function testFindMate(description: string, fen: string, expectedMove: Move) {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);
        const bestMove: Move | undefined = MoveSearchUtils.searchBestMove(board, 3, board.playerToMove, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

        TestUtils.checkMove(expectedMove, bestMove);
      });
    };

    testFindMate("mate in one for position rnb1r1k1/ppp2ppp/8/8/1P1q1n2/2NP1N2/1PPK2PP/R2Q1B1R b - - 4 13",
      "rnb1r1k1/ppp2ppp/8/8/1P1q1n2/2NP1N2/1PPK2PP/R2Q1B1R b - - 4 13",
      {
        from: Square.SQ_D4, to: Square.SQ_E3,
        piece: { type: PieceType.QUEEN, color: Color.BLACK, position: Square.SQ_D4 },
        isCheck: true
      });

    testFindMate("mate in two for position r3r2k/p1pR2R1/2N2p2/6p1/5nNn/P1P4P/1P3P2/6K1 b - - 6 30",
      "r3r2k/p1pR2R1/2N2p2/6p1/5nNn/P1P4P/1P3P2/6K1 b - - 6 30",
      {
        from: Square.SQ_H4, to: Square.SQ_F3,
        piece: { type: PieceType.KNIGHT, color: Color.BLACK, position: Square.SQ_H4 },
        isCheck: true
      });
  });
});
