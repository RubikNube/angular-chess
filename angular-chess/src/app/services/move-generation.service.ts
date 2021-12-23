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
    // normalize position white <-> black
    let relativePosition: Position = this.positioningService.getRelativePosition(piece.position, piece.color);
    let fieldsToMove: Position[] = [];

    if (piece.type === PieceType.PAWN) {
      fieldsToMove = this.getValidPawnMoves({ type: piece.type, color: piece.color, position: relativePosition });
    }

    return fieldsToMove
      .filter(p => this.isFree(p, piece.color))
      .map(p => this.positioningService.getAbsolutePosition(p, piece.color));
  }

  private getValidPawnMoves(piece: Piece): Position[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));
    if (piece.position.row === 2) {
      return this.getFreeFrontSquares(piece, 2);
    }
    else {
      return this.getFreeFrontSquares(piece, 1);
    }
  }

  private getFreeFrontSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row + index
      };

      if (this.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  private isFree(position: Position, color: Color): boolean {
    let absPos = this.positioningService.getAbsolutePosition(position, color);
    let result = this.boardService.getPieceOnPos(absPos) === undefined;
    console.log("isFree position:" + JSON.stringify(absPos) + ", result: " + result);
    return result;
  }

  getValidCaptures(piece: Piece): Position[] {
    console.log("getValidCaptures: " + JSON.stringify(piece));
    let relativePosition: Position = this.positioningService.getRelativePosition(piece.position, piece.color);
    let fieldsToMove: Position[] = [];

    if (piece.type === PieceType.PAWN) {
      fieldsToMove = this.getValidPawnCaptures({ type: piece.type, color: piece.color, position: relativePosition });
    }

    return fieldsToMove
      .filter(p => this.isOppositeColoredPieceOnPos(p, piece.color))
      .map(p => this.positioningService.getAbsolutePosition(p, piece.color));
  }

  private isOppositeColoredPieceOnPos(position: Position, color: Color): boolean {
    let absPos = this.positioningService.getAbsolutePosition(position, color);
    let pieceOnPos = this.boardService.getPieceOnPos(absPos);

    if (pieceOnPos !== undefined) {
      return pieceOnPos.color !== color;
    }
    else {
      return false;
    }
  }

  private getValidPawnCaptures(piece: Piece): Position[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));
    let fieldsToMove: Position[] = [];

    // left upper field
    let leftUpperField: Position = {
      row: piece.position.row + 1,
      column: piece.position.column - 1
    };

    // right upper field
    let rightUpperField: Position = {
      row: piece.position.row + 1,
      column: piece.position.column + 1
    };

    fieldsToMove.push(leftUpperField, rightUpperField);

    return fieldsToMove;
  }
}
