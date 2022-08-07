import { Color, Position } from '../types/board.t';
import { Move, PieceType } from '../types/pieces.t';
import PositionUtils from './position.utils';

describe('PositionUtils', () => {
  let pos1 = { row: 1, column: 1 };
  let posNotInArray = { row: 2, column: 2 };
  let positions: Position[] = [{ row: 1, column: 1 }];


  describe('includes', () => {
    it('should return true if position is found in array.', () => {
      expect(PositionUtils.includes(positions, pos1)).toBeTrue();
    });

    it('should return false if position is found in array.', () => {
      expect(PositionUtils.includes(positions, posNotInArray)).toBeFalse();
    });
  });

  describe('getPositionFromCoordinate', () => {
    it('should return (r:1,c:1) for "a1"', () => {
      expect(PositionUtils.getPositionFromCoordinate("a1")).toEqual({ row: 1, column: 1 });
    });

    it('should return (r:5,c:3) for "e3"', () => {
      expect(PositionUtils.getPositionFromCoordinate("e3")).toEqual({ row: 3, column: 5 });
    });

    it('should return (r:8,c:1) for "h1"', () => {
      expect(PositionUtils.getPositionFromCoordinate("h1")).toEqual({ row: 1, column: 8 });
    });

    it('should return (r:8,c:8) for "h8"', () => {
      expect(PositionUtils.getPositionFromCoordinate("h8")).toEqual({ row: 8, column: 8 });
    });

    it('should return undefined for "h9"', () => {
      expect(PositionUtils.getPositionFromCoordinate("h9")).toBeUndefined();
    });
  });

  describe('filterOutAttackedSquares', () => {
    it('should filter out attacked squares around the king', () => {
      const leftMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 4, row: 1 },
        piece: { color: Color.WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const leftUpMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 4, row: 2 },
        piece: { color: Color.WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const rightMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 6, row: 1 },
        piece: { color: Color.WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const rightUpMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 6, row: 2 },
        piece: { color: Color.WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const upMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 5, row: 2 },
        piece: { color: Color.WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      expect(PositionUtils.filterOutAttackedSquares([leftMove, leftUpMove, rightMove, rightUpMove, upMove], [{ column: 4, row: 2 }, { column: 6, row: 2 }])).toEqual([leftMove, rightMove, upMove]);
    });
  });

  describe('getPositionFromCoordinate', () => {
    it('should return a1 for for (c:1,r:1)', () => {
      expect(PositionUtils.getSquareRepresentation(1, 1)).toEqual('a1');
    });

    it('should return c5 for for (c:3,r:5)', () => {
      expect(PositionUtils.getSquareRepresentation(3, 5)).toEqual('c5');
    });

    it('should return a8 for for (c:1,r:8)', () => {
      expect(PositionUtils.getSquareRepresentation(1, 8)).toEqual('a8');
    });

    it('should return h8 for for (c:8,r:8)', () => {
      expect(PositionUtils.getSquareRepresentation(8, 8)).toEqual('h8');
    });
  });
});