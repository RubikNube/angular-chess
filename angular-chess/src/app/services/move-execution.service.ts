import { Injectable } from '@angular/core';
import { BoardBuilder } from '../builders/board.builder';
import { Board, Color, HighlightColor, Result } from '../types/board.t';
import { Move, PieceType } from '../types/pieces.t';
import PositionUtils from '../utils/position.utils';
import { HighlightingService } from './highlighting.service';
import { MoveGenerationService } from './move-generation.service';
import { MoveHistoryService } from './move-history.service';

@Injectable({
  providedIn: 'root'
})
export class MoveExecutionService {
  constructor(
    private moveGenerationService: MoveGenerationService,
    private highlightingService: HighlightingService,
    private moveHistoryService: MoveHistoryService) {
  }

  public executeMove(move: Move, board: Board): Board | undefined {
    console.log("executeMove: " + JSON.stringify(move));

    const boardBuilder: BoardBuilder = new BoardBuilder(board);
    if (move.piece.color !== board.playerToMove) {
      console.warn("Not the right player to move. Ignore move.")
      return undefined;
    }

    if (move.piece.type === PieceType.KING && this.executeKingCastle(move, boardBuilder)) {
      return boardBuilder.build();
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

  private executeKingCastle(move: Move, boardBuilder: BoardBuilder): Board | undefined {

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

  private finishMove(move: Move, boardBuilder: BoardBuilder): Board | undefined {
    if (!this.hasPawnGoneLongStep(move)) {
      boardBuilder.clearEnPassantSquares();
    }

    if (!(this.isCastle(move))) {
      boardBuilder.movePiece(move);
    }

    boardBuilder.togglePlayerToMove();

    move.isCheck = this.moveGenerationService.isCheck(boardBuilder.build(), move);

    if (move.isCheck) {
      move.isMate = this.moveGenerationService.isMate(boardBuilder.build());

      if (move.isMate) {
        boardBuilder.result(move.piece.color === Color.WHITE ? Result.WHITE_WIN : Result.BLACK_WIN);
      }
    }

    this.moveHistoryService.addMoveToHistory(move);
    const squareFrom = { highlight: HighlightColor.BLUE, position: move.from };
    const squareTo = { highlight: HighlightColor.BLUE, position: move.to };
    this.highlightingService.addSquares(squareFrom, squareTo);

    return boardBuilder.build();
  }

  private hasPawnGoneLongStep(move: Move): boolean {
    return move.piece.type === PieceType.PAWN && Math.abs(move.from.row - move.to.row) === 2;
  }

  private isCastle(move: Move): boolean | undefined {
    return move.isShortCastle || move.isLongCastle;
  }

  private executeLongCastle(move: Move, boardBuilder: BoardBuilder): void {
    console.log("executeLongCastle: " + JSON.stringify(move));

    let pieceOnSide = PositionUtils.getPieceOnPos(boardBuilder.build(), { column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      boardBuilder.movePiece(move)
        .movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });
    }
  }

  private executeShortCastle(move: Move, boardBuilder: BoardBuilder): void {
    console.log("executeShortCastle: " + JSON.stringify(move));
    let pieceOnSide = PositionUtils.getPieceOnPos(boardBuilder.build(), { column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      boardBuilder.movePiece(move).movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });
    }
  }
}
