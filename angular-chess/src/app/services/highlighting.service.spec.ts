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
    highlight: HighlightColor.BLUE
  };
  const greenSquare2: Square = {
    position: { column: 3, row: 2 },
    highlight: HighlightColor.BLUE
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighlightingService);

    testScheduler = new TestScheduler((actual, expected) => {
      // TODO: see how https://rxjs.dev/guide/testing/marble-testing are working
      console.error(`actual ${JSON.stringify(actual)} expected: ${JSON.stringify(expected)}`)
      expect(actual.value).toEqual(expected.value);
    })

    service.addSquares(redSquare1, redSquare2, blueSquare1, blueSquare2, greenSquare1, greenSquare2);
  });

  describe('clearSquares', () => {
    it('should clear all squares if no color is given', () => {
      testScheduler.run((runHelper) => {
        service.clearSquares();
        service.getSquares$().subscribe(s => true);
        const expected = "a";
        const values = {
          a: []
        }
        runHelper.expectObservable(service.getSquares$()).toBe(expected, [redSquare1]);
      });
    });
  });
});
