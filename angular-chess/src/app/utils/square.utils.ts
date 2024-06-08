import { Board } from "../types/board.t";
import { Color, Direction, File, Move, Rank, Square } from "../types/compressed.types.t";
import { Piece } from "../types/pieces.t";
import BoardUtils from "./board.utils";


export type Position = {
  row: number;
  column: number
}

export default class SquareUtils {
  /**
   * Returns the relative square based on the given square and color.
   * @param square The square to calculate the relative square for.
   * @param color The color of the piece on the square.
   * @returns The relative square.
   */
  public static getRelativeSquare(square: Square, color: Color): Square {
    return (square ^ (color * 56));
  }

  /**
   * Sorts an array of squares in ascending order.
   *
   * @param squares - The array of squares to be sorted.
   * @returns The sorted array of squares.
   */
  public static sortSquares(squares: Square[]): Square[] {
    return squares.sort((a, b) => a - b);
  }

  /**
   * Returns the representation of a square.
   *
   * @param square - The square to get the representation for.
   * @returns The representation of the square.
   */
  public static getSquareRepresentation(square: Square): string | undefined {
    switch (square) {
      case Square.SQ_A1: return "a1";
      case Square.SQ_A2: return "a2";
      case Square.SQ_A3: return "a3";
      case Square.SQ_A4: return "a4";
      case Square.SQ_A5: return "a5";
      case Square.SQ_A6: return "a6";
      case Square.SQ_A7: return "a7";
      case Square.SQ_A8: return "a8";
      case Square.SQ_B1: return "b1";
      case Square.SQ_B2: return "b2";
      case Square.SQ_B3: return "b3";
      case Square.SQ_B4: return "b4";
      case Square.SQ_B5: return "b5";
      case Square.SQ_B6: return "b6";
      case Square.SQ_B7: return "b7";
      case Square.SQ_B8: return "b8";
      case Square.SQ_C1: return "c1";
      case Square.SQ_C2: return "c2";
      case Square.SQ_C3: return "c3";
      case Square.SQ_C4: return "c4";
      case Square.SQ_C5: return "c5";
      case Square.SQ_C6: return "c6";
      case Square.SQ_C7: return "c7";
      case Square.SQ_C8: return "c8";
      case Square.SQ_D1: return "d1";
      case Square.SQ_D2: return "d2";
      case Square.SQ_D3: return "d3";
      case Square.SQ_D4: return "d4";
      case Square.SQ_D5: return "d5";
      case Square.SQ_D6: return "d6";
      case Square.SQ_D7: return "d7";
      case Square.SQ_D8: return "d8";
      case Square.SQ_E1: return "e1";
      case Square.SQ_E2: return "e2";
      case Square.SQ_E3: return "e3";
      case Square.SQ_E4: return "e4";
      case Square.SQ_E5: return "e5";
      case Square.SQ_E6: return "e6";
      case Square.SQ_E7: return "e7";
      case Square.SQ_E8: return "e8";
      case Square.SQ_F1: return "f1";
      case Square.SQ_F2: return "f2";
      case Square.SQ_F3: return "f3";
      case Square.SQ_F4: return "f4";
      case Square.SQ_F5: return "f5";
      case Square.SQ_F6: return "f6";
      case Square.SQ_F7: return "f7";
      case Square.SQ_F8: return "f8";
      case Square.SQ_G1: return "g1";
      case Square.SQ_G2: return "g2";
      case Square.SQ_G3: return "g3";
      case Square.SQ_G4: return "g4";
      case Square.SQ_G5: return "g5";
      case Square.SQ_G6: return "g6";
      case Square.SQ_G7: return "g7";
      case Square.SQ_G8: return "g8";
      case Square.SQ_H1: return "h1";
      case Square.SQ_H2: return "h2";
      case Square.SQ_H3: return "h3";
      case Square.SQ_H4: return "h4";
      case Square.SQ_H5: return "h5";
      case Square.SQ_H6: return "h6";
      case Square.SQ_H7: return "h7";
      case Square.SQ_H8: return "h8";
      default: return undefined;
    }
  }

