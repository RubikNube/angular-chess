import { Board, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";
import MoveGenerationUtils from "./move.generation.utils";

export class MoveGenerationKingHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.KING;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    let moves: Move[] = [];

    // surrounding squares:
    moves = PositionUtils.getSurroundingSquares(piece)
      .map(p => {
        return {
          piece: piece,
          from: piece.position,
          to: p
        }
      });

    // castle
    const castleRights = BoardUtils.getCastleRights(piece.color, board);

    // deep copy of board, because we need to check if king is attacked after castle
    let copiedBoard: Board = CopyUtils.deepCopyElement(board);
    // remove king from copied board, because we need to check if king is attacked after castle
    copiedBoard.pieces = copiedBoard.pieces.filter(p => !PositionUtils.positionEquals(p.position,piece.position));

    const attackedSquares: Position[] = MoveGenerationUtils.calculateAttackedSquares(copiedBoard, PieceUtils.getOpposedColor(piece.color));
    // kingside castle
    if (castleRights.canShortCastle) {
      const squareBeforeCastle = {
        row: piece.position.row,
        column: piece.position.column + 1
      }

      const castleSquare = {
        row: piece.position.row,
        column: piece.position.column + 2
      }

      const rookSquare = {
        row: piece.position.row,
        column: 8
      }

      const pieceOnRookPos: Piece | undefined = PositionUtils.getPieceOnPos(board, rookSquare);

      if (pieceOnRookPos && pieceOnRookPos.type === PieceType.ROOK && pieceOnRookPos.color === piece.color
        && PositionUtils.isFree(board, squareBeforeCastle) && !PositionUtils.includes(attackedSquares, squareBeforeCastle)
        && PositionUtils.isFree(board, castleSquare) && !PositionUtils.includes(attackedSquares, castleSquare)) {
        moves.push({
          piece: piece,
          from: piece.position,
          to: castleSquare,
          isShortCastle: true
        });
      }
    }

    // queenside castle
    if (castleRights.canLongCastle) {
      const squareBeforeCastle = {
        row: piece.position.row,
        column: piece.position.column - 1
      }

      const castleSquare = {
        row: piece.position.row,
        column: piece.position.column - 2
      }

      const rookSquare = {
        row: piece.position.row,
        column: 1
      }

      const pieceOnRookPos: Piece | undefined = PositionUtils.getPieceOnPos(board, rookSquare);

      if (pieceOnRookPos && pieceOnRookPos.type === PieceType.ROOK && pieceOnRookPos.color === piece.color
        && PositionUtils.isFree(board, squareBeforeCastle) && !PositionUtils.includes(attackedSquares, squareBeforeCastle)
        && PositionUtils.isFree(board, castleSquare) && !PositionUtils.includes(attackedSquares, castleSquare)) {
        moves.push({
          piece: piece,
          from: piece.position,
          to: castleSquare,
          isLongCastle: true
        });
      }
    }

    return PositionUtils.filterOutAttackedSquares(moves, attackedSquares);
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    return PositionUtils.getSurroundingSquares(piece)
      .map(PositionUtils.positionToMoveFunction(piece))
      .filter(m => !BoardUtils.isProtected(board, PositionUtils.getPieceOnPos(board, m.to)))
  }

  public isAttackingKing(): boolean {
    return false;
  }

  public getBlockingSquares(): Position[] {
    return [];
  }

  public getAttackingSquares(piece: Piece, board: Board): Position[] {
    return PositionUtils.getSurroundingSquares(piece)
    .filter(p => PositionUtils.isOnBoard(p));
  }
}