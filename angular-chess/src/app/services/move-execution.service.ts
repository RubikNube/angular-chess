import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, throwIfEmpty } from 'rxjs';
import { Board, Color, Position } from '../types/board.t';
import { FullMove, Move, PieceType } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import MoveHistoryUtils from '../utils/move.history.utils';
import PieceUtils from '../utils/piece.utils';
import PositionUtils from '../utils/position.utils';
import { ChessBoardService } from './chess-board.service';
import { MoveGenerationService } from './move-generation.service';
import { MoveHistoryService } from './move-history.service';

@Injectable({
  providedIn: 'root'
})
export class MoveExecutionService {
  attackedSquaresFromBlack: Position[] = [];
  attackedSquaresFromWhite: Position[] = [];

  constructor(public boardService: ChessBoardService,
    public moveGenerationService: MoveGenerationService,
    public moveHistoryService: MoveHistoryService) {
    this.moveHistoryService.getMoveHistory$().subscribe(moveHistory => {
      console.log("getMoveHistory: " + moveHistory.length);
      let board = boardService.getBoard();
      boardService.setAttackedSquaresFromBlack(BoardUtils.calculateAttackedSquares(moveGenerationService, board, Color.BLACK));
      boardService.setAttackedSquaresFromWhite(BoardUtils.calculateAttackedSquares(moveGenerationService, board, Color.WHITE));
    })
  }

  public getAttackedSquares(colorOfPieces: Color): Position[] {
    return colorOfPieces === Color.WHITE ? this.attackedSquaresFromWhite : this.attackedSquaresFromBlack;
  }

  public executeMove(move: Move) {
    console.log("executeMove: " + JSON.stringify(move));

    if (move.piece.color !== this.boardService.getPlayerToMove()) {
      console.warn("Not the right player to move. Ignore move.")
      return;
    }

    if (move.piece.type === PieceType.KING) {
      this.boardService.setCastleRights({ player: move.piece.color, canShortCastle: false, canLongCastle: false })

      // kingside castle
      if (move.isShortCastle) {
        this.executeShortCastle(move);
        this.finishMove(move);
        return;
      }

      // queenside castle
      if (move.isLongCastle) {
        this.executeLongCastle(move);
        this.finishMove(move);
        return;
      }
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

  isMate(move: Move): boolean {
    let opposedColor: Color = PieceUtils.getOpposedColor(move.piece.color);
    let opposedKing = this.boardService.getKing(PieceUtils.getOpposedColor(move.piece.color));
    let currentBoard: Board = this.boardService.getBoard();

    let validMoves = this.moveGenerationService.getValidMoves(currentBoard, opposedKing);
    let hasKingEscapeSquares = this.moveGenerationService.getValidMoves(currentBoard, opposedKing).length > 0;

    console.log("isMate: " + JSON.stringify(move) + ", hasKingEscapeSquares: " + hasKingEscapeSquares + ", validMoves: " + JSON.stringify(validMoves));

    if (hasKingEscapeSquares) {
      return false;
    }
    else {
      // check if piece can be captured
      let attackedSquares = this.boardService.getAttackedSquares(opposedColor);

      if (PositionUtils.includes(attackedSquares, move.piece.position)) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  private finishMove(move: Move) {
    if (!(move.isShortCastle || move.isLongCastle)) {
      this.movePiece(move);
    }

    this.boardService.togglePlayerToMove();

    this.moveHistoryService.addMoveToHistory(move);

    if (move.isCheck) {
      move.isMate = this.isMate(move);
    }

    if (!(move.piece.type === PieceType.PAWN && Math.abs(move.from.row - move.to.row) === 2)) {
      this.boardService.clearEnPassantSquares();
    }
  }

  private capturePiece(move: Move) {
    console.log("capturePiece: " + JSON.stringify(move));
    this.boardService.removePiece(move.piece);

    if (move.capturedPiece !== undefined) {
      this.boardService.removePiece(move.capturedPiece);
    }
    move.piece.position = move.to;
    this.boardService.addPiece(move.piece);
  }

  private movePiece(move: Move) {
    console.log("movePiece: " + JSON.stringify(move));
    this.boardService.removePiece(move.piece);
    move.piece.position = move.to;
    this.boardService.addPiece(move.piece);
  }

  private unmovePiece(move: Move) {
    console.log("movePiece: " + JSON.stringify(move));
    this.boardService.removePiece(move.piece);
    move.piece.position = move.from;
    this.boardService.addPiece(move.piece);
  }

  private executeLongCastle(move: Move) {
    console.log("executeLongCastle: " + JSON.stringify(move));
    let currentBoard = this.boardService.getBoard();
    let pieceOnSide = PositionUtils.getPieceOnPos(currentBoard, { column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });
    }
  }

  private executeShortCastle(move: Move) {
    console.log("executeShortCastle: " + JSON.stringify(move));
    let currentBoard = this.boardService.getBoard();
    let pieceOnSide = PositionUtils.getPieceOnPos(currentBoard, { column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });
    }
  }
}