  /**
   * Converts a coordinate string to a Square object.
   * @param coordinate - The coordinate string representing a square on the chessboard.
   * @returns The Square object corresponding to the given coordinate.
   */
  public static getSquareFromCoordinate(coordinate: string): Square {
    switch (coordinate) {
      case "a1": return Square.SQ_A1;
      case "a2": return Square.SQ_A2;
      case "a3": return Square.SQ_A3;
      case "a4": return Square.SQ_A4;
      case "a5": return Square.SQ_A5;
      case "a6": return Square.SQ_A6;
      case "a7": return Square.SQ_A7;
      case "a8": return Square.SQ_A8;
      case "b1": return Square.SQ_B1;
      case "b2": return Square.SQ_B2;
      case "b3": return Square.SQ_B3;
      case "b4": return Square.SQ_B4;
      case "b5": return Square.SQ_B5;
      case "b6": return Square.SQ_B6;
      case "b7": return Square.SQ_B7;
      case "b8": return Square.SQ_B8;
      case "c1": return Square.SQ_C1;
      case "c2": return Square.SQ_C2;
      case "c3": return Square.SQ_C3;
      case "c4": return Square.SQ_C4;
      case "c5": return Square.SQ_C5;
      case "c6": return Square.SQ_C6;
      case "c7": return Square.SQ_C7;
      case "c8": return Square.SQ_C8;
      case "d1": return Square.SQ_D1;
      case "d2": return Square.SQ_D2;
      case "d3": return Square.SQ_D3;
      case "d4": return Square.SQ_D4;
      case "d5": return Square.SQ_D5;
      case "d6": return Square.SQ_D6;
      case "d7": return Square.SQ_D7;
      case "d8": return Square.SQ_D8;
      case "e1": return Square.SQ_E1;
      case "e2": return Square.SQ_E2;
      case "e3": return Square.SQ_E3;
      case "e4": return Square.SQ_E4;
      case "e5": return Square.SQ_E5;
      case "e6": return Square.SQ_E6;
      case "e7": return Square.SQ_E7;
      case "e8": return Square.SQ_E8;
      case "f1": return Square.SQ_F1;
      case "f2": return Square.SQ_F2;
      case "f3": return Square.SQ_F3;
      case "f4": return Square.SQ_F4;
      case "f5": return Square.SQ_F5;
      case "f6": return Square.SQ_F6;
      case "f7": return Square.SQ_F7;
      case "f8": return Square.SQ_F8;
      case "g1": return Square.SQ_G1;
      case "g2": return Square.SQ_G2;
      case "g3": return Square.SQ_G3;
      case "g4": return Square.SQ_G4;
      case "g5": return Square.SQ_G5;
      case "g6": return Square.SQ_G6;
      case "g7": return Square.SQ_G7;
      case "g8": return Square.SQ_G8;
      case "h1": return Square.SQ_H1;
      case "h2": return Square.SQ_H2;
      case "h3": return Square.SQ_H3;
      case "h4": return Square.SQ_H4;
      case "h5": return Square.SQ_H5;
      case "h6": return Square.SQ_H6;
      case "h7": return Square.SQ_H7;
      case "h8": return Square.SQ_H8;
      default: return Square.SQ_NONE;
    }
  }

  /**
   * Compares two squares and returns a number indicating their order.
   * @returns A function that compares two squares and returns a number.
   */
  public static compareSquares(): ((a: Square, b: Square) => number) {
    return (a: Square, b: Square) => a - b;
  }

  /**
   * Filters out squares that are being attacked from a list of moves.
   * @param moves - The list of moves to filter.
   * @param attackedSquares - The list of squares that are being attacked.
   * @returns The filtered list of moves that do not include attacked squares.
   */
  public static filterOutAttackedSquares(moves: Move[], attackedSquares: Square[]): Move[] {
    return moves.filter(move => !attackedSquares.includes(move.toSquare()));
  }


  /**
   * Returns an array of squares that are diagonally between two given squares.
   *
   * @param squareA - The first square.
   * @param squareB - The second square.
   * @returns An array of squares between `squareA` and `squareB`.
   */
  public static getDiagonalSquaresBetween(squareA: Square, squareB: Square): Square[] {
    const relativeDirection = this.getRelativeDirection(squareA, squareB);

    if (!SquareUtils.onSameDiagonal(squareA, squareB)) {
      return [];
    }

    if (Direction.NORTH_EAST === relativeDirection
      || Direction.SOUTH_WEST === relativeDirection
      || Direction.NORTH_WEST === relativeDirection
      || Direction.SOUTH_EAST === relativeDirection) {
      return this.getSquaresInDirectionBetween(squareA, squareB, relativeDirection);
    }

    return [];
  }

