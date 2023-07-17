import { Board, COLOR_WHITE, Position } from "src/app/types/board.t";
import { Move, Piece, PieceType } from "src/app/types/pieces.t";
import LoggingUtils, { LogLevel } from "../logging.utils";
import PositionUtils from "../position.utils";
import { MoveGenerationBishopHandler } from "./move-generation.bishop.handler";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationKingHandler } from "./move-generation.king.handler";
import { MoveGenerationKnightHandler } from "./move-generation.knight.handler";
import { MoveGenerationPawnHandler } from "./move-generation.pawn.handler";
import { MoveGenerationQueenHandler } from "./move-generation.queen.handler";
import { MoveGenerationRookHandler } from "./move-generation.rook.handler";

export default class MoveGenerationUtils {
  static generationHandlers: MoveGenerationHandler[] = [
    new MoveGenerationRookHandler(),
    new MoveGenerationKnightHandler(),
    new MoveGenerationPawnHandler(),
    new MoveGenerationBishopHandler(),
    new MoveGenerationQueenHandler(),
    new MoveGenerationKingHandler()
  ]

  public static isCheck(board: Board, move: Move): boolean {
    let validCaptures = this.getValidCaptures(board, {
      type: move.promotedPiece ? move.promotedPiece.type : move.piece.type,
      color: move.piece.color,
      position: move.to
    }, true);

    return validCaptures.find(c => c.capturedPiece?.type === PieceType.KING) !== undefined;
  }

  public static isMate(board: Board): boolean {
    // get all pieces of current player
    const pieces: Piece[] = board.pieces.filter(p => p.color === board.playerToMove);

    // get all valid moves of current player
    let moves: Move[] = [];
    for (let piece of pieces) {
      moves = moves.concat(this.getValidMoves(board, piece, false));
    }

    // get all the valid captures of current player
    for (let piece of pieces) {
      moves = moves.concat(this.getValidCaptures(board, piece, false));
    }

    return moves.length === 0;
  }

  public static getExecutableMoves(board: Board, dropPos: Position, color: boolean): Move[] {
    const pieces: Piece[] = board.pieces.filter(p => p.color === color);

    const moves: Move[] = [];

    for (let piece of pieces) {
      const movesOfPiece = this.getExecutableMove(board, piece, dropPos);
      if (movesOfPiece) {
        moves.push(movesOfPiece);
      }
    }

    return moves;
  }

  public static getExecutableMove(board: Board, piece: Piece, dropPos: Position): Move | undefined {
    let move = this.getValidMoves(board, piece, true).find(m => PositionUtils.positionEquals(m.to, dropPos));
    if (move !== undefined) {
      return move;
    }
    else {
      return this.getValidCaptures(board, piece).find(m => PositionUtils.positionEquals(m.to, dropPos));
    }
  }

  public static getValidMoves(board: Board, piece: Piece, shouldCalculateCheck: boolean): Move[] {
    let moves: Move[] = [];

    let matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      moves = matchingHandler.getMoves(piece, board);
    }

    if (piece.type !== PieceType.KING) {
      const attackingEnemyPieces = this.getKingAttackingPieces(board, piece.color);
      if (attackingEnemyPieces.length === 1) {
        const attackingPiece = attackingEnemyPieces[0];
        const blockingSquares = this.generationHandlers.find(h => h.canHandle(attackingPiece))?.getBlockingSquares(attackingPiece, board);

        if (blockingSquares !== undefined) {
          // can piece move to a blocking square?
          moves = moves.filter(m => blockingSquares.find(s => PositionUtils.positionEquals(s, m.to)));
        }
      }

      if (attackingEnemyPieces.length > 1) {
        return [];
      }
    }

    return this.getFreeMovesOnBoard(moves, board, shouldCalculateCheck);
  }

  private static getFreeMovesOnBoard(moves: Move[], board: Board, shouldCalculateCheck: boolean): Move[] {
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

  public static getValidCaptures(board: Board, piece: Piece, dontSearchForCheck?: boolean): Move[] {
    let captureMoves: Move[] = [];

    const matchingHandler = this.generationHandlers.find(h => h.canHandle(piece));

    if (matchingHandler !== undefined) {
      captureMoves = matchingHandler.getCaptures(piece, board);
    }
    else {
      LoggingUtils.log(LogLevel.INFO, () => "getValidMoves: found no matching handler")
    }

    // get all pieces that attack the king
    const enemyAttackingPieces = this.getKingAttackingPieces(board, piece.color);

    // if there are attacking pieces check if the piece can be captured
    if (enemyAttackingPieces.length > 0) {
      // filter out all moves that capture the attacking piece
      captureMoves = captureMoves.filter(m => enemyAttackingPieces.some(p => PositionUtils.positionEquals(p.position, m.to)));
    }

    return captureMoves
      .filter(m => this.isOppositeColoredPieceOnPos(board, m.to, piece.color) || m.isEnPassant)
      .map(m => {
        m.piece.position = piece.position;

        if (!m.isEnPassant) {
          m.capturedPiece = PositionUtils.getPieceOnPos(board, m.to);
        } else {
          let capturedPiecePos: Position = {
            row: m.piece.color === COLOR_WHITE ? m.to.row - 1 : m.to.row + 1,
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

  private static getKingAttackingPieces(board: Board, colorOfAttackedKing: boolean): Piece[] {
    return board.pieces
      .filter(p => p.color !== colorOfAttackedKing)
      .filter(p => this.generationHandlers.find(h => h.canHandle(p))?.isAttackingKing(p, board));
  }

  private static isOppositeColoredPieceOnPos(board: Board, position: Position, color: boolean): boolean {
    const pieceOnPos = PositionUtils.getPieceOnPos(board, position);
    return pieceOnPos ? pieceOnPos.color !== color : false;
  }

  public static calculateAttackedSquares(board: Board, colorOfPieces: boolean): Position[] {
    // get all pieces of the color
    const pieces = board.pieces.filter(p => p.color === colorOfPieces);
    // get all attacked squares of the pieces
    return pieces.map(p => this.generationHandlers
      .find(h => h.canHandle(p))
      ?.getAttackingSquares(p, board))
      .filter(s => s !== undefined)
      .flat() as Position[];
  }

  public static getAttackingSquares(piece: Piece, board: Board): Position[] {
    return this.generationHandlers.find(h => h.canHandle(piece))?.getAttackingSquares(piece, board) ?? [];
  }
}