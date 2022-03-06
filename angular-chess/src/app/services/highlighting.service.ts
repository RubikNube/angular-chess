import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Position, Square } from '../types/board.t';

@Injectable({
  providedIn: 'root'
})
export class HighlightingService {
  private squares$$: BehaviorSubject<Square[]> = new BehaviorSubject<Square[]>([]);
  private squares$: Observable<Square[]> = this.squares$$.asObservable();

  public getSquares$(): Observable<Square[]> {
    return this.squares$.pipe(tap(data => console.log("Square data: ", data)));
  }

  public getSquare$(position: Position): Observable<Square | undefined> {
    return this.squares$$.pipe(map((squares: Square[]) => squares.find(data => data.position.column === position.column && data.position.row === position.row)))
  }

  public clearSquares(): void {
    this.squares$$.next([]);
  }

  public addSquares(...squaresToAdd: Square[]): void {
    const currentSquares: Square[] = this.squares$$.getValue();
    currentSquares.push(...squaresToAdd);

    this.squares$$.next(currentSquares);
  }
}