  /**
   * Checks if two squares are on the same diagonal.
   *
   * @param squareA - The first square.
   * @param squareB - The second square.
   * @returns A boolean indicating whether the squares are on the same diagonal.
   */
  public static onSameDiagonal(squareA: Square, squareB: Square): boolean {
    return Math.abs(this.fileOf(squareA) - this.fileOf(squareB)) === Math.abs(this.rankOf(squareA) - this.rankOf(squareB));
  }

  private static getSquaresInDirectionBetween(squareA: Square, squareB: Square, direction: Direction): Square[] {
    const squares: Square[] = [];

    let oldSquare = squareA;
    let nextSquare = SquareUtils.getSquareInDirection(squareA, direction);

    while (nextSquare !== squareB && SquareUtils.isOnBoard(nextSquare) && BoardUtils.getDistanceOfSquares(oldSquare, nextSquare) === 1) {
      squares.push(nextSquare);
      oldSquare = nextSquare;
      nextSquare = SquareUtils.getSquareInDirection(nextSquare, direction);
    }

    return squares;
  }

  /**
   * Returns the square in the specified direction from the given square.
   *
   * @param square The starting square.
   * @param direction The direction to move in.
   * @returns The square in the specified direction from the starting square.
   */
  public static getSquareInDirection(square: Square, direction: Direction): Square {
    return square + direction;
  }

  /**
   * Returns an array of squares that are vertically between the given start and end positions.
   * 
   * @param squareA - The starting position.
   * @param squareB - The ending position.
   * @returns An array of squares between the given start and end positions.
   */
  public static getVerticalSquaresBetween(squareA: Square, squareB: Square): Square[] {
    const fileOfA = this.fileOf(squareA);
    const fileOfB = this.fileOf(squareB);

    if (fileOfA === fileOfB) {
      if (this.rankOf(squareA) < this.rankOf(squareB)) {
        const squares: Square[] = [];
        let inbetweenSquare = this.getSquareInDirection(squareA, Direction.NORTH);
        while (inbetweenSquare !== squareB) {
          squares.push(inbetweenSquare);
          inbetweenSquare = this.getSquareInDirection(inbetweenSquare, Direction.NORTH);
        }
        return squares;
      } else {
        const squares: Square[] = [];
        let inbetweenSquare = this.getSquareInDirection(squareA, Direction.SOUTH);
        while (inbetweenSquare !== squareB) {
          squares.push(inbetweenSquare);
          inbetweenSquare = this.getSquareInDirection(inbetweenSquare, Direction.SOUTH);
        }
        return squares;
      }
    }
    else {
      return [];
    }
  }

  /**
   * Returns an array of squares that are horizontally between the given two squares.
   *
   * @param squareA - The starting square.
   * @param squareB - The ending square.
   * @returns An array of squares between `squareA` and `squareB`.
   */
  public static getHorizontalSquaresBetween(squareA: Square, squareB: Square): Square[] {
    const rankOfA = this.rankOf(squareA);
    const rankOfB = this.rankOf(squareB);

    if (rankOfA === rankOfB) {
      if (this.fileOf(squareA) < this.fileOf(squareB)) {
        const squares: Square[] = [];
        let inbetweenSquare = this.getSquareInDirection(squareA, Direction.EAST);
        while (inbetweenSquare !== squareB) {
          squares.push(inbetweenSquare);
          inbetweenSquare = this.getSquareInDirection(inbetweenSquare, Direction.EAST);
        }
        return squares;
      } else {
        const squares: Square[] = [];
        let inbetweenSquare = this.getSquareInDirection(squareA, Direction.WEST);
        while (inbetweenSquare !== squareB) {
          squares.push(inbetweenSquare);
          inbetweenSquare = this.getSquareInDirection(inbetweenSquare, Direction.WEST);
        }
        return squares;
      }
    }
    else {
      return [];
    }
  }

