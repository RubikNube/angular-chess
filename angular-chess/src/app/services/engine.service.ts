import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Color, Result } from '../types/board.t';
import EngineUtils from '../utils/engine.utils';
import { ChessBoardService } from './chess-board.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private isRunning$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isRunning$: Observable<boolean> = this.isRunning$$.asObservable();

  private engineColor$$: BehaviorSubject<Color> = new BehaviorSubject<Color>(Color.BLACK);
  public engineColor$: Observable<Color> = this.engineColor$$.asObservable();

  private boardSubcription: Subscription | undefined = undefined;

  constructor(private boardService: ChessBoardService) {
    this.isRunning$.subscribe(isRunning => {
      if (isRunning) {
        this.boardSubcription = this.boardService.getBoard$().subscribe(board => {
          if (board) {
            if (board.playerToMove === this.engineColor$$.getValue()) {
              EngineUtils.getEngineMove(board).then(move => {
                if (move) {
                  this.boardService.executeMove(move, board);
                }
              });
            }
          }
        });
      }
      else {
        if (this.boardSubcription) {
          this.boardSubcription.unsubscribe();
        }
      }
    });

    this.boardService.getResult$().subscribe(result => {
      if (result && result !== Result.UNKNOWN) {
        this.isRunning$$.next(false);
      }
    });
  }

  public toggleEngineColor(): void {
    this.engineColor$$.next(this.engineColor$$.getValue() === Color.WHITE ? Color.BLACK : Color.WHITE);
  }

  public stopEngine(): void {
    this.isRunning$$.next(false);
  }

  public startEngine(): void {
    this.isRunning$$.next(true);
  }
}
