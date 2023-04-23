import { Board, Color, Position } from "../types/board.t";
import { Move, Piece } from "../types/pieces.t";

export default class PositionUtils {
  public static positionEquals(a: Position, b: Position) {
    return a.row === b.row && a.column === b.column;
  }

  public static getRelativePosition(position: Position, perspective: Color): Position {
    if (perspective === Color.WHITE) {
      return position;
    }
    else {
      return {
        row: 9 - position.row,
        column: 9 - position.column
      }
    }
  }

  public static calculateDistance(positionA: Position, positionB: Position): number {
    const rowDistance: number = Math.abs(positionA.row - positionB.row);
    const columnDistance: number = Math.abs(positionA.column - positionB.column);

    return Math.max(rowDistance, columnDistance);
  }

  public static isOnBoard(position: Position): boolean {
    return position.row >= 1 && position.row <= 8 && position.column >= 1 && position.column <= 8;
  }

  public static includes(positions: Position[], position: Position) {
    return positions.some(pos => PositionUtils.positionEquals(pos, position));
  }

  public static getCoordinate(position: Position): string {
    return String.fromCharCode(96 + position.column) + position.row;
  }

  public static getPositionFromCoordinate(coordinate: string): Position | undefined {
    const matching = coordinate.match("^[a-h][1-8]$");

    if (matching !== null) {
      return {
        row: Number.parseInt(coordinate[1]),
        column: coordinate.charCodeAt(0) - 96
      }
    }
    else {
      return undefined;
    }
  }

  public static getPieceOnPos(board: Board, pos: Position): Piece | undefined {
    return board.pieces.find(p => {
      return p.position.row === pos.row
        && p.position.column === pos.column;
    });
  }

  public static isFree(board: Board, position: Position): boolean {
    return PositionUtils.getPieceOnPos(board, position) === undefined;
  }

  public static getSurroundingSquares(piece: Piece): Position[] {
    const fieldsToMove: Position[] = [];

    for (let r: number = -1; r <= 1; r++) {
      for (let c: number = -1; c <= 1; c++) {
        if (!(r == 0 && c == 0)) {
          const field: Position = {
            row: piece.position.row + r,
            column: piece.position.column + c
          }

          fieldsToMove.push(field);
        }
      }
    }

    return fieldsToMove;
  }

  public static positionToMoveFunction(piece: Piece): (value: Position, index: number, array: Position[]) => Move {
    return p => {
      return {
        piece: piece,
        from: piece.position,
        to: p
      };
    };
  }

  public static filterOutAttackedSquares(moves: Move[], attackedSquares: Position[]): Move[] {
    return moves.filter(move => {
      return !PositionUtils.includes(attackedSquares, move.to);
    });
  }

  public static getSquareRepresentation(column: number, row: number): string {
    if (column < 1 || column > 8) {
      throw new RangeError(`Column value ${column} out of range`);
    }
    if (row < 1 || row > 8) {
      throw new RangeError(`Column value ${row} out of range`);
    }

    return String.fromCharCode('a'.charCodeAt(0) + (column - 1)) + row;
  }

  public static getUpperToLowerDiagonal(position: Position): Position[] {
    const squares: Position[] = [];

    const currentRow: number = position.row;
    const currentColumn: number = position.column;

    // get diagonal squares from position to upper left corner
    for (let i: number = 1; i <= Math.min(8 - currentRow, currentColumn - 1); i++) {
      squares.push({ row: currentRow + i, column: currentColumn - i });
    }

    squares.push(position);

    // get diagonal squares from position to lower right corner
    for (let i: number = 1; i <= Math.min(currentRow - 1, 8 - currentColumn); i++) {
      squares.push({ row: currentRow - i, column: currentColumn + i });
    }

    return squares.sort(PositionUtils.comparePositions());
  }

  public static getLowerToUpperDiagonal(position: Position): Position[] {
    const squares: Position[] = [];

    const currentRow: number = position.row;
    const currentColumn: number = position.column;

    // get diagonal squares from position to lower left corner
    for (let i: number = 1; i <= Math.min(currentRow - 1, currentColumn - 1); i++) {
      squares.push({ row: currentRow - i, column: currentColumn - i });
    }

    // get diagonal squares from position to upper right corner
    for (let i: number = 1; i <= Math.min(8 - currentRow, 8 - currentColumn); i++) {
      squares.push({ row: currentRow + i, column: currentColumn + i });
    }

    squares.push(position);

    return squares.sort(PositionUtils.comparePositions());
  }


  public static comparePositions(): ((a: Position, b: Position) => number) | undefined {
    return (a, b) => {
      // if positions are equal, return 0
      if (a.column === b.column && a.row === b.row) {
        return 0;
      }
      // if a is before b, return -1
      else if (a.column < b.column || (a.column === b.column && a.row < b.row)) {
        return -1;
      }
      // if a is after b, return 1
      else {
        return 1;
      }
    };
  }

  public static sortPositions(positions: Position[]): Position[] {
    return positions.sort(PositionUtils.comparePositions());
  }

  public static getHorizontalSquares(position: Position): Position[] {
    const squares: Position[] = [];

    for (let i: number = 1; i <= 8; i++) {
      squares.push({ row: position.row, column: i });
    }

    return squares;
  }

  public static getVerticalSquares(position: Position): Position[] {
    const squares: Position[] = [];

    for (let i: number = 1; i <= 8; i++) {
      squares.push({ row: i, column: position.column });
    }

    return squares;
  }

  public static getDiagonalPositionsBetween(start: Position, end: Position): Position[] {
    const positions: Position[] = [];

    const rowDistance: number = Math.abs(start.row - end.row);
    const columnDistance: number = Math.abs(start.column - end.column);

    if (rowDistance !== columnDistance) {
      return [];
    }

    const rowDirection: number = start.row < end.row ? 1 : -1;
    const columnDirection: number = start.column < end.column ? 1 : -1;

    for (let i: number = 1; i < rowDistance; i++) {
      positions.push({
        row: start.row + (i * rowDirection),
        column: start.column + (i * columnDirection)
      });
    }

    return positions;
  }

  public static getHorizontalPositionsBetween(start: Position, end: Position): Position[] {
    const positions: Position[] = [];

    const rowDistance: number = Math.abs(start.row - end.row);
    const columnDistance: number = Math.abs(start.column - end.column);

    if (rowDistance !== 0 || columnDistance === 0) {
      return [];
    }

    const columnDirection: number = start.column < end.column ? 1 : -1;

    for (let i: number = 1; i < columnDistance; i++) {
      positions.push({
        row: start.row,
        column: start.column + (i * columnDirection)
      });
    }

    return positions;
  }

  public static getVerticalPositionsBetween(start: Position, end: Position): Position[] {
    const positions: Position[] = [];

    const rowDistance: number = Math.abs(start.row - end.row);
    const columnDistance: number = Math.abs(start.column - end.column);

    if (columnDistance !== 0 || rowDistance === 0) {
      return [];
    }

    const rowDirection: number = start.row < end.row ? 1 : -1;

    for (let i: number = 1; i < rowDistance; i++) {
      positions.push({
        row: start.row + (i * rowDirection),
        column: start.column
      });
    }

    return positions;
  }
}