  /**
   * Returns an array of squares representing the upper to lower diagonal from the given position.
   * 
   * @param square - The starting position.
   * @returns An array of squares representing the upper to lower diagonal.
   */
  public static getUpperToLowerDiagonal(square: Square): Square[] {
    const squares: Square[] = [];

    squares.push(square);

    let oldSquare = square;
    let nextSquare = this.getSquareInDirection(square, Direction.NORTH_WEST);

    while (this.isOnBoard(nextSquare) && this.getRelativeDirection(oldSquare, nextSquare) === Direction.NORTH_WEST) {
      squares.push(nextSquare);
      oldSquare = nextSquare;
      nextSquare = this.getSquareInDirection(nextSquare, Direction.NORTH_WEST);
    }

    oldSquare = square;
    nextSquare = this.getSquareInDirection(square, Direction.SOUTH_EAST);
    while (this.isOnBoard(nextSquare) && this.getRelativeDirection(oldSquare, nextSquare) === Direction.SOUTH_EAST) {
      squares.push(nextSquare);
      oldSquare = nextSquare;
      nextSquare = this.getSquareInDirection(nextSquare, Direction.SOUTH_EAST);
    }

    return squares;
  }

  /**
   * Calculates the relative direction between two squares.
   *
   * @param squareA - The first square.
   * @param squareB - The second square.
   * @returns The relative direction between the two squares.
   */
  public static getRelativeDirection(squareA: Square, squareB: Square): Direction {
    const fileA = this.fileOf(squareA);
    const fileB = this.fileOf(squareB);
    const rankA = this.rankOf(squareA);
    const rankB = this.rankOf(squareB);

    if (fileA === fileB && rankA < rankB) {
      return Direction.NORTH;
    }
    if (fileA === fileB && rankA > rankB) {
      return Direction.SOUTH;
    }
    if (rankA === rankB && fileA < fileB) {
      return Direction.EAST;
    }
    if (rankA === rankB && fileA > fileB) {
      return Direction.WEST;
    }
    if (fileA < fileB && rankA < rankB) {
      return Direction.NORTH_EAST;
    }
    if (fileA < fileB && rankA > rankB) {
      return Direction.SOUTH_EAST;
    }
    if (fileA > fileB && rankA < rankB) {
      return Direction.NORTH_WEST;
    }
    if (fileA > fileB && rankA > rankB) {
      return Direction.SOUTH_WEST;
    }

    return Direction.NONE;
  }

  /**
   * Returns an array of squares representing the lower-to-upper diagonal from the given square.
   *
   * @param square The starting square.
   * @returns An array of squares representing the lower-to-upper diagonal.
   */
  public static getLowerToUpperDiagonal(square: Square): Square[] {
    const squares: Square[] = [];

    squares.push(square);

    let oldSquare = square;
    let nextSquare = this.getSquareInDirection(square, Direction.NORTH_EAST);

    while (this.isOnBoard(nextSquare) && this.getRelativeDirection(oldSquare, nextSquare) === Direction.NORTH_EAST) {
      squares.push(nextSquare);
      oldSquare = nextSquare;
      nextSquare = this.getSquareInDirection(nextSquare, Direction.NORTH_EAST);
    }

    oldSquare = square;
    nextSquare = this.getSquareInDirection(square, Direction.SOUTH_WEST);
    while (this.isOnBoard(nextSquare) && this.getRelativeDirection(oldSquare, nextSquare) === Direction.SOUTH_WEST) {
      squares.push(nextSquare);
      oldSquare = nextSquare;
      nextSquare = this.getSquareInDirection(nextSquare, Direction.SOUTH_WEST);
    }

    return squares;
  }

  /**
   * Returns an array of squares representing the vertical line of the given square.
   *
   * @param square - The square for which to get the vertical line.
   * @returns An array of squares representing the vertical line.
   */
  public static getVerticalSquares(square: Square): Square[] {
    const squares: Square[] = [];

    for (let i = 0; i < 8; i++) {
      squares.push(i * 8 + square % 8);
    }

    return squares;
  }

  /**
   * Returns an array of squares representing the horizontal line of the given square.
   *
   * @param square - The square for which to get the horizontal line.
   * @returns An array of squares representing the horizontal line.
   */
  public static getHorizontalSquares(square: Square): Square[] {
    const squares: Square[] = [];

    for (let i = 0; i < 8; i++) {
      squares.push(Math.floor(square / 8) * 8 + i);
    }

    return squares;
  }

