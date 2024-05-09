import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { HighlightColor, SquareWithHighlight } from '../types/board.t';
import { Square } from '../types/compressed.types.t';
import { HighlightingService } from './highlighting.service';


describe('HighlightingService', () => {
  let service: HighlightingService;
  let testScheduler: TestScheduler;
  const redSquare1: SquareWithHighlight = {
    position: Square.SQ_A1,
    highlight: HighlightColor.RED
  };
  const redSquare2: SquareWithHighlight = {
    position: Square.SQ_A2,
    highlight: HighlightColor.RED
  };
  const blueSquare1: SquareWithHighlight = {
    position: Square.SQ_B1,
    highlight: HighlightColor.BLUE
  };
  const blueSquare2: SquareWithHighlight = {
    position: Square.SQ_B2,
    highlight: HighlightColor.BLUE
  };
  const greenSquare1: SquareWithHighlight = {
    position: Square.SQ_C1,
    highlight: HighlightColor.GREEN
  };
  const greenSquare2: SquareWithHighlight = {
    position: Square.SQ_C2,
    highlight: HighlightColor.GREEN
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighlightingService);

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    })

    service.addSquares(redSquare1, redSquare2, blueSquare1, blueSquare2, greenSquare1, greenSquare2);
  });

  describe('clearNotListedColoredSquares', () => {
    it('should clear all squares if no color is given', () => {
      testScheduler.run((runHelper) => {
        service.clearNotListedColoredSquares();

        const expected = "a--";
        const values = {
          a: []
        }
        runHelper.expectObservable(service.getSquares$()).toBe(expected, values);
      });
    });

    it('should not remove passed colors', () => {
      testScheduler.run((runHelper) => {
        service.clearNotListedColoredSquares(HighlightColor.RED, HighlightColor.GREEN);

        const expected = "a--";
        const values = {
          a: [redSquare1, redSquare2, greenSquare1, greenSquare2]
        }
        runHelper.expectObservable(service.getSquares$()).toBe(expected, values);
      });
    });
  });

  describe('clearSquaresByColor', () => {
    it('should remove squares with given position', () => {
      testScheduler.run((runHelper) => {
        const redPos1 = Square.SQ_A1;
        const bluePos1 = Square.SQ_B1;
        service.clearSquaresByPosition(redPos1, bluePos1);

        const expected = "a--";
        const values = {
          a: [redSquare2, blueSquare2, greenSquare1, greenSquare2]
        }
        runHelper.expectObservable(service.getSquares$()).toBe(expected, values);
      });
    });
  });
});
