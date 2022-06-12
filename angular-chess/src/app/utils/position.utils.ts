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
}