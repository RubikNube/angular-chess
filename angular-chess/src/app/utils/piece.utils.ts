import { Board, Color, Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import CopyUtils from "./copy.utils";
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

    return this.isPiecePinned(piece, board, lowerToUpperDiagonal, [PieceType.BISHOP, PieceType.QUEEN]) ||
      this.isPiecePinned(piece, board, upperToLowerDiagonal, [PieceType.BISHOP, PieceType.QUEEN]);
  }

  private static isPiecePinned(piece: Piece, board: Board, lineOrDiagonal: Position[], pieceTypes: PieceType[]): boolean {
    const pieces: Piece[] = lineOrDiagonal.map((position) => PositionUtils.getPieceOnPos(board, position)!).filter((piece) => piece !== undefined);
    const opponents = pieces.filter((diagonalPiece) => diagonalPiece.color !== piece.color && pieceTypes.includes(diagonalPiece.type));
    const king = pieces.find((diagonalPiece) => diagonalPiece.type === PieceType.KING && diagonalPiece.color === piece.color);

    // are king and opposite colored diagonal moving piece on same diagonal?
    if (king && opponents.length > 0) {
      for (const opponent of opponents) {
        const piecesBetweenKingAndOpponent = this.getPiecesBetweenKingAndOpponent(king, opponent, piece, pieces);

        if (piecesBetweenKingAndOpponent.length === 1) {
          return true;
        }
      }
    }

    return false;
  }

  private static getPiecesBetweenKingAndOpponent(king: Piece, opponent: Piece, piece: Piece, pieces: Piece[]): Piece[] {
    const kingIndex = pieces.indexOf(king);
    const opponentIndex = pieces.indexOf(opponent);
    const pieceIndex = pieces.indexOf(piece);

    if (pieceIndex > kingIndex && pieceIndex < opponentIndex) {
      return pieces.slice(kingIndex + 1, opponentIndex);
    }
    else if (pieceIndex < kingIndex && pieceIndex > opponentIndex) {
      return pieces.slice(opponentIndex + 1, kingIndex);
    }
    return [];
  }

  public static isPinnedHorizontally(position: Position, board: Board): boolean {
    const piece = PositionUtils.getPieceOnPos(board, position);
    if (!piece) {
      return false;
    }

    const horizontalSquares: Position[] = PositionUtils.getHorizontalSquares(piece.position);

    return this.isPiecePinned(piece, board, horizontalSquares, [PieceType.ROOK, PieceType.QUEEN]);
  }

  public static isPinnedVertically(position: Position, board: Board): boolean {
    const piece = PositionUtils.getPieceOnPos(board, position);
    if (!piece) {
      return false;
    }

    const verticalSquares: Position[] = PositionUtils.getVerticalSquares(piece.position);

    return this.isPiecePinned(piece, board, verticalSquares, [PieceType.ROOK, PieceType.QUEEN]);
  }

  /** returns the pieces sorted by the distance to the given piece */
  public static sortByDistanceToPiece(piece: Piece, pieces: Piece[]): Piece[] {
    // deep copy the pieces by using CopyUtils
    const piecesToSort: Piece[] = CopyUtils.deepCopyElement(pieces);

    return piecesToSort.sort((a, b) => {
      const aDistance = Math.abs(a.position.column - piece.position.column) + Math.abs(a.position.row - piece.position.row);
      const bDistance = Math.abs(b.position.column - piece.position.column) + Math.abs(b.position.row - piece.position.row);

      if (aDistance < bDistance) {
        return -1;
      }
      if (aDistance > bDistance) {
        return 1;
      }
      return 0;
    });
  }
}