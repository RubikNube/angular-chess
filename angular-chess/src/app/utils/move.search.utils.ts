import { Board, Color } from "../types/board.t";
import { Move } from "../types/pieces.t";
import EngineUtils from "./engine.utils";
import EvaluationUtils from "./move-evaluation/evaltuation.utils";
import MoveExecutionUtils from "./move-execution.utils";

/**
 * Is used to search for the best move with the alpha-beta algorithm.
 */
export default class MoveSearchUtils {
    /**
     * Searches for the best move with the alpha-beta algorithm.
     * 
     * @param board the current board
     * @param depth the depth to search
     * @param playerToMove the player to move
     * @param alpha the alpha value
     * @param beta the beta value
     * @returns the best move
     */
    public static searchBestMove(board: Board, depth: number, playerToMove: Color, alpha: number, beta: number): Move | undefined {
        const possibleMoves: Move[] = EngineUtils.getPossibleMoves(board, playerToMove);
        let bestMove: Move | undefined;
        let bestScore: number = playerToMove === Color.WHITE ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    
        for (let move of possibleMoves) {
        const boardAfterMove = MoveExecutionUtils.executeMove(move, board)?.boardAfterMove;
        if (boardAfterMove) {
            const score: number = this.search(boardAfterMove, depth - 1, playerToMove === Color.WHITE ? Color.BLACK : Color.WHITE, alpha, beta);
            if (playerToMove === Color.WHITE && score > bestScore || playerToMove === Color.BLACK && score < bestScore) {
            bestScore = score;
            bestMove = move;
            }
            if (playerToMove === Color.WHITE && score > alpha) {
            alpha = score;
            }
            if (playerToMove === Color.BLACK && score < beta) {
            beta = score;
            }
            if (alpha >= beta) {
            break;
            }
        }
        }
        return bestMove;
    }

    /**
     * Searches for the best move with the alpha-beta algorithm.
     *  
     * @param board the current board
     * @param depth the depth to search
     * @param playerToMove the player to move
     * @param alpha the alpha value
     * @param beta the beta value
     * @returns the best score
     * */
    private static search(board: Board, depth: number, playerToMove: Color, alpha: number, beta: number): number {
        if (depth === 0) {
            return EvaluationUtils.evaluateBoard(board);
        }
        else {
            const possibleMoves: Move[] = EngineUtils.getPossibleMoves(board, playerToMove);
            let bestScore: number = playerToMove === Color.WHITE ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        
            for (let move of possibleMoves) {
            const boardAfterMove = MoveExecutionUtils.executeMove(move, board)?.boardAfterMove;
            if (boardAfterMove) {
                const score: number = this.search(boardAfterMove, depth - 1, playerToMove === Color.WHITE ? Color.BLACK : Color.WHITE, alpha, beta);
                if (playerToMove === Color.WHITE && score > bestScore || playerToMove === Color.BLACK && score < bestScore) {
                bestScore = score;
                }
                if (playerToMove === Color.WHITE && score > alpha) {
                alpha = score;
                }
                if (playerToMove === Color.BLACK && score < beta) {
                beta = score;
                }
                if (alpha >= beta) {
                break;
                }
            }
            }
            return bestScore;
        }
    }
}
