import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { HighlightColor, Square } from '../types/board.t';
import { HighlightingService } from './highlighting.service';


describe('HighlightingService', () => {
  let service: HighlightingService;
  let testScheduler: TestScheduler;
  const redSquare1: Square = {
    position: { column: 1, row: 1 },
    highlight: HighlightColor.RED
  };
  const redSquare2: Square = {
    position: { column: 1, row: 2 },
    highlight: HighlightColor.RED
  };
  const blueSquare1: Square = {
    position: { column: 2, row: 1 },
    highlight: HighlightColor.BLUE
  };
  const blueSquare2: Square = {
    position: { column: 2, row: 2 },
    highlight: HighlightColor.BLUE
  };
  const greenSquare1: Square = {
    position: { column: 3, row: 1 },
    highlight: HighlightColor.GREEN
  };
  const greenSquare2: Square = {
    position: { column: 3, row: 2 },
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

  describe('clearSquaresByColor', () => {
    it('should clear all squares if no color is given', () => {
      testScheduler.run((runHelper) => {
        service.clearSquaresByColor();

        const expected = "a--";
        const values = {
          a: []
        }
        runHelper.expectObservable(service.getSquares$()).toBe(expected, values);
      });
    });

    it('should not remove passed colors', () => {
      testScheduler.run((runHelper) => {
        service.clearSquaresByColor(HighlightColor.RED, HighlightColor.GREEN);

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
        const redPos1 = { column: 1, row: 1 };
        const bluePos1 = { column: 2, row: 1 };
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
