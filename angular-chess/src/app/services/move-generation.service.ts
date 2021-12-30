import { Injectable } from '@angular/core';
import { Color, Position } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import PositionUtils from '../utils/position.utils';
import { ChessBoardService } from './chess-board.service';
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

  public isCheck(move: Move): boolean {
    let validCaptures = this.getValidCaptures({
      type: move.piece.type,
      color: move.piece.color,
      position: move.to
    }, true);

    return validCaptures.find(c => c.capturedPiece?.type === PieceType.KING) !== undefined;
  }

  getExecutableMove(piece: Piece, dropPos: Position): Move | undefined {
    let move = this.getValidMoves(piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    if (move !== undefined) {
      return move;
    }
    else {
      return this.getValidCaptures(piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    }
  }

  getValidMoves(piece: Piece): Move[] {
    console.log("getValidMoves: " + JSON.stringify(piece));
    // normalize position white <-> black
    let relativePosition: Position = PositionUtils.getRelativePosition(piece.position, piece.color);
    let moves: Move[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      moves = matchingHandler.getMoves({ type: piece.type, color: piece.color, position: relativePosition });
    }

    return moves
      .filter(m => PositionUtils.isOnBoard(m.to))
      .filter(m => this.boardService.isFree(m.to, piece.color))
      .map(m => {
        m.piece.position = piece.position;
        m.from = piece.position;
        m.to = PositionUtils.getAbsolutePosition(m.to, piece.color);
        m.isCheck = this.isCheck(m);
        return m;
      });
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

  getValidCaptures(piece: Piece, dontSearchForCheck?: boolean): Move[] {
    console.log("getValidCaptures: " + JSON.stringify(piece));
    let relativePosition: Position = PositionUtils.getRelativePosition(piece.position, piece.color);
    let captureMoves: Move[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      console.log("getValidMoves: matchingHandler: " + matchingHandler)
      captureMoves = matchingHandler.getCaptures({ type: piece.type, color: piece.color, position: relativePosition });
    }
    else {
      console.log("getValidMoves: found no matching handler")
    }

    return captureMoves
      .filter(m => this.isOppositeColoredPieceOnPos(m.to, piece.color) || m.isEnPassant)
      .map(m => {
        m.piece.position = piece.position;
        m.from = piece.position;
        let positionToMove = PositionUtils.getAbsolutePosition(m.to, piece.color);
        m.to = PositionUtils.getAbsolutePosition(m.to, piece.color);
        if (!m.isEnPassant) {
          m.capturedPiece = this.boardService.getPieceOnPos(positionToMove);
        } else {
          let capturedPiecePos: Position = {
            row: m.piece.color === Color.WHITE ? m.to.row - 1 : m.to.row + 1,
            column: m.to.column
          }

          m.capturedPiece = this.boardService.getPieceOnPos(capturedPiecePos);

        }

        if (!dontSearchForCheck) {
          m.isCheck = this.isCheck(m);
        }
        return m;
      });
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
