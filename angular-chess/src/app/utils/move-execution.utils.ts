import { BoardBuilder } from "../builders/board.builder";
import { Board, Result } from "../types/board.t";
import { Color, Square } from "../types/compressed.types.t";
import { Move, PieceType } from "../types/pieces.t";
import CopyUtils from "./copy.utils";
import LoggingUtils, { LogLevel } from "./logging.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import SquareUtils from "./square.utils";

export default class MoveExecutionUtils {
  public static executeMove(move: Move, board: Board): Move | undefined {
    LoggingUtils.log(LogLevel.INFO, () => "executeMove: " + JSON.stringify(move));
    const copiedMove: Move = CopyUtils.deepCopyElement(move);
    const boardBuilder: BoardBuilder = new BoardBuilder(board);

    if (copiedMove.piece.color !== board.playerToMove) {
      LoggingUtils.log(LogLevel.WARN, () => "Not the right player to move. Ignore move.");
      return undefined;
    }

    if (copiedMove.piece.type === PieceType.KING && this.executeKingCastle(copiedMove, boardBuilder)) {
      return copiedMove;
    }

    if (copiedMove.capturedPiece === undefined) { // move
      if (copiedMove.piece.type === PieceType.PAWN) {
        if (copiedMove.piece.color === Color.WHITE && SquareUtils.rankOf(copiedMove.to) === 3) {
          boardBuilder.enPassantSquare(SquareUtils.convertPositionToSquare({ row: 3, column: SquareUtils.fileOf(copiedMove.from) + 1 }));

          return this.finishMove(copiedMove, boardBuilder);
        }
        else if (copiedMove.piece.color === Color.BLACK && SquareUtils.rankOf(copiedMove.to) === 4) {
          boardBuilder.enPassantSquare(SquareUtils.convertPositionToSquare({ row: 6, column: SquareUtils.fileOf(copiedMove.from) + 1 }));

          return this.finishMove(copiedMove, boardBuilder);
        }
      }

      boardBuilder.movePiece(copiedMove);
    }
    else { // capture
      boardBuilder.capturePiece(copiedMove);
    }

    return this.finishMove(copiedMove, boardBuilder);
  }

  private static executeKingCastle(move: Move, boardBuilder: BoardBuilder): Move | undefined {
    boardBuilder.setCastleRights({ player: move.piece.color, canShortCastle: false, canLongCastle: false })

    // kingside castle
    if (move.isShortCastle) {
      this.executeShortCastle(move, boardBuilder);
      return this.finishMove(move, boardBuilder);
    }

    // queenside castle
    if (move.isLongCastle) {
      this.executeLongCastle(move, boardBuilder);
      return this.finishMove(move, boardBuilder);
    }

    return undefined;
  }

  private static finishMove(move: Move, boardBuilder: BoardBuilder): Move | undefined {
    if (!this.hasPawnGoneLongStep(move)) {
      boardBuilder.clearEnPassantSquares();
    }

    if (!(this.isCastle(move))) {
      boardBuilder.movePiece(move);
    }

    boardBuilder.togglePlayerToMove();

    move.isCheck = MoveGenerationUtils.isCheck(boardBuilder.build(), move);

    if (move.isCheck) {
      move.isMate = MoveGenerationUtils.isMate(boardBuilder.build());

      if (move.isMate) {
        boardBuilder.result(move.piece.color === Color.WHITE ? Result.WHITE_WIN : Result.BLACK_WIN);
      }
    }

    move.boardAfterMove = boardBuilder.build();

    return move;
  }

  private static hasPawnGoneLongStep(move: Move): boolean {
    return move.piece.type === PieceType.PAWN && Math.abs(SquareUtils.rankOf(move.from) - SquareUtils.rankOf(move.to)) === 2;
  }

  private static isCastle(move: Move): boolean | undefined {
    return move.isShortCastle || move.isLongCastle;
  }

  private static executeLongCastle(move: Move, boardBuilder: BoardBuilder): void {
    LoggingUtils.log(LogLevel.INFO, () => "executeLongCastle: " + JSON.stringify(move));

    const westRook = SquareUtils.getPieceOnPos(boardBuilder.build(), SquareUtils.getRelativeSquare(Square.SQ_A1, move.piece.color));

    if (westRook !== undefined) {
      boardBuilder.movePiece(move)
        .movePiece({ piece: westRook, from: westRook.position, to: SquareUtils.getRelativeSquare(Square.SQ_C1, move.piece.color) });
    }
  }

  private static executeShortCastle(move: Move, boardBuilder: BoardBuilder): void {
    LoggingUtils.log(LogLevel.INFO, () => "executeShortCastle: " + JSON.stringify(move));
    const eastRook = SquareUtils.getPieceOnPos(boardBuilder.build(), SquareUtils.getRelativeSquare(Square.SQ_H1, move.piece.color));

    if (eastRook !== undefined) {
      boardBuilder.movePiece(move).movePiece({ piece: eastRook, from: eastRook.position, to: SquareUtils.getRelativeSquare(Square.SQ_F1, move.piece.color) });
    }
  }
}