import { Move } from "../types/pieces.t";
import PieceUtils from "./piece.utils";
import PositionUtils from "./position.utils";

export default class MoveUtils {
  public static moveToUci(move: Move): string {
    let uci: string = PositionUtils.getCoordinate(move.from) + PositionUtils.getCoordinate(move.to);
    if (move.promotedPiece !== undefined) {
      uci += move.promotedPiece.type;
    }
    return uci;
  }

  public static getMoveRepresentation(move: Move): string {
    if (move === undefined) {
      return "";
    }
    else if (move?.isShortCastle) {
      return "O-O";
    } else if (move?.isLongCastle) {
      return "O-O-O";
    } else {
      return PositionUtils.getCoordinate(move?.from) + this.getMoveDelimiter(move) + PositionUtils.getCoordinate(move?.to) + this.getEnPassantRepresentation(move);
    }
  }

  public static getPromotionRepresentation(move: Move | undefined): string {
    if (move === undefined) {
      return "";
    }

    return move.promotedPiece ? "=" + PieceUtils.getPieceChar(move.promotedPiece.type, move.promotedPiece.color) : "";
  }

  public static getPieceChar(move: Move): string {
    if (move === undefined) {
      return "";
    }

    if (move?.isLongCastle || move?.isShortCastle) {
      return "";
    }
    else {
      return PieceUtils.getPieceChar(move.piece.type, move.piece.color);
    }
  }

  public static getCheckOrMateRepresentation(move: Move | undefined): string {
    if (move === undefined) {
      return "";
    }

    return move.isCheck ? move.isMate ? "#" : " +" : "";
  }

  private static getMoveDelimiter(move: Move): string {
    return move.capturedPiece === undefined ? "-" : "x";
  }

  private static getEnPassantRepresentation(move: Move): string {
    return move.isEnPassant ? " e.p" : "";
  }
}