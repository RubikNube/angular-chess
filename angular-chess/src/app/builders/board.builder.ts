import { Board, CastleRights, Color, Position, Result } from "../types/board.t";
import { Piece } from "../types/pieces.t";

export class BoardBuilder {
  private readonly board: Board;

  constructor() {
    this.board = {
      pieces: [],
      whiteCastleRights: { player: Color.WHITE, canLongCastle: true, canShortCastle: true },
      blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
      playerToMove: Color.WHITE,
      result: Result.UNKNOWN,
      moveCount: 0
    };
  }

  public pieces(pieces: Piece[]): BoardBuilder {
    this.board.pieces = pieces;
    return this;
  }

  public whiteCastleRights(whiteCastleRights: CastleRights): BoardBuilder {
    this.board.whiteCastleRights = whiteCastleRights;
    return this;
  }

  public blackCastleRights(blackCastleRights: CastleRights): BoardBuilder {
    this.board.blackCastleRights = blackCastleRights;
    return this;
  }

  public moveCount(moveCount: number): BoardBuilder {
    this.board.moveCount = moveCount;
    return this;
  }

  public enPassantSquare(enPassantSquare: Position | undefined): BoardBuilder {
    this.board.enPassantSquare = enPassantSquare;
    return this;
  }

  public playerToMove(playerToMove: Color): BoardBuilder {
    this.board.playerToMove = playerToMove;
    return this;
  }

  public result(result: Result): BoardBuilder {
    this.board.result = result;
    return this;
  }

  public plyCount(plyCount: number): BoardBuilder {
    this.board.plyCount = plyCount;
    return this;
  }

  public build(): Board {
    return this.board;
  }
}