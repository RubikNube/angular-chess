import { Injectable } from '@angular/core';
import { Board, Color, Position } from '../types/board.t';
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
      new MoveGenerationPawnHandler(this),
      new MoveGenerationBishopHandler(this),
      new MoveGenerationQueenHandler(this),
      new MoveGenerationKingHandler(this, boardService)
    ]
  }

  public isCheck(board: Board, move: Move): boolean {
    let validCaptures = this.getValidCaptures(board, {
      type: move.piece.type,
      color: move.piece.color,
      position: move.to
    }, true);

    return validCaptures.find(c => c.capturedPiece?.type === PieceType.KING) !== undefined;
  }

  getExecutableMove(piece: Piece, dropPos: Position): Move | undefined {
    let currentBoard: Board = this.boardService.getBoard();
    let move = this.getValidMoves(currentBoard, piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    if (move !== undefined) {
      return move;
    }
    else {
      return this.getValidCaptures(currentBoard, piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    }
  }

  getValidMoves(board: Board, piece: Piece): Move[] {
    console.log("getValidMoves: " + JSON.stringify(piece));

    let moves: Move[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      moves = matchingHandler.getMoves(piece, board);
    }

    return moves
      .filter(m => PositionUtils.isOnBoard(m.to))
      .filter(m => PositionUtils.isFree(board, m.to))
      .map(m => {
        m.isCheck = this.isCheck(board, m);
        return m;
      });
  }

  getFreeFrontSquares(piece: Piece, maxSquares: number): Position[] {
    let quaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      let squareToAdd = {
        column: piece.position.column,
        row: piece.position.row + index
      };

      let board = this.boardService.getBoard();

      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (PositionUtils.isFree(board, squareToAdd)) {
        quaresToMove.push(squareToAdd);
      }
      else {
        break;
      }
    }

    return quaresToMove;
  }

  public getValidCaptures(board: Board, piece: Piece, dontSearchForCheck?: boolean): Move[] {
    console.log("getValidCaptures: " + JSON.stringify(piece));
    let captureMoves: Move[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      console.log("getValidMoves: matchingHandler: " + matchingHandler)
      captureMoves = matchingHandler.getCaptures(piece, board);
    }
    else {
      console.log("getValidMoves: found no matching handler")
    }

    return captureMoves
      .filter(m => this.isOppositeColoredPieceOnPos(board, m.to, piece.color) || m.isEnPassant)
      .map(m => {
        m.piece.position = piece.position;

        if (!m.isEnPassant) {
          m.capturedPiece = PositionUtils.getPieceOnPos(board, m.to);
        } else {
          let capturedPiecePos: Position = {
            row: m.piece.color === Color.WHITE ? m.to.row - 1 : m.to.row + 1,
            column: m.to.column
          }

          m.capturedPiece = PositionUtils.getPieceOnPos(board, capturedPiecePos);

        }

        if (!dontSearchForCheck) {
          m.isCheck = this.isCheck(board, m);
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
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

      let board = this.boardService.getBoard();
      if (!PositionUtils.isFree(board, squareToAdd)) {
        quaresToMove.push(squareToAdd);
        break;
      }
    }

    return quaresToMove;
  }

  private isOppositeColoredPieceOnPos(board: Board, position: Position, color: Color): boolean {
    let pieceOnPos = PositionUtils.getPieceOnPos(board, position);

    if (pieceOnPos !== undefined) {
      return pieceOnPos.color !== color;
    }
    else {
      return false;
    }
  }
}
