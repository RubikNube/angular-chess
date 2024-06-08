import { Board, Result } from "../types/board.t";
import { CastlingRights, Color, Move, Piece, Square, StateInfo } from "../types/compressed.types.t";
import CopyUtils from "../utils/copy.utils";
import LoggingUtils, { LogLevel } from "../utils/logging.utils";
import SquareUtils from "../utils/square.utils";

/** A builder that is responsible for creating the board.*/
export class BoardBuilder {
  private readonly _board: Board;

  constructor(board?: Board) {
    if (board) {
      this._board = CopyUtils.copyBoard(board);
    }
    else {
      this._board = {
        pieces: [],
        castlingRights: CastlingRights.ANY_CASTLING,
        playerToMove: Color.WHITE,
        result: Result.UNKNOWN,
        moveCount: 0
      };
    }
  }

  public pieces(pieces: Piece[]): BoardBuilder {
    this._board.pieces = pieces;
    return this;
  }

  public removePiece(pieceToRemove: Piece): BoardBuilder {
    this._board.pieces = this._board.pieces.filter(piece => !SquareUtils.squareEquals(piece.position, pieceToRemove.position));
    return this;
  }

  public removePieceOnSquare(square: Square): BoardBuilder {
    this._board.pieces = this._board.pieces.filter(piece => !SquareUtils.squareEquals(piece.position, square));
    return this;
  }

  public addPiece(piece: Piece): BoardBuilder {
    this._board.pieces.push(piece);

    return this;
  }

  /** Makes a move, and saves all information necessary
    * to a StateInfo object. The move is assumed to be legal. Pseudo-legal
    * moves should be filtered out before this function is called.
    */
  public movePiece(move: Move, stateInfo: StateInfo, givesCheck: boolean): BoardBuilder {
    LoggingUtils.log(LogLevel.INFO, () => "movePiece: " + JSON.stringify(move));

    stateInfo.previous

    if (stateInfo.dirtyPiece.dirty_num === 1) {
      this.addPiece(stateInfo.dirtyPiece.piece[0]);
      this.removePieceOnSquare(stateInfo.dirtyPiece.from[0]);
    }

    // if (!move.isPromotion()) {
    //   stateInfo.dirtyPiece.dirty_num

    //   this.removePieceOnSquare(move.fromSquare());
    //   this.addPiece(move.piece);
    // }
    // else {
    //   this.removePiece(move.piece);
    //   this.removePiece(move.promotedPiece);
    //   move.promotedPiece.position = move.to;
    //   this.addPiece(move.promotedPiece);
    // }

    return this;
  }

  public capturePiece(move: Move): BoardBuilder {
    LoggingUtils.log(LogLevel.INFO, () => "capturePiece: " + JSON.stringify(move));
    this.removePiece(move.piece);

    if (move.capturedPiece !== undefined) {
      this.removePiece(move.capturedPiece);
    }
    move.piece.position = move.to;
    return this.addPiece(move.promotedPiece ? move.promotedPiece : move.piece);
  }

  public setCastleRights(castlingRights: CastlingRights): BoardBuilder {
    this._board.castlingRights = castlingRights;
    return this;
  }

  public clearCastleRights(player: Color): BoardBuilder {
    if (player === Color.WHITE) {
      this._board.castlingRights &= ~CastlingRights.WHITE_CASTLING;
    }
    else {
      this._board.castlingRights &= ~CastlingRights.BLACK_CASTLING;
    }
    return this;
  }

  public moveCount(moveCount: number): BoardBuilder {
    this._board.moveCount = moveCount;
    return this;
  }

  public enPassantSquare(enPassantSquare: Square | undefined): BoardBuilder {
    this._board.enPassantSquare = enPassantSquare;
    return this;
  }

  public clearEnPassantSquares(): BoardBuilder {
    this._board.enPassantSquare = undefined;
    return this;
  }

  public playerToMove(playerToMove: Color): BoardBuilder {
    this._board.playerToMove = playerToMove;
    return this;
  }

  public togglePlayerToMove(): BoardBuilder {
    return this.playerToMove(this._board.playerToMove === Color.WHITE ? Color.BLACK : Color.WHITE);
  }

  public result(result: Result): BoardBuilder {
    this._board.result = result;
    return this;
  }

  public plyCount(plyCount: number): BoardBuilder {
    this._board.plyCount = plyCount;
    return this;
  }

  public build(): Board {
    return CopyUtils.copyBoard(this._board);
  }
}