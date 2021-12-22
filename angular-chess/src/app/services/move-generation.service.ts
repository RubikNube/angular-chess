import { Injectable } from '@angular/core';
import { Color, Position } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';
import { ChessBoardService } from './chess-board.service';

@Injectable({
  providedIn: 'root'
})
export class MoveGenerationService {
  
  constructor(private boardService:ChessBoardService) { }

  getValidMoves(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];

    if (piece.type === PieceType.PAWN) {
      return this.getValidPawnMoves(piece);
    }

    return fieldsToMove;
  }

  private getValidPawnMoves(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];

    // normalize position white <-> black
    let normalizedPosition: Position = this.normalizePosition(piece.color, piece.position);

    this.addIfFree(fieldsToMove,{
      column: piece.position.column,
      row: normalizedPosition.row + 1
    });

    if (normalizedPosition.row === 2) {
      this.addIfFree(fieldsToMove,{
        column: piece.position.column,
        row: normalizedPosition.row + 2
      });
    }
    return fieldsToMove.map(p => {
      return this.denormalizePosition(piece.color, p);
    });
  }

  private addIfFree(fieldsToMove: Position[],fieldToMove: Position) {
    if (this.isFree(fieldToMove)) {
      fieldsToMove.push(fieldToMove);
    }
  }

  private isFree(position: Position): boolean {
    let result=this.boardService.getPieceOnPos(position)===undefined;
    console.log("isFree position:"+JSON.stringify(position)+", result: "+result);
    return result;
  }

  private normalizePosition(color: Color, position: Position): Position {
    if (color === Color.WHITE) {
      return position;
    }
    else {
      return {
        row: 9 - position.row,
        column: position.column
      };
    }
  }

  private denormalizePosition(color: Color, position: Position): Position {
    if (color === Color.WHITE) {
      return position;
    }
    else {
      return {
        row: 9 - position.row,
        column: position.column
      };
    }
  }
}
