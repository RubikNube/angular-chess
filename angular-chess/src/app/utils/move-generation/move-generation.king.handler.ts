import { Board, } from "src/app/types/board.t";
import { PieceType, Square } from "src/app/types/compressed.types.t";
import { Move, Piece } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PieceUtils from "../piece.utils";
import SquareUtils from "../square.utils";
import { MoveGenerationHandler } from "./move-generation.handler";
import MoveGenerationUtils from "./move.generation.utils";

export class MoveGenerationKingHandler implements MoveGenerationHandler {
  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.KING;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    let moves: Move[] = [];

    // surrounding squares:
    moves = SquareUtils.getSurroundingSquares(piece)
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
    let copiedBoard: Board = CopyUtils.copyBoard(board);
    // remove king from copied board, because we need to check if king is attacked after castle
    copiedBoard.pieces = copiedBoard.pieces.filter(p => !SquareUtils.squareEquals(p.position, piece.position));

    const attackedSquares: Square[] = MoveGenerationUtils.calculateAttackedSquares(copiedBoard, PieceUtils.getOpposedColor(piece.color));
    // kingside castle
    if (castleRights.canShortCastle) {
      const squareBeforeCastle = SquareUtils.getRelativeSquare(Square.SQ_F1, piece.color);
      const castleSquare = SquareUtils.getRelativeSquare(Square.SQ_G1, piece.color);
      const rookSquare = SquareUtils.getRelativeSquare(Square.SQ_H1, piece.color);

      const pieceOnRookPos: Piece | undefined = SquareUtils.getPieceOnPos(board, rookSquare);

      if (pieceOnRookPos && pieceOnRookPos.type === PieceType.ROOK && pieceOnRookPos.color === piece.color
        && SquareUtils.isFree(board, squareBeforeCastle) && !SquareUtils.includes(attackedSquares, squareBeforeCastle)
        && SquareUtils.isFree(board, castleSquare) && !SquareUtils.includes(attackedSquares, castleSquare)) {
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
      const squareBeforeCastle = SquareUtils.getRelativeSquare(Square.SQ_D1, piece.color);
      const castleSquare = SquareUtils.getRelativeSquare(Square.SQ_C1, piece.color);
      const rookSquare = SquareUtils.getRelativeSquare(Square.SQ_A1, piece.color);

      const pieceOnRookPos: Piece | undefined = SquareUtils.getPieceOnPos(board, rookSquare);

      if (pieceOnRookPos && pieceOnRookPos.type === PieceType.ROOK && pieceOnRookPos.color === piece.color
        && SquareUtils.isFree(board, squareBeforeCastle) && !SquareUtils.includes(attackedSquares, squareBeforeCastle)
        && SquareUtils.isFree(board, castleSquare) && !SquareUtils.includes(attackedSquares, castleSquare)) {
        moves.push({
          piece: piece,
          from: piece.position,
          to: castleSquare,
          isLongCastle: true
        });
      }
    }

    return SquareUtils.filterOutAttackedSquares(moves, attackedSquares);
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    return SquareUtils.getSurroundingSquares(piece)
      .map(SquareUtils.positionToMoveFunction(piece))
      .filter(m => !BoardUtils.isProtected(board, SquareUtils.getPieceOnPos(board, m.to)))
  }

  public isAttackingKing(): boolean {
    return false;
  }

  public getBlockingSquares(): Square[] {
    return [];
  }

  public getAttackingSquares(piece: Piece, board: Board): Square[] {
    return SquareUtils.getSurroundingSquares(piece)
      .filter(p => SquareUtils.isOnBoard(p));
  }
}