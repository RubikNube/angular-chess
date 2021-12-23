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
    } else if (piece.type === PieceType.ROOK) {
      fieldsToMove = this.getValidRookMoves({ type: piece.type, color: piece.color, position: relativePosition });
    } else if (piece.type == PieceType.KNIGHT) {
      fieldsToMove = this.getValidKnightMoves({ type: piece.type, color: piece.color, position: relativePosition });
    }

    return fieldsToMove
      .filter(p => this.positioningService.isOnBoard(p))
      .filter(p => this.isFree(p, piece.color))
      .map(p => this.positioningService.getAbsolutePosition(p, piece.color));
  }

  getValidKnightMoves(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];

    fieldsToMove.push(
      {
        row: piece.position.row + 1,
        column: piece.position.column - 2
      },
      {
        row: piece.position.row + 2,
        column: piece.position.column - 1
      },
      {
        row: piece.position.row + 1,
        column: piece.position.column + 2
      },
      {
        row: piece.position.row + 2,
        column: piece.position.column + 1
      },
      {
        row: piece.position.row - 1,
        column: piece.position.column - 2
      },
      {
        row: piece.position.row - 2,
        column: piece.position.column - 1
      },
      {
        row: piece.position.row - 1,
        column: piece.position.column + 2
      },
      {
        row: piece.position.row - 2,
        column: piece.position.column + 1
      })

    return fieldsToMove;
  }

  getValidRookMoves(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];
    let frontSquares: Position[] = this.getFreeFrontSquares(piece, 8 - piece.position.row);
    let backSquares: Position[] = this.getFreeBackSquares(piece, piece.position.row - 1);
    let leftSquares: Position[] = this.getFreeLeftSquares(piece, piece.position.column - 1);
    let rightSquares: Position[] = this.getFreeRightSquares(piece, 8 - piece.position.column);

    fieldsToMove.push(...frontSquares, ...backSquares, ...leftSquares, ...rightSquares);

    return fieldsToMove;
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

  private getFreeBackSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row - index
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

  private getFreeLeftSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row
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

  private getFreeRightSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row
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
    else if (piece.type === PieceType.ROOK) {
      fieldsToMove = this.getValidRookCaptures({ type: piece.type, color: piece.color, position: relativePosition });
    }
    else if (piece.type === PieceType.KNIGHT) {
      fieldsToMove = this.getValidKnightMoves({ type: piece.type, color: piece.color, position: relativePosition });
    }

    return fieldsToMove
      .filter(p => this.isOppositeColoredPieceOnPos(p, piece.color))
      .map(p => this.positioningService.getAbsolutePosition(p, piece.color));
  }

  getValidRookCaptures(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];
    let frontSquares: Position[] = this.getOccupiedFrontSquare(piece, 8 - piece.position.row);
    let backSquares: Position[] = this.getOccupiedBackSquare(piece, piece.position.row - 1);
    let leftSquares: Position[] = this.getOccupiedLeftSquare(piece, piece.position.column - 1);
    let rightSquares: Position[] = this.getOccupiedRightSquare(piece, 8 - piece.position.column);

    fieldsToMove.push(...frontSquares, ...backSquares, ...leftSquares, ...rightSquares);

    return fieldsToMove;
  }

  getOccupiedBackSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row - index
      };

      if (!this.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  getOccupiedFrontSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row + index
      };

      if (!this.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }


  getOccupiedLeftSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row
      };

      if (!this.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  getOccupiedRightSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row
      };

      if (!this.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
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
