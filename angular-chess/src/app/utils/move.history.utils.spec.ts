import { Color } from "../types/compressed.types.t";
import MoveHistoryUtils from "./move.history.utils";

describe('MoveHistoryUtils', () => {

  describe('getMoveCount', () => {
    it('should return 1 for startingColor white and white move index 0.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.WHITE, Color.WHITE, 0)).toEqual(1);
    });

    it('should return 1 for startingColor white and black move index 1.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.WHITE, Color.BLACK, 1)).toEqual(1);
    });

    it('should return 2 for startingColor white and white move index 2.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.WHITE, Color.WHITE, 2)).toEqual(2);
    });

    it('should return 2 for startingColor white and black move index 3.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.WHITE, Color.BLACK, 3)).toEqual(2);
    });

    it('should return 3 for startingColor white and white move index 4.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.WHITE, Color.WHITE, 4)).toEqual(3);
    });

    it('should return 3 for startingColor white and black move index 5.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.WHITE, Color.BLACK, 5)).toEqual(3);
    });


    it('should return 1 for startingColor black and black move index 0.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.BLACK, Color.BLACK, 0)).toEqual(1);
    });

    it('should return 2 for startingColor black and white move index 1.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.BLACK, Color.WHITE, 1)).toEqual(2);
    });

    it('should return 2 for startingColor black and black move index 2.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.BLACK, Color.BLACK, 2)).toEqual(2);
    });

    it('should return 3 for startingColor black and white move index 3.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.BLACK, Color.WHITE, 3)).toEqual(3);
    });

    it('should return 3 for startingColor black and black move index 4.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.BLACK, Color.BLACK, 4)).toEqual(3);
    });

    it('should return 4 for startingColor black and white move index 5.', () => {
      expect(MoveHistoryUtils.getMoveCount(Color.BLACK, Color.WHITE, 5)).toEqual(4);
    });
  });
});