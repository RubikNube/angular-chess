import { Board, COLOR_WHITE, Color } from "../types/board.t";
import BoardUtils from "./board.utils";
import MoveSearchUtils from "./move.search.utils";

describe('MoveSearchUtils', () => {
    describe('searchBestMove', () => {
        describe('performance tests', () => {
            it('should search for the best move in a given position in less than 1 second', () => {
                // Arrange
                const board: Board = BoardUtils.loadBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0');
                const depth = 4;
                const playerToMove = COLOR_WHITE;
                const alpha = Number.NEGATIVE_INFINITY;
                const beta = Number.POSITIVE_INFINITY;

                // Act
                const startTime = new Date().getTime();
                MoveSearchUtils.searchBestMove(board, depth, playerToMove, alpha, beta);
                const endTime = new Date().getTime();

                // Assert
                expect(endTime - startTime).toBeLessThan(1000);
            });
        });
    });
});