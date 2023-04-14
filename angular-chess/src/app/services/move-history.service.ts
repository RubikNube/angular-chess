import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Board, Color } from '../types/board.t';
import { FullMove, Move } from '../types/pieces.t';
import CopyUtils from '../utils/copy.utils';
import LoggingUtils from '../utils/logging.utils';
import MoveHistoryUtils from '../utils/move.history.utils';
import { MoveHistoryKeyHandler } from './move-history.key-handler';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class MoveHistoryService {
  public readonly startIndex = -1;

  private moveHistory$$: BehaviorSubject<Move[]> = new BehaviorSubject<Move[]>([]);
  private moveHistory$: Observable<Move[]> = this.moveHistory$$.asObservable().pipe(tap(moveHistory => LoggingUtils.log(`moveHistory$ ${moveHistory}`)));

  private showMoveHistory$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showMoveHistory$: Observable<boolean> = this.showMoveHistory$$.asObservable();

  private fullMoveHistory$: Observable<FullMove[]> = this.createFullMoveHistory$();

  private selectedMoveNumber$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public selectedMoveNumber$: Observable<number> = this.selectedMoveNumber$$.asObservable();

  private isPlaying$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlaying$$.asObservable();

  private boardToLoad$$: BehaviorSubject<Board | undefined> = new BehaviorSubject<Board | undefined>(undefined);
  public boardToLoad$: Observable<Board | undefined> = this.boardToLoad$$.asObservable();

  private playingInterval: number | undefined = undefined;

  protected moveHistoryKeyHandler: MoveHistoryKeyHandler;

  private startingBoard: Board | undefined;

  private constructor(private persistenceService: PersistenceService) {
    this.moveHistoryKeyHandler = new MoveHistoryKeyHandler(this);

    const persistedStartingBoard = persistenceService.load("startingBoard");
    if (persistedStartingBoard) {
      this.startingBoard = persistedStartingBoard;
    }

    const persistedMoveHistory = this.persistenceService.load('moveHistory');
    if (persistedMoveHistory) {
      LoggingUtils.log(`persistedMoveHistory ${persistedMoveHistory}`);
      this.moveHistory$$.next(persistedMoveHistory as Move[]);
    }

    const persistedShowMoveHistory = this.persistenceService.load('showMoveHistory');
    if (persistedShowMoveHistory !== undefined && persistedShowMoveHistory !== null) {
      this.showMoveHistory$$.next(persistedShowMoveHistory as boolean);
    }

    this.isPlaying$.subscribe(
      isPlaying => {
        if (!isPlaying && this.playingInterval) {
          window.clearInterval(this.playingInterval);
          this.playingInterval = undefined;
        }
      }
    );

    this.moveToEnd();
  }

  public getSelectedMoveNumber(): number {
    return this.selectedMoveNumber$$.getValue();
  }

  public setSelectedMoveNumber(moveNumber: number): void {
    this.selectedMoveNumber$$.next(moveNumber);
  }

  public addMoveToHistory(move: Move): void {
    const moveHistory = this.moveHistory$$.getValue();
    moveHistory.push(move);
    this.persistenceService.save('moveHistory', moveHistory);
    this.moveHistory$$.next(moveHistory);
    this.selectedMoveNumber$$.next(moveHistory.length);
  }

  public getLastMove(): Move {
    const moveHistory: Move[] = this.moveHistory$$.getValue();
    return moveHistory[moveHistory.length - 1];
  }

  public resetMoveHistory(): void {
    this.persistenceService.save('moveHistory', []);
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
    this.persistenceService.save('showMoveHistory', true);
    this.showMoveHistory$$.next(true);
  }

  public hideMoveHistory() {
    this.persistenceService.save('showMoveHistory', false);
    this.showMoveHistory$$.next(false);
  }

  public moveToStart(): void {
    this.moveToStartBoard();
  }

  public moveBack(): void {
    this.moveToIndex(this.getSelectedMoveNumber() - 1 > this.startIndex ? this.getSelectedMoveNumber() - 1 : this.startIndex);
  }

  public moveForward(): void {
    this.moveToIndex(this.getSelectedMoveNumber() + 1 < this.moveHistory$$.getValue().length - 1 ? this.getSelectedMoveNumber() + 1 : this.moveHistory$$.getValue().length - 1);
  }

  public moveToEnd(): void {
    this.moveToIndex(this.moveHistory$$.getValue().length - 1);
  }

  public moveToIndex(selectedMoveIndex: number) {
    console.error("moveToIndex: " + selectedMoveIndex);
    this.setSelectedMoveNumber(selectedMoveIndex);
    if (selectedMoveIndex === this.startIndex) {
      this.moveToStartBoard();
    }

    const selectedMove: Move = this.moveHistory$$.getValue()[selectedMoveIndex];
    if (selectedMove === undefined) {
      console.warn("selectedMove is undefined for index " + selectedMoveIndex + " and moveHistory " + JSON.stringify(this.moveHistory$$.getValue()) + "");
      return;
    }
    const selectedPos: Board | undefined = selectedMove.boardAfterMove;

    if (selectedPos) {
      this.boardToLoad$$.next(selectedPos);
      // this.setFocusToNewMove("fullMove_" + (Math.floor(selectedMoveIndex / 2) + 1));
    }
  }

  private moveToStartBoard(): void {
    console.error("moveToStartBoard: ");
    const startingBoard = this.getStartingBoard();
    this.setSelectedMoveNumber(this.startIndex);
    this.boardToLoad$$.next(startingBoard);
    // this.setFocusToNewMove("fullMove_1");
  }

  public play(): void {
    this.playingInterval = window.setInterval(() => {
      this.isPlaying$$.next(true);
      let selectedMoveIndex: number = this.getSelectedMoveNumber() + 1;
      if (!this.isPlaying$$.getValue() || selectedMoveIndex >= this.moveHistory$$.getValue().length - 1) {
        this.isPlaying$$.next(false);
      }

      this.moveToIndex(selectedMoveIndex);
    }, 1000);
  }

  public pause(): void {
    this.isPlaying$$.next(false);
  }

  public setStartingBoard(board: Board | undefined): void {
    this.persistenceService.save("startingBoard", board);
    this.startingBoard = CopyUtils.deepCopyElement(board);
  }

  public getStartingBoard(): Board | undefined {
    return this.startingBoard;
  }
}