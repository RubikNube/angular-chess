import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Color, Position } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import PositionUtils from '../utils/position.utils';
import { ChessBoardService } from './chess-board.service';
import { MoveGenerationService } from './move-generation.service';

@Injectable({
  providedIn: 'root'
})
export class MoveExecutionService {

  moveHistorySource: BehaviorSubject<Move[]> = new BehaviorSubject<Move[]>([]);
  moveHistory$: Observable<Move[]> = this.moveHistorySource.asObservable();

  attackedSquaresFromBlack: Position[] = [];
  attackedSquaresFromWhite: Position[] = [];

  constructor(public boardService: ChessBoardService,
    public moveGenerationService: MoveGenerationService) {
    this.getMoveHistory$().subscribe(moveHistory => {
      console.log("getMoveHistory: " + moveHistory.length);
      boardService.setAttackedSquaresFromBlack(this.calculateAttackedSquares(Color.BLACK));
      boardService.setAttackedSquaresFromWhite(this.calculateAttackedSquares(Color.WHITE));
    })
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
            this.moveGenerationService.getValidMoves(p).map(m=>m.to).forEach(m => {
              attackedSquares.add(m);
            });
          }

          this.moveGenerationService.getValidCaptureSquares(p).forEach(m => {
            attackedSquares.add(m);
          });
        }
      });

    let result = Array.from(attackedSquares.values());

    console.log("calculateAttackedSquares color:" + colorOfPieces + ", result: " + JSON.stringify(result))

    return result;
  }

  public executeMove(move: Move) {
    let moveHistory = this.moveHistorySource.getValue();

    if (move.piece.color !== this.boardService.getPlayerToMove()) {
      console.warn("Not the right player to move. Ignore move.")
      return;
    }

    let validSquares: Position[] = this.moveGenerationService.getValidMoves(move.piece).map(m=>m.to);
    let getValidCaptures: Position[] = this.moveGenerationService.getValidCaptureSquares(move.piece);

    if (move.piece.type === PieceType.KING) {
      this.boardService.setCastleRights({ player: move.piece.color, canShortCastle: false, canLongCastle: false })

      // kingside castle
      if (move.isShortCastle) {
        this.executeShortCastle(move);
        return;
      }

      // queenside castle
      if (move.isLongCastle) {
        this.executeLongCastle(move);
        return;
      }
    }

    if (validSquares.find(p => PositionUtils.positionEquals(p, move.to))) {
      if (move.piece.type === PieceType.PAWN) {
        if (move.piece.color === Color.WHITE && move.to.row === 4) {
          this.boardService.setEnPassantSquares({ row: 3, column: move.from.column });

          this.movePiece(move);
          this.boardService.togglePlayerToMove();
          moveHistory.push(move);
          this.moveHistorySource.next(moveHistory);
          return;
        }
        else if (move.piece.color === Color.BLACK && move.to.row === 5) {
          this.boardService.setEnPassantSquares({ row: 6, column: move.from.column });

          this.movePiece(move);
          this.boardService.togglePlayerToMove();
          moveHistory.push(move);
          this.moveHistorySource.next(moveHistory);
          return;
        }
      }

      this.movePiece(move);
    }
    else if (getValidCaptures.find(p => PositionUtils.positionEquals(p, move.to))) {
      if (move.isEnPassant) {
        this.boardService.removePiece(move.piece);
        move.piece.position = move.to;
        this.boardService.addPiece(move.piece);

        let capturedPiecePos: Position = {
          row: move.piece.color === Color.WHITE ? move.to.row - 1 : move.to.row + 1,
          column: move.to.column
        }

        let pieceOnDropPos = this.boardService.getPieceOnPos(capturedPiecePos);
        if (pieceOnDropPos !== undefined) {
          move.capturedPiece = pieceOnDropPos;
          this.boardService.removePiece(pieceOnDropPos);
        }
      }
      else {
        this.capturePiece(move);
      }
    }
    else {
      console.warn("No capture or move possible! dropPos: " + JSON.stringify(move.to) + ", validSquares: " + JSON.stringify(validSquares))
      return;
    }

    this.boardService.clearEnPassantSquares();
    this.boardService.togglePlayerToMove();
    moveHistory.push(move);
    this.moveHistorySource.next(moveHistory);
  }

  private capturePiece(move: Move) {
    this.boardService.removePiece(move.piece);
    let pieceOnDropPos = this.boardService.getPieceOnPos(move.to);
    if (pieceOnDropPos !== undefined) {
      move.capturedPiece = pieceOnDropPos;
      this.boardService.removePiece(pieceOnDropPos);
    }
    move.piece.position = move.to;
    this.boardService.addPiece(move.piece);
  }

  private movePiece(move: Move) {
    this.boardService.removePiece(move.piece);
    move.piece.position = move.to;
    this.boardService.addPiece(move.piece);
  }

  private executeLongCastle(move: Move) {
    let pieceOnSide = this.boardService.getPieceOnPos({ column: 1, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 4 } });      

      this.boardService.togglePlayerToMove();
    }
  }

  private executeShortCastle(move: Move) {
    let pieceOnSide = this.boardService.getPieceOnPos({ column: 8, row: move.piece.position.row });

    if (pieceOnSide !== undefined) {
      this.movePiece(move);
      this.movePiece({ piece: pieceOnSide, from: pieceOnSide.position, to: { row: pieceOnSide.position.row, column: 6 } });

      this.boardService.togglePlayerToMove();
    }
  }

  public getMoveHistory$(): Observable<Move[]> {
    return this.moveHistory$;
  }
}
