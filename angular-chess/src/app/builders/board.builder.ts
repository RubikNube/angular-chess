import { Board, CastleRights, Color, Position, Result } from "../types/board.t";
import { Move, Piece } from "../types/pieces.t";
import CopyUtils from "../utils/copy.utils";
import PieceUtils from "../utils/piece.utils";

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

  public removePiece(draggedPiece: Piece): BoardBuilder {
    let index = -1;
    let currentPieces = this._board.pieces;

    for (let i = 0; i < currentPieces.length; i++) {
      const piece = currentPieces[i];

      if (PieceUtils.pieceEquals(piece, draggedPiece)) {
        index = i;
      }
    }

    const printedPiece: string = JSON.stringify({ pieces: currentPieces, piece: draggedPiece, index: index });
    console.log("removePiece " + printedPiece);

    if (index > -1) {
      currentPieces.splice(index, 1);

      return this.pieces(currentPieces);
    } else {
      console.error("Could not remove piece " + printedPiece);
      return this;
    }
  }

  public addPiece(piece: Piece): BoardBuilder {
    this._board.pieces.push(piece);

    return this;
  }

  public movePiece(move: Move): BoardBuilder {
    console.log("movePiece: " + JSON.stringify(move));

    this.removePiece(move.piece);
    move.piece.position = move.to;
    this.addPiece(move.promotedPiece ? move.promotedPiece : move.piece);

    return this;
  }

  public capturePiece(move: Move): BoardBuilder {
    console.log("capturePiece: " + JSON.stringify(move));
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