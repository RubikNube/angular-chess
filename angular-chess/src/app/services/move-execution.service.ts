import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Color, Position } from '../types/board.t';
import { Move, PieceType } from '../types/pieces.t';
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
            this.moveGenerationService.getValidMoves(p).forEach(m => {
              attackedSquares.add(m);
            });
          }

          this.moveGenerationService.getValidCaptures(p).forEach(m => {
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

    let validSquares: Position[] = this.moveGenerationService.getValidMoves(move.piece);
    let getValidCaptures: Position[] = this.moveGenerationService.getValidCaptures(move.piece);

    if (validSquares.find(p => PositionUtils.positionEquals(p, move.to))) {
      this.boardService.removePiece(move.piece);
      move.piece.position = move.to;
      this.boardService.addPiece(move.piece);
    }
    else if (getValidCaptures.find(p => PositionUtils.positionEquals(p, move.to))) {
      this.boardService.removePiece(move.piece);
      let pieceOnDropPos = this.boardService.getPieceOnPos(move.to);
      if (pieceOnDropPos !== undefined) {
        move.capturedPiece = pieceOnDropPos;
        this.boardService.removePiece(pieceOnDropPos);
      }
      move.piece.position = move.to;
      this.boardService.addPiece(move.piece);
    }
    else {
      console.warn("No capture or move possible! dropPos: " + JSON.stringify(move.to) + ", validSquares: " + JSON.stringify(validSquares))
    }

    moveHistory.push(move);

    this.moveHistorySource.next(moveHistory);
  }

  public getMoveHistory$(): Observable<Move[]> {
    return this.moveHistory$;
  }
}
