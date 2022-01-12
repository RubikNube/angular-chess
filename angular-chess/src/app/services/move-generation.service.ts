import { Injectable } from '@angular/core';
import { Board, Color, Position } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
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

  getExecutableMove(board: Board, piece: Piece, dropPos: Position): Move | undefined {
    let move = this.getValidMoves(board, piece, true).find(m => PositionUtils.positionEquals(m.to, dropPos));
    if (move !== undefined) {
      return move;
    }
    else {
      return this.getValidCaptures(board, piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    }
  }

  getValidMoves(board: Board, piece: Piece, shouldCalculateCheck: boolean): Move[] {
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
        if (shouldCalculateCheck) {
          m.isCheck = this.isCheck(board, m);
        }
        return m;
      });
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

  private isOppositeColoredPieceOnPos(board: Board, position: Position, color: Color): boolean {
    let pieceOnPos = PositionUtils.getPieceOnPos(board, position);

    if (pieceOnPos !== undefined) {
      return pieceOnPos.color !== color;
    }
    else {
      return false;
    }
  }


  public isMate(board: Board): boolean {
    return BoardUtils.isMate(this, board);
  }
}
