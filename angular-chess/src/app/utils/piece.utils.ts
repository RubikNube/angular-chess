import { Board, Color, Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import PositionUtils from "./position.utils";

export default class PieceUtils {
  public static pieceEquals(a: Piece, b: Piece) {
    return a.color === b.color && a.type === b.type && PositionUtils.positionEquals(a.position, b.position);
  }

  public static getOpposedColor(color: Color) {
    return color === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  public static getPieceChar(type: PieceType, color: Color): string {
    if (color === Color.WHITE) {
      switch (type) {
        case PieceType.PAWN:
          return 'p';
        case PieceType.KNIGHT:
          return 'n';
        case PieceType.BISHOP:
          return 'b';
        case PieceType.ROOK:
          return 'r';
        case PieceType.QUEEN:
          return 'q';
        case PieceType.KING:
          return 'k';
      }
    }
    else {
      switch (type) {
        case PieceType.PAWN:
          return 'o';
        case PieceType.KNIGHT:
          return 'm';
        case PieceType.BISHOP:
          return 'v';
        case PieceType.ROOK:
          return 't';
        case PieceType.QUEEN:
          return 'w';
        case PieceType.KING:
          return 'l';
      }
    }
  }

  public static getPieceFenChar(type: PieceType, color: Color): string {
    let typeChar = "";

    switch (type) {
      case PieceType.PAWN:
        typeChar = 'P';
        break;
      case PieceType.KNIGHT:
        typeChar = 'N';
        break;
      case PieceType.BISHOP:
        typeChar = 'B';
        break;
      case PieceType.ROOK:
        typeChar = 'R';
        break;
      case PieceType.QUEEN:
        typeChar = 'Q';
        break;
      case PieceType.KING:
        typeChar = 'K';
        break;
    }

    return color === Color.WHITE ? typeChar : typeChar.toLowerCase();
  }

  public static getPieceType(pieceName: string) {
    switch (pieceName) {
      case "QUEEN":
        return PieceType.QUEEN;
      case "ROOK":
        return PieceType.ROOK;
      case "BISHOP":
        return PieceType.BISHOP;
      case "KNIGHT":
        return PieceType.KNIGHT;
      default:
        return PieceType.QUEEN;
    }
  }

  public static getPieceTypeFromMoveString(moveString: string): PieceType | undefined {
    if (!moveString || moveString.length === 0) {
      return undefined;
    }

    if (moveString === 'O-O' || moveString === 'O-O-O') {
      return PieceType.KING;
    }

    const firstChar = moveString[0];

    switch (firstChar) {
      case "Q":
        return PieceType.QUEEN;
      case "K":
        return PieceType.KING;
      case "R":
        return PieceType.ROOK;
      case "B":
        return PieceType.BISHOP;
      case "N":
        return PieceType.KNIGHT;
      default:
        return PieceType.PAWN;
    }
  }

  public static sortPieces(pieces: Piece[] | undefined): Piece[] {
    if (pieces === undefined) {
      return [];
    }

    return pieces.sort((a, b) => {
      if (a.position.row < b.position.row) {
        return -1;
      }
      if (a.position.row > b.position.row) {
        return 1;
      }
      if (a.position.column < b.position.column) {
        return -1;
      }
      if (a.position.column > b.position.column) {
        return 1;
      }
      return 0;
    });
  }

  public static isPinnedDiagonally(position: Position, board: Board): boolean {
    // get piece on position
    const piece = PositionUtils.getPieceOnPos(board, position);
    if (!piece) {
      return false;
    }

    // get diagonal squares for piece
    const lowerToUpperDiagonal: Position[] = PositionUtils.getLowerToUpperDiagonal(piece.position);
    const upperToLowerDiagonal: Position[] = PositionUtils.getUpperToLowerDiagonal(piece.position);

    // get pieces on diagonals
    const lowerToUpperDiagonalPieces: Piece[] = lowerToUpperDiagonal.map((position) => PositionUtils.getPieceOnPos(board, position)!).filter((piece) => piece !== undefined);
    const upperToLowerDiagonalPieces: Piece[] = upperToLowerDiagonal.map((position) => PositionUtils.getPieceOnPos(board, position)!).filter((piece) => piece !== undefined);

    // are king and opposite colored diagonal moving piece on diagonal?
    const lowerToUpperDiagonalKing = lowerToUpperDiagonalPieces.find((diagonalPiece) => diagonalPiece.type === PieceType.KING && diagonalPiece.color === piece.color);
    const upperToLowerDiagonalKing = upperToLowerDiagonalPieces.find((diagonalPiece) => diagonalPiece.type === PieceType.KING && diagonalPiece.color === piece.color);
    const lowerToUpperDiagonalOpponent = lowerToUpperDiagonalPieces.find((diagonalPiece) => diagonalPiece.color !== piece.color && (diagonalPiece.type === PieceType.BISHOP || diagonalPiece.type === PieceType.QUEEN));
    const upperToLowerDiagonalOpponent = upperToLowerDiagonalPieces.find((diagonalPiece) => diagonalPiece.color !== piece.color && (diagonalPiece.type === PieceType.BISHOP || diagonalPiece.type === PieceType.QUEEN));

    if (lowerToUpperDiagonalKing && lowerToUpperDiagonalOpponent) {
      // check if piece is between king and opponent
      const kingIndex = lowerToUpperDiagonalPieces.indexOf(lowerToUpperDiagonalKing);
      const opponentIndex = lowerToUpperDiagonalPieces.indexOf(lowerToUpperDiagonalOpponent);
      const pieceIndex = lowerToUpperDiagonalPieces.indexOf(piece);

      if (pieceIndex > kingIndex && pieceIndex < opponentIndex) {
        // check if other pieces are between king and opponent
        const piecesBetweenKingAndOpponent = lowerToUpperDiagonalPieces.slice(kingIndex + 1, opponentIndex);
        if (piecesBetweenKingAndOpponent.length === 1) {
          return true;
        }
      }
    }

    if (upperToLowerDiagonalKing && upperToLowerDiagonalOpponent) {
      // check if piece is between king and opponent
      const kingIndex = upperToLowerDiagonalPieces.indexOf(upperToLowerDiagonalKing);
      const opponentIndex = upperToLowerDiagonalPieces.indexOf(upperToLowerDiagonalOpponent);
      const pieceIndex = upperToLowerDiagonalPieces.indexOf(piece);

      if (pieceIndex > kingIndex && pieceIndex < opponentIndex) {
        // check if other pieces are between king and opponent
        const piecesBetweenKingAndOpponent = upperToLowerDiagonalPieces.slice(kingIndex + 1, opponentIndex);
        if (piecesBetweenKingAndOpponent.length === 1) {
          return true;
        }
      }
    }

    return false;
  }
}