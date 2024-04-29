import { Board, CastleRights, Position, Result } from "../types/board.t";
import { Color } from "../types/compressed.types.t";
import { Move, Piece } from "../types/pieces.t";
import CopyUtils from "../utils/copy.utils";
import LoggingUtils, { LogLevel } from "../utils/logging.utils";
import PositionUtils from "../utils/position.utils";

/** A builder that is responsible for creating the board.*/
export class BoardBuilder {
  private readonly _board: Board;

  constructor(board?: Board) {
    if (board) {
      this._board = CopyUtils.deepCopyElement(board);
    }
    else {
      this._board = {
        pieces: [],
        whiteCastleRights: { player: Color.WHITE, canLongCastle: true, canShortCastle: true },
        blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
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
    this._board.pieces = this._board.pieces.filter(piece => !PositionUtils.positionEquals(piece.position, pieceToRemove.position));
    return this;
  }

  public addPiece(piece: Piece): BoardBuilder {
    this._board.pieces.push(piece);

    return this;
  }

  public movePiece(move: Move): BoardBuilder {
    LoggingUtils.log(LogLevel.INFO, () => "movePiece: " + JSON.stringify(move));

    if (!move.promotedPiece) {
      this.removePiece(move.piece);
      move.piece.position = move.to;
      this.addPiece(move.piece);
    }
    else {
      this.removePiece(move.piece);
      this.removePiece(move.promotedPiece);
      move.promotedPiece.position = move.to;
      this.addPiece(move.promotedPiece);
    }

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

  public whiteCastleRights(whiteCastleRights: CastleRights): BoardBuilder {
    this._board.whiteCastleRights = whiteCastleRights;
    return this;
  }

  public blackCastleRights(blackCastleRights: CastleRights): BoardBuilder {
    this._board.blackCastleRights = blackCastleRights;
    return this;
  }

  public setCastleRights(castleRights: CastleRights): BoardBuilder {
    return castleRights.player === Color.WHITE ? this.whiteCastleRights(castleRights) : this.blackCastleRights(castleRights);
  }

  public moveCount(moveCount: number): BoardBuilder {
    this._board.moveCount = moveCount;
    return this;
  }

  public enPassantSquare(enPassantSquare: Position | undefined): BoardBuilder {
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
    return CopyUtils.deepCopyElement(this._board);
  }
}