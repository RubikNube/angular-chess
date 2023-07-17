import { Board, COLOR_WHITE, Color, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationPawnHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.PAWN;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedDiagonally(piece.position, board) ||
      PieceUtils.isPinnedHorizontally(piece.position, board)) {
      return [];
    }

    if (piece.color === COLOR_WHITE) {
      if (piece.position.row === 2) {
        return BoardUtils.getFreeFrontSquares(board, piece, 2)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
      else {
        return BoardUtils.getFreeFrontSquares(board, piece, 1)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
    }
    else {
      if (piece.position.row === 7) {
        return BoardUtils.getFreeBackSquares(board, piece, 2)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
      else {
        return BoardUtils.getFreeBackSquares(board, piece, 1)
          .map(PositionUtils.positionToMoveFunction(piece));
      }
    }
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    if (PieceUtils.isPinnedHorizontally(piece.position, board) ||
      PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }
    const captureCandidates = MoveGenerationPawnHandler.getCaptureCandidates(piece);

    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);
    const pinningCapturesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, lowerToUpperDiagonal);
    if (pinningCapturesOnLowerToUpperDiagonal) {
      if (this.canPinnedPieceBeCaptured(pinningCapturesOnLowerToUpperDiagonal, captureCandidates)) {
        return pinningCapturesOnLowerToUpperDiagonal;
      }
      else {
        return [];
      }
    }

    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);

    const pinningCapturesOnUpperToLowerDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, upperToLowerDiagonal);
    if (pinningCapturesOnUpperToLowerDiagonal) {
      if (this.canPinnedPieceBeCaptured(pinningCapturesOnUpperToLowerDiagonal, captureCandidates)) {
        return pinningCapturesOnUpperToLowerDiagonal;
      }
      else {
        return [];
      }
    }

    return captureCandidates
      .map(p => {
        const isEnPassant = BoardUtils.isEnPassantSquare(board, p);

        if (!isEnPassant) {
          return {
            piece: piece,
            from: piece.position,
            to: p,
            isEnPassant,
            capturedPiece: PositionUtils.getPieceOnPos(board, p)
          }
        }
        else {
          const copiedBoard: Board = CopyUtils.deepCopyElement(board);
          copiedBoard.pieces = copiedBoard.pieces.filter(b => b.position.row !== (p.row - 1) && b.position.column !== p.column);


          if (PieceUtils.isPinnedHorizontally(piece.position, copiedBoard)) {
            return undefined;
          }
          else {
            return {
              piece: piece,
              from: piece.position,
              to: p,
              isEnPassant,
              capturedPiece: PositionUtils.getPieceOnPos(board, { row: p.row - 1, column: p.column })
            }
          }
        }
      })
      .filter(m => m !== undefined) as Move[];
  }

  private canPinnedPieceBeCaptured(pinningMoves: Move[], captureCandidates: Position[]) {
    return pinningMoves.length > 0 && PositionUtils.includes(captureCandidates, pinningMoves[0].to);
  }

  public static getCaptureCandidates(piece: Piece): Position[] {
    if (piece.color === COLOR_WHITE) {
      // left upper field
      const leftUpperField: Position = {
        row: piece.position.row + 1,
        column: piece.position.column - 1
      };

      // right upper field
      const rightUpperField: Position = {
        row: piece.position.row + 1,
        column: piece.position.column + 1
      };
      return [leftUpperField, rightUpperField];
    }
    else {
      // left lower field
      const leftUpperField: Position = {
        row: piece.position.row - 1,
        column: piece.position.column - 1
      };

      // right lower field
      const rightUpperField: Position = {
        row: piece.position.row - 1,
        column: piece.position.column + 1
      };
      return [leftUpperField, rightUpperField];
    }
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return false;
    }

    const captureCandidates = MoveGenerationPawnHandler.getCaptureCandidates(piece);

    return PositionUtils.includes(captureCandidates, kingPos);
  }

  public getBlockingSquares(piece: Piece, board: Board): Position[] {
    return [];
  }

  public getAttackingSquares(piece: Piece, board: Board): Position[] {
    return MoveGenerationPawnHandler.getCaptureCandidates(piece)
      .filter(p => PositionUtils.isOnBoard(p));
  }
}