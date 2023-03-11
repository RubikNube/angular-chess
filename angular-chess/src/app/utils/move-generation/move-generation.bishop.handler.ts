import { Board, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import PieceUtils from "../piece.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationHandler } from "./move-generation.handler";

export class MoveGenerationBishopHandler implements MoveGenerationHandler {

  public canHandle(piece: Piece): boolean {
    return piece.type === PieceType.BISHOP;
  }

  public getMoves(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedHorizontally(piece.position, board) || PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }

    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);

    const pinningMovesOnLowerToUpperDiagonal: Move[] | undefined = this.getPartiallyPinnedMoves(piece, board, lowerToUpperDiagonal);
    if (pinningMovesOnLowerToUpperDiagonal) {
      return pinningMovesOnLowerToUpperDiagonal;
    }

    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);

    const pinningMovesOnUpperToLowerDiagonal: Move[] | undefined = this.getPartiallyPinnedMoves(piece, board, upperToLowerDiagonal);
    if (pinningMovesOnUpperToLowerDiagonal) {
      return pinningMovesOnUpperToLowerDiagonal;
    }

    const frontLeftSquares: Position[] = BoardUtils.getFreeFrontLeftSquares(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
    const frontRightSquares: Position[] = BoardUtils.getFreeFrontRightSquares(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
    const backLeftSquares: Position[] = BoardUtils.getFreeBackLeftSquares(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
    const backRightSquares: Position[] = BoardUtils.getFreeBackRightSquares(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

    const fieldsToMove = [
      ...frontLeftSquares,
      ...frontRightSquares,
      ...backLeftSquares,
      ...backRightSquares];

    return fieldsToMove.map(p => {
      return {
        piece: piece,
        from: piece.position,
        to: p
      }
    });
  }

  private getPartiallyPinnedMoves(piece: Piece, board: Board, diagonal: Position[]): Move[] | undefined {
    const piecesOnDiagonal: Piece[] = diagonal.map(p => PositionUtils.getPieceOnPos(board, p)).filter(p => p !== undefined) as Piece[];

    const closestPieces: Piece[] = PieceUtils.sortByDistanceToPiece(piece, piecesOnDiagonal);

    const closestLeftPiece: Piece | undefined = closestPieces.find(p => p.position.column < piece.position.column);
    const closestRightPiece: Piece | undefined = closestPieces.find(p => p.position.column > piece.position.column);

    if (this.isPartiallyPinned(closestLeftPiece, closestRightPiece, piece) || this.isPartiallyPinned(closestRightPiece, closestLeftPiece, piece)) {

      const validMoves: Move[] = [];

      const freeFieldsBetweenPieceAndLeftClosestPiece: Position[] = diagonal
        .filter(p => p.column < piece.position.column && p.column > closestLeftPiece!.position.column);
      const movesToLeft: Move[] = freeFieldsBetweenPieceAndLeftClosestPiece.map(PositionUtils.positionToMoveFunction(piece));
      validMoves.push(...movesToLeft);

      const freeFieldsBetweenPieceAndRightClosestPiece: Position[] = diagonal
        .filter(p => p.column > piece.position.column && p.column < closestRightPiece!.position.column);
      const movesToRight: Move[] = freeFieldsBetweenPieceAndRightClosestPiece.map(PositionUtils.positionToMoveFunction(piece));
      validMoves.push(...movesToRight);

      return validMoves;
    }
    else {
      return undefined;
    }
  }

  private isPartiallyPinned(king: Piece | undefined, pinningPiece: Piece | undefined, pinnedPiece: Piece) {
    return king
      && pinningPiece
      && king.type === PieceType.KING
      && king.color === pinnedPiece.color
      && [PieceType.BISHOP, PieceType.QUEEN].includes(pinningPiece.type);
  }

  public getCaptures(piece: Piece, board: Board): Move[] {
    // if piece is pinned it cannot move
    if (PieceUtils.isPinnedHorizontally(piece.position, board) || PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }

    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);

    const pinningMovesOnLowerToUpperDiagonal: Move[] | undefined = this.getPartiallyPinnedCaptures(piece, board, upperToLowerDiagonal);
    if (pinningMovesOnLowerToUpperDiagonal) {
      return pinningMovesOnLowerToUpperDiagonal;
    }

    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);

    const pinningMovesOnUpperToLowerDiagonal: Move[] | undefined = this.getPartiallyPinnedCaptures(piece, board, lowerToUpperDiagonal);
    if (pinningMovesOnUpperToLowerDiagonal) {
      return pinningMovesOnUpperToLowerDiagonal;
    }

    const frontLeftSquares: Position[] = BoardUtils.getOccupiedFrontLeftSquare(board, piece, Math.min(8 - piece.position.row, piece.position.column - 1));
    const frontRightSquares: Position[] = BoardUtils.getOccupiedFrontRightSquare(board, piece, Math.min(8 - piece.position.row, 8 - piece.position.column));
    const backLeftSquares: Position[] = BoardUtils.getOccupiedBackLeftSquare(board, piece, Math.min(piece.position.row - 1, piece.position.column - 1));
    const backRightSquares: Position[] = BoardUtils.getOccupiedBackRightSquare(board, piece, Math.min(piece.position.row - 1, 8 - piece.position.column));

    const fieldsToMove = [
      ...frontLeftSquares,
      ...frontRightSquares,
      ...backLeftSquares,
      ...backRightSquares];

    return fieldsToMove.map(PositionUtils.positionToMoveFunction(piece));
  }

  private getPartiallyPinnedCaptures(piece: Piece, board: Board, diagonal: Position[]): Move[] | undefined {
    const piecesOnDiagonal: Piece[] = diagonal.map(p => PositionUtils.getPieceOnPos(board, p)).filter(p => p !== undefined) as Piece[];

    const closestPieces: Piece[] = PieceUtils.sortByDistanceToPiece(piece, piecesOnDiagonal);

    const closestLeftPiece: Piece | undefined = closestPieces.find(p => p.position.column < piece.position.column);
    const closestRightPiece: Piece | undefined = closestPieces.find(p => p.position.column > piece.position.column);

    if (this.isPartiallyPinned(closestLeftPiece, closestRightPiece, piece) || this.isPartiallyPinned(closestRightPiece, closestLeftPiece, piece)) {

      const validMoves: Move[] = [];

      // if left piece is an enemy piece, it can be captured
      if (closestLeftPiece && closestLeftPiece.color !== piece.color) {
        validMoves.push(PositionUtils.positionToMoveFunction(piece)(closestLeftPiece.position, 0, [closestLeftPiece.position]));
      }

      // if right piece is an enemy piece, it can be captured
      if (closestRightPiece && closestRightPiece.color !== piece.color) {
        validMoves.push(PositionUtils.positionToMoveFunction(piece)(closestRightPiece.position, 0, [closestRightPiece.position]));
      }

      return validMoves;
    }
    else {
      return undefined;
    }
  }
}
