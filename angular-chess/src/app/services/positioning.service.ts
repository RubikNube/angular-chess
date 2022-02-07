import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color, Position } from '../types/board.t';
import PositionUtils from '../utils/position.utils';

@Injectable({
  providedIn: 'root'
})
export class PositioningService {
  perspectiveSource: BehaviorSubject<Color> = new BehaviorSubject<Color>(Color.WHITE);
  perspective$: Observable<Color> = this.perspectiveSource.asObservable();

  public switchPerspective(): void {
    this.perspectiveSource.next(this.perspectiveSource.getValue() === Color.WHITE ? Color.BLACK : Color.WHITE);
  }

  public getUiPosition(position: Position): Position {
    return PositionUtils.getRelativePosition(position, this.perspectiveSource.getValue());
  }

  getMousePosition(e: MouseEvent): Position {
    let boardElem = document.querySelector('div.board');
    let rect = boardElem?.getBoundingClientRect();

    let d_x = e.clientX - (rect?.x === undefined ? 0 : rect.x);
    let d_y = e.clientY - (rect?.y === undefined ? 0 : rect.y);

    // get corresponding square
    let ev_height = boardElem?.scrollHeight === undefined ? 1 : boardElem?.scrollHeight;
    let squareLength = ev_height / 8;

    // get row
    let row = Math.ceil(d_y / squareLength);

    // get column
    let column = Math.ceil(d_x / squareLength);

    let position: Position;

    if (this.getPerspective() === Color.WHITE) {
      position = { row: 9 - row, column: column };
    }
    else {
      position = { row: row, column: 9 - column };
    }

    console.log("getMousePosition: " + JSON.stringify(position) + ", this.getPerspective(): " + this.getPerspective());

    return position;
  }

  private getPerspective(): Color {
    return this.perspectiveSource.getValue();
  }
}
