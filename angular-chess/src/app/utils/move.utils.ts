import { PieceType, Square } from "../types/compressed.types.t";
import { Move } from "../types/pieces.t";
import PieceUtils from "./piece.utils";
import SquareUtils from "./square.utils";

export enum MoveRepresentationConfig {
  INCLUDE_FROM_COLUMN,
  INCLUDE_FROM_ROW
}

export default class MoveUtils {
  public static moveToUci(move: Move): string {
    let uci: string = (SquareUtils.getSquareRepresentation(move.from) ?? '') + (SquareUtils.getSquareRepresentation(move.to) ?? '');
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
        return SquareUtils.getColumnString(move.from) + "x" + SquareUtils.getSquareRepresentation(move.to) + this.getCheckOrMateRepresentation(move);
      } else {
        return this.getEnglishPieceChar(move.piece.type) + this.getFromRepresentation(move.from, represenationConfig) + "x" + SquareUtils.getSquareRepresentation(move.to) + this.getCheckOrMateRepresentation(move);
      }
    }

    const toRepresentation = move.to ? SquareUtils.getSquareRepresentation(move.to) : "";


    return this.getEnglishPieceChar(move.piece.type) + this.getFromRepresentation(move.from, represenationConfig) + toRepresentation + this.getCheckOrMateRepresentation(move);
  }

  private static getFromRepresentation(fromProsition: Square, represenationConfig?: MoveRepresentationConfig): string {
    if (represenationConfig === undefined) {
      return '';
    } else if (represenationConfig === MoveRepresentationConfig.INCLUDE_FROM_COLUMN) {
      return SquareUtils.getColumnString(fromProsition) + '';
    } else {
      return SquareUtils.getRowString(fromProsition) + '';
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
      return SquareUtils.getSquareRepresentation(move?.from) + this.getMoveDelimiter(move) + SquareUtils.getSquareRepresentation(move?.to) + this.getEnPassantRepresentation(move);
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

    let checkOrMateRepresentation = "";
    if (move.isCheck) {
      checkOrMateRepresentation = move.isMate ? "#" : "+";
    }
    return checkOrMateRepresentation;
  }

  private static getMoveDelimiter(move: Move): string {
    return move.capturedPiece === undefined ? "-" : "x";
  }

  private static getEnPassantRepresentation(move: Move): string {
    return move.isEnPassant ? " e.p" : "";
  }
}