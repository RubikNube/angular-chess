import { Board } from "src/app/types/board.t";
import { Color, Direction, PieceType, Rank, Square } from "src/app/types/compressed.types.t";
import { Move, Piece } from "src/app/types/pieces.t";
import BoardUtils from "../board.utils";
import CopyUtils from "../copy.utils";
import PieceUtils from "../piece.utils";
import SquareUtils from "../square.utils";
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

    if (piece.color === Color.WHITE) {
      if (SquareUtils.rankOf(piece.position) === Rank.RANK_2) {
        return BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH, 2)
          .map(SquareUtils.positionToMoveFunction(piece));
      }
      else {
        return BoardUtils.getFreeSquaresInDirection(board, piece, Direction.NORTH, 1)
          .map(SquareUtils.positionToMoveFunction(piece));
      }
    }
    else {
      if (SquareUtils.rankOf(piece.position) === Rank.RANK_7) {
        return BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH, 2)
          .map(SquareUtils.positionToMoveFunction(piece));
      }
      else {
        return BoardUtils.getFreeSquaresInDirection(board, piece, Direction.SOUTH, 1)
          .map(SquareUtils.positionToMoveFunction(piece));
      }
    }
  }

  /**
   * Retrieves the capture moves for a given piece on the board.
   * 
   * @param piece - The piece for which to generate capture moves.
   * @param board - The current state of the chess board.
   * @returns An array of capture moves for the piece.
   */
  public getCaptures(piece: Piece, board: Board): Move[] {
    if (PieceUtils.isPinnedHorizontally(piece.position, board) ||
      PieceUtils.isPinnedVertically(piece.position, board)) {
      return [];
    }
    const captureCandidates = MoveGenerationPawnHandler.getCaptureCandidates(piece);

    const lowerToUpperDiagonal: Square[] = SquareUtils.getLowerToUpperDiagonal(piece.position);
    const pinningCapturesOnLowerToUpperDiagonal: Move[] | undefined = BoardUtils.getDiagonalPartiallyPinnedCaptures(piece, board, lowerToUpperDiagonal);
    if (pinningCapturesOnLowerToUpperDiagonal) {
      if (this.canPinnedPieceBeCaptured(pinningCapturesOnLowerToUpperDiagonal, captureCandidates)) {
        return pinningCapturesOnLowerToUpperDiagonal;
      }
      else {
        return [];
      }
    }

    const upperToLowerDiagonal: Square[] = SquareUtils.getUpperToLowerDiagonal(piece.position);

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
            capturedPiece: SquareUtils.getPieceOnPos(board, p)
          }
        }
        else {
          const copiedBoard: Board = CopyUtils.copyBoard(board);
          copiedBoard.pieces = copiedBoard.pieces.filter(b => SquareUtils.rankOf(b.position) !== (SquareUtils.rankOf(p) - 1) && SquareUtils.fileOf(b.position) !== SquareUtils.fileOf(p));


          if (PieceUtils.isPinnedHorizontally(piece.position, copiedBoard)) {
            return undefined;
          }
          else {
            return {
              piece: piece,
              from: piece.position,
              to: p,
              isEnPassant,
              capturedPiece: SquareUtils.getPieceOnPos(board, SquareUtils.convertPositionToSquare({ row: SquareUtils.rankOf(p) - 1, column: SquareUtils.fileOf(p) }))
            }
          }
        }
      })
      .filter(m => m !== undefined) as Move[];
  }

  private canPinnedPieceBeCaptured(pinningMoves: Move[], captureCandidates: Square[]) {
    return pinningMoves.length > 0 && SquareUtils.includes(captureCandidates, pinningMoves[0].to);
  }

  /**
   * Returns an array of squares representing the capture candidates for the given piece.
   * 
   * @param piece - The piece for which to generate capture candidates.
   * @returns An array of squares representing the capture candidates.
   */
  public static getCaptureCandidates(piece: Piece): Square[] {
    const captureCandidates: Square[] = [];
    if (piece.color === Color.WHITE) {
      this.addCaptureCandidate(captureCandidates, piece.position, Direction.NORTH_EAST);
      this.addCaptureCandidate(captureCandidates, piece.position, Direction.NORTH_WEST);
    }
    else {
      this.addCaptureCandidate(captureCandidates, piece.position, Direction.SOUTH_EAST);
      this.addCaptureCandidate(captureCandidates, piece.position, Direction.SOUTH_WEST);
    }
    return captureCandidates;
  }

  /**
   * Adds a capture candidate to the given array of capture candidates.
   * A capture candidate is a square that can be captured by a pawn in a specific direction.
   *
   * @param captureCandidates - The array of capture candidates to add the candidate to.
   * @param startingSquare - The starting square of the pawn.
   * @param direction - The direction in which the pawn is moving.
   */
  private static addCaptureCandidate(captureCandidates: Square[], startingSquare: Square, direction: Direction): void {
    const candidate = SquareUtils.getSquareInDirection(startingSquare, direction);

    if (BoardUtils.getDistanceOfSquares(startingSquare, candidate) === 1) {
      captureCandidates.push(candidate);
    }
  }

  public isAttackingKing(piece: Piece, board: Board): boolean {
    const kingPos = board.pieces.find(p => p.type === PieceType.KING && p.color !== piece.color)?.position;
    if (!kingPos) {
      return false;
    }

    const captureCandidates = MoveGenerationPawnHandler.getCaptureCandidates(piece);

    return SquareUtils.includes(captureCandidates, kingPos);
  }

  public getBlockingSquares(piece: Piece, board: Board): Square[] {
    return [];
  }

  /**
   * Returns an array of squares that the given pawn can attack on the board.
   * 
   * @param pawn - The pawn piece.
   * @param board - The chess board.
   * @returns An array of squares that the pawn can attack.
   */
  public getAttackingSquares(pawn: Piece, board: Board): Square[] {
    return MoveGenerationPawnHandler.getCaptureCandidates(pawn)
      .filter(square => SquareUtils.isOnBoard(square) && BoardUtils.getDistanceOfSquares(pawn.position, square) === 1);
  }
}