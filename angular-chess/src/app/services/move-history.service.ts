import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Color } from '../types/board.t';
import { FullMove, Move } from '../types/pieces.t';
import MoveHistoryUtils from '../utils/move.history.utils';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryService {
  private moveHistory$$: BehaviorSubject<Move[]> = new BehaviorSubject<Move[]>([]);
  private moveHistory$: Observable<Move[]> = this.moveHistory$$.asObservable().pipe(tap(moveHistory => console.log('moveHistory$', moveHistory)));

  private showMoveHistory$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showMoveHistory$: Observable<boolean> = this.showMoveHistory$$.asObservable();

  private fullMoveHistory$: Observable<FullMove[]> = this.createFullMoveHistory$();

  private constructor(private persistenceService: PersistenceService) {
    const persistedMoveHistory = this.persistenceService.load('moveHistory');
    if (persistedMoveHistory) {
      console.log('persistedMoveHistory', persistedMoveHistory);
      this.moveHistory$$.next(persistedMoveHistory as Move[]);
    }
  }

  public addMoveToHistory(move: Move): void {
    const moveHistory = this.moveHistory$$.getValue();
    moveHistory.push(move);
    this.persistenceService.save('moveHistory', moveHistory);
    this.moveHistory$$.next(moveHistory);
  }

  public getLastMove(): Move {
    const moveHistory: Move[] = this.moveHistory$$.getValue();
    return moveHistory[moveHistory.length - 1];
  }

  public resetMoveHistory(): void {
    return this.moveHistory$$.next([]);
  }

  public getFullMoveHistory$(): Observable<FullMove[]> {
    return this.fullMoveHistory$;
  }

  public createFullMoveHistory$(): Observable<FullMove[]> {
    return this.moveHistory$.pipe(map(moveHistory => {
      const fullMoveHistory: FullMove[] = [];
      const moveMap: Map<number, FullMove> = new Map<number, FullMove>();

      const firstMove = moveHistory[0];
      const startingColor: Color = firstMove?.piece.color;


      for (let index = 0; index < moveHistory.length; index++) {
        const move = moveHistory[index];

        const moveCount = MoveHistoryUtils.getMoveCount(startingColor, move.piece.color, index);

        let fullMove: FullMove | undefined = moveMap.get(moveCount);

        if (fullMove === undefined) {
          fullMove = {
            count: moveCount
          }
        }

        if (move.piece.color === Color.WHITE) {
          fullMove.whiteMove = move;
        }
        else {
          fullMove.blackMove = move;
        }

        moveMap.set(moveCount, fullMove);
      }

      moveMap.forEach(fm => {
        fullMoveHistory.push(fm);
      });

      return fullMoveHistory.sort((a, b) => {
        return a.count - b.count;
      });
    }));
  }

  public getMoveHistory$(): Observable<Move[]> {
    return this.moveHistory$;
  }

  public showMoveHistory() {
    this.showMoveHistory$$.next(true);
  }

  public hideMoveHistory() {
    this.showMoveHistory$$.next(false);
  }
}