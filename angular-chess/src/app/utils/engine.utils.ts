import { Board } from "../types/board.t";
import { Color, PieceType } from "../types/compressed.types.t";
import { Move, Piece } from "../types/pieces.t";
import CopyUtils from "./copy.utils";
import MoveExecutionUtils from "./move-execution.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import MoveSearchUtils from "./move.search.utils";
import SquareUtils from "./square.utils";

export type MoveWithScore = Move & { score?: number };

export default class EngineUtils {
  public static async getEngineMove(board: Board): Promise<Move | undefined> {
    return new Promise<Move | undefined>((resolve, reject) => {
      const bestMove: Move | undefined = MoveSearchUtils.searchBestMove(board, 3, board.playerToMove, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

      resolve(bestMove);
    });
  }

  public static getPossibleMoves(board: Board, playerToMove: Color): Move[] {
    let moves: Move[] = [];

    let piecesOfColor: Piece[] = board.pieces.filter(p => p.color === playerToMove);

    for (let piece of piecesOfColor) {
      moves.push(...MoveGenerationUtils.getValidMoves(board, piece, true));
      moves.push(...MoveGenerationUtils.getValidCaptures(board, piece, true));
    }

    // for every pawn move to the last row, add the promotion moves
    return moves.reduce((acc: Move[], move: Move) => acc.concat(this.getPromotionMoves(board, move)), []);
  }

  private static getPromotionMoves(board: Board, move: Move): Move[] {
    let promotionMoves: Move[] = [];

    if (move.piece.type === PieceType.PAWN
      && (move.piece.color === Color.WHITE && SquareUtils.rankOf(move.to) === 7 || move.piece.color === Color.BLACK && SquareUtils.rankOf(move.to) === 0)) {
      this.addPromotionMoves(board, move, promotionMoves);
    }
    else {
      promotionMoves.push(move);
    }

    return promotionMoves;
  }

  private static addPromotionMoves(board: Board, move: Move, promotionMoves: Move[]) {
    [PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT].forEach(type => {
      const copiedMove = CopyUtils.copyMove(move);
      copiedMove.promotedPiece = { type, color: copiedMove.piece.color, position: move.to };
      copiedMove.isCheck = MoveGenerationUtils.isCheck(board, copiedMove);
      const isMate = this.isMateAfterMove(board, copiedMove);
      if (isMate) {
        copiedMove.isMate = isMate;
      }
      promotionMoves.push(copiedMove);
    });
  }

  public static isMateAfterMove(board: Board, move: Move): boolean {
    // copy board
    const copiedBoard = CopyUtils.copyBoard(board);

    const executedMove = MoveExecutionUtils.executeMove(move, copiedBoard);
    // execute move
    const boardAfterMove = executedMove?.boardAfterMove;
    if (!boardAfterMove) {
      return false;
    }

    // get all pieces of current player
    const pieces: Piece[] = [...boardAfterMove.pieces].filter(p => p.color === boardAfterMove.playerToMove);

    // get all valid moves of current player
    let moves: Move[] = [];
    for (let piece of pieces) {
      moves = moves.concat(MoveGenerationUtils.getValidMoves(boardAfterMove, piece, false));
    }

    // get all the valid captures of current player
    for (let piece of pieces) {
      moves = moves.concat(MoveGenerationUtils.getValidCaptures(boardAfterMove, piece, false));
    }

    return moves.length === 0;
  }
}