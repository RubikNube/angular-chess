import { Position } from "src/app/types/board.t";
import EvaluationUtils from "./evaltuation.utils";

describe('EvaluationUtils', () => {
  describe('calculateIndex', () => {
    function calculateIndex(description: string, position: Position, expectedIndex: number) {
      it(description, () => {
        const index = EvaluationUtils.calculateIndex(position);
        expect(index).toBe(expectedIndex);
      });
    }

    calculateIndex('should return 0 for a8', { column: 1, row: 8 }, 0);
    calculateIndex('should return 1 for b8', { column: 2, row: 8 }, 1);
    calculateIndex('should return 7 for h8', { column: 8, row: 8 }, 7);
    calculateIndex('should return 56 for a1', { column: 1, row: 1 }, 56);
    calculateIndex('should return 63 for h1', { column: 8, row: 1 }, 63);
  });

  describe('flipIndex', () => {
    function flipIndex(description: string, index: number, expectedIndex: number) {
      it(description, () => {
        const flippedIndex = EvaluationUtils.flipIndex(index);
        expect(flippedIndex).toBe(expectedIndex);
      });
    }

    flipIndex('should flip 0 to 56', 0, 56);
    flipIndex('should flip 56 to 0', 56, 0);
    flipIndex('should flip 63 to 7', 63, 7);
    flipIndex('should flip 7 to 63', 7, 63);
  });
});