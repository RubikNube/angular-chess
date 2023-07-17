import { BoardBuilder } from "../builders/board.builder";
import { Board, COLOR_BLACK, COLOR_WHITE, Color, Result } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import CopyUtils from "./copy.utils";
import LoggingUtils, { LogLevel } from "./logging.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import PositionUtils from "./position.utils";

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
        if (copiedMove.piece.color === COLOR_WHITE && copiedMove.to.row === 4) {
          boardBuilder.enPassantSquare({ row: 3, column: copiedMove.from.column });

          return this.finishMove(copiedMove, boardBuilder);
        }
        else if (copiedMove.piece.color === COLOR_BLACK && copiedMove.to.row === 5) {
          boardBuilder.enPassantSquare({ row: 6, column: copiedMove.from.column });

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
        boardBuilder.result(move.piece.color === COLOR_WHITE ? Result.WHITE_WIN : Result.BLACK_WIN);
      }
    }

    move.boardAfterMove = boardBuilder.build();

    return move;
  }

  private static hasPawnGoneLongStep(move: Move): boolean {
    return move.piece.type === PieceType.PAWN && Math.abs(move.from.row - move.to.row) === 2;
  }

  private static isCastle(move: Move): boolean | undefined {
    return move.isShortCastle || move.isLongCastle;
  }

  private static executeLongCastle(move: Move, boardBuilder: BoardBuilder): void {
    LoggingUtils.log(LogLevel.INFO, () => "executeLongCastle: " + JSON.stringify(move));

    const pieceOnSide = PositionUtils.getPieceOnPos(boardBuilder.build(), { column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      boardBuilder.movePiece(move)
        .movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });
    }
  }

  private static executeShortCastle(move: Move, boardBuilder: BoardBuilder): void {
    LoggingUtils.log(LogLevel.INFO, () => "executeShortCastle: " + JSON.stringify(move));
    const pieceOnSide = PositionUtils.getPieceOnPos(boardBuilder.build(), { column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      boardBuilder.movePiece(move).movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });
    }
  }
}