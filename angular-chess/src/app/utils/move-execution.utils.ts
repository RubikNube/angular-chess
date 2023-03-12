import { BoardBuilder } from "../builders/board.builder";
import { Board, Color, Result } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import PositionUtils from "./position.utils";

export default class MoveExecutionUtils {
  public static executeMove(move: Move, board: Board): Move | undefined {
    console.log("executeMove: " + JSON.stringify(move));

    const boardBuilder: BoardBuilder = new BoardBuilder(board);

    if (move.piece.color !== board.playerToMove) {
      console.warn("Not the right player to move. Ignore move.")
      return undefined;
    }

    if (move.piece.type === PieceType.KING && this.executeKingCastle(move, boardBuilder)) {
      return move;
    }

    if (move.capturedPiece === undefined) { // move
      if (move.piece.type === PieceType.PAWN) {
        if (move.piece.color === Color.WHITE && move.to.row === 4) {
          boardBuilder.enPassantSquare({ row: 3, column: move.from.column });

          return this.finishMove(move, boardBuilder);
        }
        else if (move.piece.color === Color.BLACK && move.to.row === 5) {
          boardBuilder.enPassantSquare({ row: 6, column: move.from.column });

          return this.finishMove(move, boardBuilder);
        }
      }

      boardBuilder.movePiece(move);
    }
    else { // capture
      boardBuilder.capturePiece(move);
    }

    return this.finishMove(move, boardBuilder);
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
      move.isMate = BoardUtils.isMate(boardBuilder.build());

      if (move.isMate) {
        boardBuilder.result(move.piece.color === Color.WHITE ? Result.WHITE_WIN : Result.BLACK_WIN);
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
    console.log("executeLongCastle: " + JSON.stringify(move));

    const pieceOnSide = PositionUtils.getPieceOnPos(boardBuilder.build(), { column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      boardBuilder.movePiece(move)
        .movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });
    }
  }

  private static executeShortCastle(move: Move, boardBuilder: BoardBuilder): void {
    console.log("executeShortCastle: " + JSON.stringify(move));
    const pieceOnSide = PositionUtils.getPieceOnPos(boardBuilder.build(), { column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      boardBuilder.movePiece(move).movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });
    }
  }
}