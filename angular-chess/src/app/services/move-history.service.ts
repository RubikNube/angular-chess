import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Color, Position } from '../types/board.t';
import { FullMove, Move } from '../types/pieces.t';
import MoveHistoryUtils from '../utils/move.history.utils';

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryService {
  moveHistorySource: BehaviorSubject<Move[]> = new BehaviorSubject<Move[]>([]);
  moveHistory$: Observable<Move[]> = this.moveHistorySource.asObservable();

  fullMoveHistory$: Observable<FullMove[]> = this.createFullMoveHistory$();

  constructor() { }

  public addMoveToHistory(move: Move): void {
    let moveHistory = this.moveHistorySource.getValue();
    moveHistory.push(move);
    this.moveHistorySource.next(moveHistory);
  }

  resetMoveHistory(): void {
    return this.moveHistorySource.next([]);
  }

  getFullMoveHistory$(): Observable<FullMove[]> {
    return this.fullMoveHistory$;
  }

  createFullMoveHistory$(): Observable<FullMove[]> {
    return this.moveHistory$.pipe(map(moveHistory => {
      let fullMoveHistory: FullMove[] = [];
      let moveMap: Map<number, FullMove> = new Map<number, FullMove>();

      let firstMove = moveHistory[0];
      let startingColor: Color = firstMove?.piece.color;


      for (let index = 0; index < moveHistory.length; index++) {
        let move = moveHistory[index];

        let moveCount = MoveHistoryUtils.getMoveCount(startingColor, move.piece.color, index);

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
}
