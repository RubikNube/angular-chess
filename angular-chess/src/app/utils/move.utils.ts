import { Position } from "../types/board.t";
import { Move, PieceType } from "../types/pieces.t";
import PieceUtils from "./piece.utils";
import PositionUtils from "./position.utils";

export enum MoveRepresentationConfig {
  INCLUDE_FROM_COLUMN,
  INCLUDE_FROM_ROW
}

export default class MoveUtils {
  public static moveToUci(move: Move): string {
    let uci: string = PositionUtils.getCoordinate(move.from) + PositionUtils.getCoordinate(move.to);
    if (move.promotedPiece !== undefined) {
      uci += move.promotedPiece.type;
    }
    return uci;
  }

  public static getSimpleMoveRepresentation(move: Move | undefined, represenationConfig?: MoveRepresentationConfig): string {
    if (move === undefined) {
      return "";
    }

    if (move?.isShortCastle) {
      return "O-O";
    } else if (move?.isLongCastle) {
      return "O-O-O";
    }

    if (move.capturedPiece !== undefined) {
      if (move.piece.type === PieceType.PAWN) {
        return PositionUtils.getColumnString(move.from) + "x" + PositionUtils.getCoordinate(move.to);
      } else {
        return this.getEnglishPieceChar(move.piece.type) + this.getFromRepresentation(move.from, represenationConfig) + "x" + PositionUtils.getCoordinate(move.to);
      }
    }

    const toRepresentation = move.to ? PositionUtils.getCoordinate(move.to) : "";


    return this.getEnglishPieceChar(move.piece.type) + this.getFromRepresentation(move.from, represenationConfig) + toRepresentation;
  }

  private static getFromRepresentation(fromProsition: Position, represenationConfig?: MoveRepresentationConfig): string {
    if (represenationConfig === undefined) {
      return '';
    } else if (represenationConfig === MoveRepresentationConfig.INCLUDE_FROM_COLUMN) {
      return PositionUtils.getColumnString(fromProsition) + '';
    } else {
      return fromProsition.row + '';
    }
  }

  private static getEnglishPieceChar(type: PieceType): string {
    switch (type) {
      case PieceType.KING:
        return "K";
      case PieceType.QUEEN:
        return "Q";
      case PieceType.ROOK:
        return "R";
      case PieceType.BISHOP:
        return "B";
      case PieceType.KNIGHT:
        return "N";
      default:
        return "";
    }
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