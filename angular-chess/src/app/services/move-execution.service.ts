import { Injectable } from '@angular/core';
import { Color, Result } from '../types/board.t';
import { Move, PieceType } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import CopyUtils from '../utils/copy.utils';
import PositionUtils from '../utils/position.utils';
import { ChessBoardService } from './chess-board.service';
import { MoveGenerationService } from './move-generation.service';
import { MoveHistoryService } from './move-history.service';

@Injectable({
  providedIn: 'root'
})
export class MoveExecutionService {
  constructor(private boardService: ChessBoardService,
    private moveGenerationService: MoveGenerationService,
    private moveHistoryService: MoveHistoryService) {
    this.moveHistoryService.getMoveHistory$().subscribe(moveHistory => {
      console.log("getMoveHistory: " + moveHistory.length);
      let board = boardService.getBoard();
      boardService.setAttackedSquaresFromBlack(BoardUtils.calculateAttackedSquares(moveGenerationService, board, Color.BLACK));
      boardService.setAttackedSquaresFromWhite(BoardUtils.calculateAttackedSquares(moveGenerationService, board, Color.WHITE));
    })
  }

  public executeMove(move: Move): void {
    console.log("executeMove: " + JSON.stringify(move));

    move.board = CopyUtils.deepCopyElement(this.boardService.getBoard());
    if (move.piece.color !== this.boardService.getPlayerToMove()) {
      console.warn("Not the right player to move. Ignore move.")
      return;
    }

    if (move.piece.type === PieceType.KING && this.executeKingCastle(move)) {
      return;
    }

    if (move.capturedPiece === undefined) { // move
      if (move.piece.type === PieceType.PAWN) {
        if (move.piece.color === Color.WHITE && move.to.row === 4) {
          this.boardService.setEnPassantSquares({ row: 3, column: move.from.column });

          this.finishMove(move);
          return;
        }
        else if (move.piece.color === Color.BLACK && move.to.row === 5) {
          this.boardService.setEnPassantSquares({ row: 6, column: move.from.column });

          this.finishMove(move);
          return;
        }
      }

      this.movePiece(move);
    }
    else { // capture
      this.capturePiece(move);
    }

    this.finishMove(move);
  }

  private executeKingCastle(move: Move): boolean {
    this.boardService.setCastleRights({ player: move.piece.color, canShortCastle: false, canLongCastle: false })

    // kingside castle
    if (move.isShortCastle) {
      this.executeShortCastle(move);
      this.finishMove(move);
      return true;
    }

    // queenside castle
    if (move.isLongCastle) {
      this.executeLongCastle(move);
      this.finishMove(move);
      return true;
    }

    return false;
  }

  private finishMove(move: Move): void {
    if (!this.hasPawnGoneLongStep(move)) {
      this.boardService.clearEnPassantSquares();
    }

    if (!(this.isCastle(move))) {
      this.movePiece(move);
    }

    this.boardService.togglePlayerToMove();


    move.isCheck = this.moveGenerationService.isCheck(this.boardService.getBoard(), move);

    if (move.isCheck) {
      move.isMate = this.moveGenerationService.isMate(this.boardService.getBoard());

      if (move.isMate) {
        this.boardService.updateResult(move.piece.color === Color.WHITE ? Result.WHITE_WIN : Result.BLACK_WIN);
      }
    }

    this.moveHistoryService.addMoveToHistory(move);
  }

  private hasPawnGoneLongStep(move: Move): boolean {
    return move.piece.type === PieceType.PAWN && Math.abs(move.from.row - move.to.row) === 2;
  }

  private isCastle(move: Move): boolean | undefined {
    return move.isShortCastle || move.isLongCastle;
  }

  private capturePiece(move: Move): void {
    console.log("capturePiece: " + JSON.stringify(move));
    this.boardService.removePiece(move.piece);

    if (move.capturedPiece !== undefined) {
      this.boardService.removePiece(move.capturedPiece);
    }
    move.piece.position = move.to;
    this.boardService.addPiece(move.promotedPiece ? move.promotedPiece : move.piece);
  }

  private movePiece(move: Move): void {
    console.log("movePiece: " + JSON.stringify(move));
    this.boardService.removePiece(move.piece);
    move.piece.position = move.to;
    this.boardService.addPiece(move.promotedPiece ? move.promotedPiece : move.piece);
  }

  private executeLongCastle(move: Move): void {
    console.log("executeLongCastle: " + JSON.stringify(move));
    let currentBoard = this.boardService.getBoard();
    let pieceOnSide = PositionUtils.getPieceOnPos(currentBoard, { column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });
    }
  }

  private executeShortCastle(move: Move): void {
    console.log("executeShortCastle: " + JSON.stringify(move));
    let currentBoard = this.boardService.getBoard();
    let pieceOnSide = PositionUtils.getPieceOnPos(currentBoard, { column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });
    }
  }
}
