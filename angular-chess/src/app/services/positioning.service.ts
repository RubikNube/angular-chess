import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color, Square } from '../types/compressed.types.t';
import LoggingUtils, { LogLevel } from '../utils/logging.utils';
import SquareUtils from '../utils/square.utils';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class PositioningService {
  perspectiveSource: BehaviorSubject<Color> = new BehaviorSubject<Color>(Color.WHITE);
  perspective$: Observable<Color> = this.perspectiveSource.asObservable();

  constructor(private persistenceService: PersistenceService) {
    const persistedPerspective = this.persistenceService.load('perspective');
    if (persistedPerspective) {
      this.perspectiveSource.next(persistedPerspective);
    }
  }


  public switchPerspective(): void {
    const newPerspective = this.perspectiveSource.getValue() === Color.WHITE ? Color.BLACK : Color.WHITE;
    this.persistenceService.save('perspective', newPerspective);
    this.perspectiveSource.next(newPerspective);
  }

  public getUiPosition(position: Square): Square {
    return SquareUtils.getRelativeSquare(position, this.perspectiveSource.getValue());
  }

  getMousePosition(event: DragEvent): Square {
    LoggingUtils.log(LogLevel.INFO, () => `getMousePosition event: ${event}`);
    const boardElem = document.querySelector('div.board');
    const rect = boardElem?.getBoundingClientRect();

    const d_x = event.clientX - (rect?.x === undefined ? 0 : rect.x);
    const d_y = event.clientY - (rect?.y === undefined ? 0 : rect.y);

    // get corresponding square
    const ev_height = boardElem?.scrollHeight === undefined ? 1 : boardElem?.scrollHeight;
    const squareLength = ev_height / 8;

    // get row
    const row = Math.ceil(d_y / squareLength);

    // get column
    const column = Math.ceil(d_x / squareLength);

    let position: Square;

    if (this.getPerspective() === Color.WHITE) {
      position = SquareUtils.convertPositionToSquare({ row: 9 - row, column: column });
    }
    else {
      position = SquareUtils.convertPositionToSquare({ row: row, column: 9 - column });
    }

    LoggingUtils.log(LogLevel.INFO, () => "getMousePosition: " + JSON.stringify(position) + ", this.getPerspective(): " + this.getPerspective());

    return position;
  }

  private getPerspective(): Color {
    return this.perspectiveSource.getValue();
  }
}
