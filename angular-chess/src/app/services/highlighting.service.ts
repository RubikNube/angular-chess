import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Square } from '../types/board.t';

@Injectable({
  providedIn: 'root'
})
export class HighlightingService {
  private quaresSource: BehaviorSubject<Square[]> = new BehaviorSubject<Square[]>([]);
  quares$: Observable<Square[]> = this.quaresSource.asObservable();

  constructor() { }

  public getSquares(): Observable<Square[]> {
    return this.quares$;
  }

  public clearSquares(): void {
    this.quaresSource.next([]);
  }

  public addSquares(...squaresToAdd: Square[]): void {
    let currentSquares: Square[] = this.quaresSource.getValue();
    currentSquares.push(...squaresToAdd);

    this.quaresSource.next(currentSquares);
  }
}
