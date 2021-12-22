import { Injectable } from '@angular/core';
import { Color, Position } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import { ChessBoardService } from './chess-board.service';
import { PositioningService } from './positioning.service';

@Injectable({
  providedIn: 'root'
})
export class MoveGenerationService {
  constructor(private boardService: ChessBoardService,
    private positioningService: PositioningService) { }

  getValidMoves(piece: Piece): Position[] {
    console.log("getValidMoves: " + JSON.stringify(piece));
    let fieldsToMove: Position[] = [];

    if (piece.type === PieceType.PAWN) {
      return this.getValidPawnMoves(piece);
    }

    return fieldsToMove;
  }

  private getValidPawnMoves(piece: Piece): Position[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));
    let fieldsToMove: Position[] = [];

    // normalize position white <-> black
    let normalizedPosition: Position = this.positioningService.getRelativePosition(piece.position, piece.color);

    console.log("getValidPawnMoves: normalizedPosition: " + JSON.stringify(normalizedPosition));


    this.addIfFree(fieldsToMove, this.positioningService.getAbsolutePosition({
      column: normalizedPosition.column,
      row: normalizedPosition.row + 1
    }, piece.color));

    if (normalizedPosition.row === 2) {
      this.addIfFree(fieldsToMove, this.positioningService.getAbsolutePosition({
        column: normalizedPosition.column,
        row: normalizedPosition.row + 2
      }, piece.color));
    }
    return fieldsToMove;
  }

  private addIfFree(fieldsToMove: Position[], fieldToMove: Position) {
    if (this.isFree(fieldToMove)) {
      fieldsToMove.push(fieldToMove);
    }
  }

  private isFree(position: Position): boolean {
    let result = this.boardService.getPieceOnPos(position) === undefined;
    console.log("isFree position:" + JSON.stringify(position) + ", result: " + result);
    return result;
  }
}
