import { Board, Color, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationBishopHandler } from "./move-generation.bishop.handler";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationKingHandler } from "./move-generation.king.handler";
import { MoveGenerationKnightHandler } from "./move-generation.knight.handler";
import { MoveGenerationPawnHandler } from "./move-generation.pawn.handler";
import { MoveGenerationQueenHandler } from "./move-generation.queen.handler";
import { MoveGenerationRookHandler } from "./move-generation.rook.handler";

export default class MoveGenerationUtils {
  static generationHandlers: MoveGenerationHandler[] = [
    new MoveGenerationRookHandler(),
    new MoveGenerationKnightHandler(),
    new MoveGenerationPawnHandler(),
    new MoveGenerationBishopHandler(),
    new MoveGenerationQueenHandler(),
    new MoveGenerationKingHandler()
  ]

  public static isCheck(board: Board, move: Move): boolean {
    let validCaptures = this.getValidCaptures(board, {
      type: move.promotedPiece ? move.promotedPiece.type : move.piece.type,
      color: move.piece.color,
      position: move.to
    }, true);

    return validCaptures.find(c => c.capturedPiece?.type === PieceType.KING) !== undefined;
  }

  public static getExecutableMoves(board: Board, dropPos: Position, color: Color): Move[] {
    const pieces: Piece[] = board.pieces.filter(p => p.color === color);

    const moves: Move[] = [];

    for (let piece of pieces) {
      const movesOfPiece = this.getExecutableMove(board, piece, dropPos);
      if (movesOfPiece) {
        moves.push(movesOfPiece);
      }
    }

    return moves;
  }

  public static getExecutableMove(board: Board, piece: Piece, dropPos: Position): Move | undefined {
    let move = this.getValidMoves(board, piece, true).find(m => PositionUtils.positionEquals(m.to, dropPos));
    if (move !== undefined) {
      return move;
    }
    else {
      return this.getValidCaptures(board, piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    }
  }

  public static getValidMoves(board: Board, piece: Piece, shouldCalculateCheck: boolean): Move[] {
    let moves: Move[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      moves = matchingHandler.getMoves(piece, board);
    }

    return moves
      .filter(m => PositionUtils.isOnBoard(m.to))
      .filter(m => PositionUtils.isFree(board, m.to))
      .map(m => {
        if (shouldCalculateCheck) {
          m.isCheck = this.isCheck(board, m);
        }
        return m;
      });
  }

  public static getValidCaptures(board: Board, piece: Piece, dontSearchForCheck?: boolean): Move[] {
    let captureMoves: Move[] = [];

    const matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      captureMoves = matchingHandler.getCaptures(piece, board);
    }
    else {
      console.log("getValidMoves: found no matching handler")
    }

    return captureMoves
      .filter(m => this.isOppositeColoredPieceOnPos(board, m.to, piece.color) || m.isEnPassant)
      .map(m => {
        m.piece.position = piece.position;

        if (!m.isEnPassant) {
          m.capturedPiece = PositionUtils.getPieceOnPos(board, m.to);
        } else {
          let capturedPiecePos: Position = {
            row: m.piece.color === Color.WHITE ? m.to.row - 1 : m.to.row + 1,
            column: m.to.column
          }

          m.capturedPiece = PositionUtils.getPieceOnPos(board, capturedPiecePos);

        }

        if (!dontSearchForCheck) {
          m.isCheck = this.isCheck(board, m);
        }
        return m;
      });
  }

  private static isOppositeColoredPieceOnPos(board: Board, position: Position, color: Color): boolean {
    const pieceOnPos = PositionUtils.getPieceOnPos(board, position);
    return pieceOnPos ? pieceOnPos.color !== color : false;
  }
}