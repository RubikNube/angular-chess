import { Injectable } from '@angular/core';
import { Color, Position } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import PositionUtils from '../utils/position.utils';
import { ChessBoardService } from './chess-board.service';
import { MoveExecutionService } from './move-execution.service';
import { MoveGenerationBishopHandler } from './move-generation.bishop.handler';
import { MoveGenerationHandler } from './move-generation.handler';
import { MoveGenerationKingHandler } from './move-generation.king.handler';
import { MoveGenerationKnightHandler } from './move-generation.knight.handler';
import { MoveGenerationPawnHandler } from './move-generation.pawn.handler';
import { MoveGenerationQueenHandler } from './move-generation.queen.handler';
import { MoveGenerationRookHandler } from './move-generation.rook.handler';

@Injectable({
  providedIn: 'root'
})
export class MoveGenerationService {
  generationHandlers: MoveGenerationHandler[];

  constructor(private boardService: ChessBoardService) {
    this.generationHandlers = [
      new MoveGenerationRookHandler(this),
      new MoveGenerationKnightHandler(this),
      new MoveGenerationPawnHandler(this, boardService),
      new MoveGenerationBishopHandler(this),
      new MoveGenerationQueenHandler(this),
      new MoveGenerationKingHandler(this, boardService)
    ]
  }

  getValidMoves(piece: Piece): Move[] {
    return this.getValidMoveSquares(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p
        }
      });
  }

  private getValidMoveSquares(piece: Piece): Position[] {
    console.log("getValidMoves: " + JSON.stringify(piece));
    // normalize position white <-> black
    let relativePosition: Position = PositionUtils.getRelativePosition(piece.position, piece.color);
    let fieldsToMove: Position[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      fieldsToMove = matchingHandler.getMoves({ type: piece.type, color: piece.color, position: relativePosition });
    }

    return fieldsToMove
      .filter(p => PositionUtils.isOnBoard(p))
      .filter(p => this.boardService.isFree(p, piece.color))
      .map(p => PositionUtils.getAbsolutePosition(p, piece.color));
  }

  getSurroundingSquares(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];

    for (let r: number = -1; r <= 1; r++) {
      for (let c: number = -1; c <= 1; c++) {
        if (!(r == 0 && c == 0)) {
          let field: Position = {
            row: piece.position.row + r,
            column: piece.position.column + c
          }

          fieldsToMove.push(field);
        }
      }
    }

    return fieldsToMove;
  }

  getFreeFrontSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row + index
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeBackSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row - index
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeLeftSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeRightSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeFrontLeftSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row + index
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeFrontRightSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row + index
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeBackRightSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row - index
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getFreeBackLeftSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row - index
      };

      if (this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  getValidCaptures(piece: Piece): Move[] {
    return this.getValidCaptureSquares(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p,
          capturedPiece: this.boardService.getPieceOnPos(p)
        }
      })
  }

  private getValidCaptureSquares(piece: Piece): Position[] {
    console.log("getValidCaptures: " + JSON.stringify(piece));
    let relativePosition: Position = PositionUtils.getRelativePosition(piece.position, piece.color);
    let squaresToCapture: Position[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      console.log("getValidMoves: matchingHandler: " + matchingHandler)
      squaresToCapture = matchingHandler.getCaptureSquares({ type: piece.type, color: piece.color, position: relativePosition });
    }
    else {
      console.log("getValidMoves: found no matching handler")
    }

    return squaresToCapture
      .filter(p => this.isOppositeColoredPieceOnPos(p, piece.color) || this.isEnPassantSquare(piece, p))
      .map(p => PositionUtils.getAbsolutePosition(p, piece.color));
  }

  isEnPassantSquare(piece: Piece, pos: Position): boolean {
    if (piece.type === PieceType.PAWN) {
      let enPassantSquares = this.boardService.getEnPassantSquares()
        .filter(p => PositionUtils.positionEquals(p, { row: piece.color === Color.WHITE ? 6 : 3, column: piece.position.column - 1 }) || PositionUtils.positionEquals(p, { row: piece.color === Color.WHITE ? 6 : 3, column: piece.position.column + 1 }))
      return PositionUtils.includes(enPassantSquares, PositionUtils.getRelativePosition(pos, piece.color));
    }
    else {
      return false;
    }
  }

  getOccupiedBackSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row - index
      };

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
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

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
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

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
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

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  getOccupiedFrontLeftSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row + index
      };

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  getOccupiedFrontRightSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row + index
      };

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  getOccupiedBackRightSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column + index,
        row: piece.position.row - index
      };

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  getOccupiedBackLeftSquare(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column - index,
        row: piece.position.row - index
      };

      if (!this.boardService.isFree(squareToAdd, piece.color)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  private isOppositeColoredPieceOnPos(position: Position, color: Color): boolean {
    let absPos = PositionUtils.getAbsolutePosition(position, color);
    let pieceOnPos = this.boardService.getPieceOnPos(absPos);

    if (pieceOnPos !== undefined) {
      return pieceOnPos.color !== color;
    }
    else {
      return false;
    }
  }
}
