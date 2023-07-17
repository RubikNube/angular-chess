import { COLOR_WHITE, Color, Position } from '../types/board.t';
import { Move, PieceType } from '../types/pieces.t';
import PositionUtils from './position.utils';

describe('PositionUtils', () => {
  let pos1 = { row: 1, column: 1 };
  let posNotInArray = { row: 2, column: 2 };
  let positions: Position[] = [{ row: 1, column: 1 }];


  describe('includes', () => {
    it('should return true if position is found in array.', () => {
      expect(PositionUtils.includes(positions, pos1)).toBeTruthy();
    });

    it('should return false if position is found in array.', () => {
      expect(PositionUtils.includes(positions, posNotInArray)).toBeFalsy();
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
        piece: { color: COLOR_WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const leftUpMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 4, row: 2 },
        piece: { color: COLOR_WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const rightMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 6, row: 1 },
        piece: { color: COLOR_WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const rightUpMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 6, row: 2 },
        piece: { color: COLOR_WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
      };

      const upMove: Move = {
        from: { column: 5, row: 1 },
        to: { column: 5, row: 2 },
        piece: { color: COLOR_WHITE, type: PieceType.KING, position: { column: 5, row: 1 } }
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

  describe('getUpperToLowerDiagonal', () => {
    it('should return a7-g1 diagonals for d4', () => {
      const expectedPositions: Position[] = [
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 4, row: 4 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getUpperToLowerDiagonal({ column: 4, row: 4 }).sort(PositionUtils.comparePositions());

      expect(actualPositions).toEqual(expectedPositions);
    });

    it('should return a7-g1 diagonal for b6', () => {
      const expectedPositions: Position[] = [
        { column: 1, row: 7 },
        { column: 2, row: 6 },
        { column: 3, row: 5 },
        { column: 4, row: 4 },
        { column: 5, row: 3 },
        { column: 6, row: 2 },
        { column: 7, row: 1 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getUpperToLowerDiagonal({ column: 2, row: 6 }).sort(PositionUtils.comparePositions());

      expect(actualPositions).toEqual(expectedPositions);
    });
  });

  describe('getLowerToUpperDiagonal', () => {
    it('should return a1-h8 diagonal for d4', () => {
      const expectedPositions: Position[] = [
        { column: 1, row: 1 },
        { column: 2, row: 2 },
        { column: 3, row: 3 },
        { column: 4, row: 4 },
        { column: 5, row: 5 },
        { column: 6, row: 6 },
        { column: 7, row: 7 },
        { column: 8, row: 8 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getLowerToUpperDiagonal({ column: 4, row: 4 }).sort(PositionUtils.comparePositions());

      expect(actualPositions).toEqual(expectedPositions);
    });

    it('should return a5-d8 diagonal for b6', () => {
      const expectedPositions: Position[] = [
        { column: 1, row: 5 },
        { column: 2, row: 6 },
        { column: 3, row: 7 },
        { column: 4, row: 8 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getLowerToUpperDiagonal({ column: 2, row: 6 }).sort(PositionUtils.comparePositions());

      expect(actualPositions).toEqual(expectedPositions);
    });
  });

  describe('getHorizontalSquares', () => {
    it('should return a2-h2 line for h2', () => {
      const expectedPositions: Position[] = [
        { column: 1, row: 2 },
        { column: 2, row: 2 },
        { column: 3, row: 2 },
        { column: 4, row: 2 },
        { column: 5, row: 2 },
        { column: 6, row: 2 },
        { column: 7, row: 2 },
        { column: 8, row: 2 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getHorizontalSquares({ column: 8, row: 2 }).sort(PositionUtils.comparePositions());

      expect(actualPositions).toEqual(expectedPositions);
    });
  });

  describe('getVerticalSquares', () => {
    it('should return a1-a8 line for a8', () => {
      const expectedPositions: Position[] = [
        { column: 1, row: 1 },
        { column: 1, row: 2 },
        { column: 1, row: 3 },
        { column: 1, row: 4 },
        { column: 1, row: 5 },
        { column: 1, row: 6 },
        { column: 1, row: 7 },
        { column: 1, row: 8 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getVerticalSquares({ column: 1, row: 8 }).sort(PositionUtils.comparePositions());

      expect(actualPositions).toEqual(expectedPositions);
    });
  });

  describe('getDiagonalPositionsBetween', () => {

    it('should return b2-g7 diagonal for a1 and h8', () => {
      const expectedPositions: Position[] = [
        { column: 2, row: 2 },
        { column: 3, row: 3 },
        { column: 4, row: 4 },
        { column: 5, row: 5 },
        { column: 6, row: 6 },
        { column: 7, row: 7 }
      ].sort(PositionUtils.comparePositions());;

      const actualPositions: Position[] = PositionUtils.getDiagonalPositionsBetween({ column: 1, row: 1 }, { column: 8, row: 8 });

      expect(actualPositions).toEqual(expectedPositions);
    });

    it('should return no positions for a1 and a7', () => {
      const actualPositions: Position[] = PositionUtils.getDiagonalPositionsBetween({ column: 1, row: 1 }, { column: 1, row: 7 });

      expect(actualPositions).toEqual([]);
    });

    it('should return d6-g3 diagonal for c7 and h2', () => {
      const expectedPositions: Position[] = [
        { column: 3, row: 6 },
        { column: 4, row: 5 },
        { column: 5, row: 4 },
        { column: 6, row: 3 }
      ].sort(PositionUtils.comparePositions());

      const actualPositions: Position[] = PositionUtils.getDiagonalPositionsBetween({ column: 2, row: 7 }, { column: 7, row: 2 });

      expect(actualPositions).toEqual(expectedPositions);
    });
  })

  describe('getHorizontalPositionsBetween', () => {
    function getHorizontalPositionsBetween(description: string, start: Position, end: Position, expectedPositions: Position[]) {
      it(description, () => {
        const sortedExpectedPositions: Position[] = expectedPositions.sort(PositionUtils.comparePositions());
        const actualPositions: Position[] = PositionUtils.getHorizontalPositionsBetween(start, end).sort(PositionUtils.comparePositions());

        expect(actualPositions).toEqual(sortedExpectedPositions);
      });
    }

    getHorizontalPositionsBetween(
      'should return b1-g1 row for a1 and h1',
      { column: 1, row: 1 },
      { column: 8, row: 1 },
      [
        { column: 2, row: 1 },
        { column: 3, row: 1 },
        { column: 4, row: 1 },
        { column: 5, row: 1 },
        { column: 6, row: 1 },
        { column: 7, row: 1 }
      ]
    );

    getHorizontalPositionsBetween(
      'should return b2-f2 row for a2 and g2',
      { column: 1, row: 2 },
      { column: 7, row: 2 },
      [
        { column: 2, row: 2 },
        { column: 3, row: 2 },
        { column: 4, row: 2 },
        { column: 5, row: 2 },
        { column: 6, row: 2 }
      ]
    );

    getHorizontalPositionsBetween(
      'should return no positions for a2 and h7',
      { column: 1, row: 2 },
      { column: 8, row: 7 },
      []
    );
  });

  describe('getVerticalPositionsBetween', () => {
    function getVerticalPositionsBetween(description: string, start: Position, end: Position, expectedPositions: Position[]) {
      it(description, () => {
        const sortedExpectedPositions: Position[] = expectedPositions.sort(PositionUtils.comparePositions());
        const actualPositions: Position[] = PositionUtils.getVerticalPositionsBetween(start, end).sort(PositionUtils.comparePositions());

        expect(actualPositions).toEqual(sortedExpectedPositions);
      });
    }

    getVerticalPositionsBetween(
      'should return a2-a7 column for a1 and a8',
      { column: 1, row: 1 },
      { column: 1, row: 8 },
      [
        { column: 1, row: 2 },
        { column: 1, row: 3 },
        { column: 1, row: 4 },
        { column: 1, row: 5 },
        { column: 1, row: 6 },
        { column: 1, row: 7 }
      ]
    );

    getVerticalPositionsBetween(
      'should return c3-c6 column for c7 and c2',
      { column: 3, row: 7 },
      { column: 3, row: 2 },
      [
        { column: 3, row: 6 },
        { column: 3, row: 5 },
        { column: 3, row: 4 },
        { column: 3, row: 3 }
      ]
    );

    getVerticalPositionsBetween(
      'should return no positions for a2 and h7',
      { column: 1, row: 2 },
      { column: 8, row: 7 },
      []
    );
  });
});