  /**
   * Returns the row string of the given square.
   * 
   * @param square - The square for which to get the row string.
   * @returns The row string of the square.
   */
  public static getRowString(square: Square): string {
    const row = SquareUtils.rankOf(square);
    return row + 1 + '';
  }

  /**
   * Returns the column string representation of the given square.
   * 
   * @param square - The square for which to get the column string.
   * @returns The column string representation of the square.
   */
  public static getColumnString(square: Square): string {
    const column = SquareUtils.fileOf(square);
    return String.fromCharCode(97 + column);
  }

  /**
   * Converts a piece's position to a move function.
   * @param piece The piece to create the move function for.
   * @returns A move function that takes a square and returns a move object.
   */
  public static positionToMoveFunction(piece: Piece): (value: Square, index: number, array: Square[]) => Move {
    return (value: Square, index: number, array: Square[]) => Move.make(piece.position, value, piece.type);
  };

  /**
   * Retrieves the piece located on a specific position on the board.
   * @param board The chess board.
   * @param p The position to check.
   * @returns The piece located on the specified position, or undefined if no piece is found.
   */
  public static getPieceOnPos(board: Board, p: Square): Piece | undefined {
    return board.pieces.find(piece => piece.position === p);
  }

  /**
   * Checks if a square on the board is free (not occupied by any piece).
   * @param board - The chess board.
   * @param square - The square to check.
   * @returns `true` if the square is free, `false` otherwise.
   */
  public static isFree(board: Board, square: Square): boolean {
    return board.pieces.every(piece => piece.position !== square);
  }

  /**
   * Checks if an array of squares includes a specific square.
   * 
   * @param squares - The array of squares to check.
   * @param square - The square to search for.
   * @returns `true` if the array includes the square, `false` otherwise.
   */
  public static includes(squares: Square[], square: Square): boolean {
    return squares.includes(square);
  }

  /**
   * Returns an array of surrounding squares for a given piece.
   * @param piece - The piece for which to find the surrounding squares.
   * @returns An array of surrounding squares.
   */
  public static getSurroundingSquares(piece: Piece): Square[] {
    const squares: Square[] = [];
    const position = piece.position;

    if (position - 8 >= 0) {
      squares.push(position - 8);
    }
    if (position + 8 < 64) {
      squares.push(position + 8);
    }
    if (position % 8 !== 0) {
      squares.push(position - 1);
    }
    if (position % 8 !== 7) {
      squares.push(position + 1);
    }
    if (position - 9 >= 0 && position % 8 !== 0) {
      squares.push(position - 9);
    }
    if (position - 7 >= 0 && position % 8 !== 7) {
      squares.push(position - 7);
    }
    if (position + 7 < 64 && position % 8 !== 0) {
      squares.push(position + 7);
    }
    if (position + 9 < 64 && position % 8 !== 7) {
      squares.push(position + 9);
    }

    return squares;
  }

  /**
   * Checks if a given square is on the chessboard.
   * @param square - The square to check.
   * @returns A boolean indicating whether the square is on the chessboard.
   */
  public static isOnBoard(square: Square): boolean {
    return square >= 0 && square < 64;
  }

  /**
   * Checks if two squares have the same position.
   * @param squareA The first square.
   * @param squareB The second square.
   * @returns True if the squares have the same position, false otherwise.
   */
  public static squareEquals(squareA: Square, squareB: Square): boolean {
    return squareA === squareB;
  }

  /**
   * Converts a Position object to a Square value.
   * @param position - The Position object to convert.
   * @returns The corresponding Square value.
   */
  public static convertPositionToSquare(position: Position | undefined): Square {
    if (position === undefined) {
      return Square.SQ_NONE;
    }

    return (position.row - 1) * 8 + position.column - 1;
  }

  /**
   * Converts a square number to a position object.
   * @param square - The square number to convert.
   * @returns The position object with row and column values.
   */
  public static convertSquareToPosition(square: Square): Position {
    return {
      column: (square % 8) + 1,
      row: Math.floor(square / 8) + 1
    };
  }

  /**
   * Returns the file of the given square.
   * 
   * @param square - The square value.
   * @returns The file of the square.
   */
  public static fileOf(square: Square): File {
    return square & 7;
  }

  /**
   * Returns the rank of the given square.
   * 
   * @param square - The square to get the rank of.
   * @returns The rank of the square.
   */
  public static rankOf(square: Square): Rank {
    return square >> 3;
  }
}