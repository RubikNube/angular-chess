import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Square } from '../types/board.t';

@Injectable({
  providedIn: 'root'
})
export class HighlightingService {
  private squares$$: BehaviorSubject<Square[]> = new BehaviorSubject<Square[]>([]);
  private squares$: Observable<Square[]> = this.squares$$.asObservable();

  constructor() { }

  public getSquares$(): Observable<Square[]> {
    return this.squares$;
  }

  public clearSquares(): void {
    this.squares$$.next([]);
  }

  public addSquares(...squaresToAdd: Square[]): void {
    let currentSquares: Square[] = this.squares$$.getValue();
    currentSquares.push(...squaresToAdd);

    this.squares$$.next(currentSquares);
  }
}
