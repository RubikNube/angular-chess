import { Position } from '../types/board.t';
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
});