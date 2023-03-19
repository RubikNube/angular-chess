import { MoveGenerationKingHandler } from "./move-generation.king.handler";

describe('MoveGenerationKingHandler', () => {
  let handler: MoveGenerationKingHandler;
  beforeEach(async () => {
    handler = new MoveGenerationKingHandler();
  });

  describe('isAttackingKing', () => {
    it('should return false', () => {
      expect(handler.isAttackingKing()).toBe(false);
    });
  });

  describe('getBlockingSquares', () => {
    it('should return no squares', () => {
      expect(handler.getBlockingSquares()).toEqual([]);
    });
  });
});