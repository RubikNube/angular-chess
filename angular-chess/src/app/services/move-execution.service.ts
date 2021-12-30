import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, throwIfEmpty } from 'rxjs';
import { Color, Position } from '../types/board.t';
import { FullMove, Move, PieceType } from '../types/pieces.t';
import MoveHistoryUtils from '../utils/move.history.utils';
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
    public moveHistoryService:MoveHistoryService) {
    this.moveHistoryService.getMoveHistory$().subscribe(moveHistory => {
      console.log("getMoveHistory: " + moveHistory.length);
      boardService.setAttackedSquaresFromBlack(this.calculateAttackedSquares(Color.BLACK));
      boardService.setAttackedSquaresFromWhite(this.calculateAttackedSquares(Color.WHITE));
    })
  }

  getMoveCount(startingColor: Color, index: number): number {
    return 1;
  }

  public getAttackedSquares(colorOfPieces: Color): Position[] {
    return colorOfPieces === Color.WHITE ? this.attackedSquaresFromWhite : this.attackedSquaresFromBlack;
  }

  private calculateAttackedSquares(colorOfPieces: Color): Position[] {
    let attackedSquares: Set<Position> = new Set<Position>();

    this.boardService.getPieces()
      .filter(p => p.color === colorOfPieces)
      .forEach(p => {
        if (p.type === PieceType.KING) {
          this.moveGenerationService.getSurroundingSquares(p)
            .filter(p => PositionUtils.isOnBoard(p))
            .forEach(m => {
              attackedSquares.add(m);
            })
        }
        else {
          if (p.type !== PieceType.PAWN) {
            this.moveGenerationService.getValidMoves(p)
              .map(m => m.to).forEach(m => {
                attackedSquares.add(m);
              });
          }

          this.moveGenerationService.getValidCaptures(p)
            .map(m => m.to).forEach(m => {
              attackedSquares.add(m);
            });
        }
      });

    let result = Array.from(attackedSquares.values());

    console.log("calculateAttackedSquares color:" + colorOfPieces + ", result: " + JSON.stringify(result))

    return result;
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
      if (move.isEnPassant) {
        this.boardService.removePiece(move.piece);
        move.piece.position = move.to;
        this.boardService.addPiece(move.piece);

        if (move.capturedPiece !== undefined) {
          this.boardService.removePiece(move.capturedPiece);
        }
      }
      else {
        this.capturePiece(move);
      }
    }

    this.finishMove(move);
  }

  private finishMove(move: Move) {
    if (!(move.isShortCastle || move.isLongCastle)) {
      this.movePiece(move);
    }
    
    this.boardService.togglePlayerToMove();

    this.moveHistoryService.addMoveToHistory(move);
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

  private executeLongCastle(move: Move) {
    console.log("executeLongCastle: " + JSON.stringify(move));
    let pieceOnSide = this.boardService.getPieceOnPos({ column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });
    }
  }

  private executeShortCastle(move: Move) {
    console.log("executeShortCastle: " + JSON.stringify(move));
    let pieceOnSide = this.boardService.getPieceOnPos({ column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });
    }
  }
}
