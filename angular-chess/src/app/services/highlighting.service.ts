import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HighlightColor, Position, SquareWithHighlight } from '../types/board.t';
import LoggingUtils, { LogLevel } from '../utils/logging.utils';
import PositionUtils from '../utils/position.utils';

@Injectable({
  providedIn: 'root'
})
export class HighlightingService {
  private squares$$: BehaviorSubject<SquareWithHighlight[]> = new BehaviorSubject<SquareWithHighlight[]>([]);
  private squares$: Observable<SquareWithHighlight[]> = this.squares$$.asObservable();

  public getSquares$(): Observable<SquareWithHighlight[]> {
    return this.squares$.pipe(tap(data => LoggingUtils.log(LogLevel.INFO, () => `Square data: ${data}`)));
  }

  public getSquare$(position: Position): Observable<SquareWithHighlight | undefined> {
    return this.squares$$.pipe(map((squares: SquareWithHighlight[]) => squares.find(data => data.position.column === position.column && data.position.row === position.row)))
  }

  public clearSquaresByPosition(...positions: Position[]): void {
    const filteredSquares: SquareWithHighlight[] = this.squares$$.getValue()
      .filter(s => !PositionUtils.includes(positions, s.position));

    this.squares$$.next(filteredSquares);
  }

  public clearNotListedColoredSquares(...colorsToKeep: HighlightColor[]): void {
    const filteredSquares: SquareWithHighlight[] = this.squares$$.getValue()
      .filter(s => colorsToKeep.length > 0 && colorsToKeep.includes(s.highlight));

    this.squares$$.next(filteredSquares);
  }

  public addSquares(...squaresToAdd: SquareWithHighlight[]): void {
    const currentSquares: SquareWithHighlight[] = this.squares$$.getValue();
    currentSquares.push(...squaresToAdd);

    this.squares$$.next(currentSquares);
  }
}
