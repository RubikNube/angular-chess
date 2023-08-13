import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { MoveHistoryService } from 'src/app/services/move-history.service';
import { Board } from 'src/app/types/board.t';
import { FullMove, Move } from 'src/app/types/pieces.t';
import LoggingUtils, { LogLevel } from 'src/app/utils/logging.utils';
import MoveUtils from 'src/app/utils/move.utils';
import PieceUtils from 'src/app/utils/piece.utils';
import PositionUtils from 'src/app/utils/position.utils';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements OnInit {
  public math = Math;
  public moveUtils=MoveUtils;

  fullMoveHistory: FullMove[] = [];
  public selectedMove: FullMove = { count: 0 };
  public menuItems: MenuItem[] = [
    { label: "white", command: () => this.moveHistoryService.moveToIndex((2 * this.selectedMove.count) - 2) },
    { label: "black", command: () => this.moveHistoryService.moveToIndex((2 * this.selectedMove.count) - 1) }
  ];
  public moveHistory: Move[] = [];

  constructor(public moveHistoryService: MoveHistoryService,
    public boardService: ChessBoardService) {
  }

  ngOnInit(): void {
    this.moveHistoryService.getFullMoveHistory$().subscribe(
      fullMoveHistory => {
        this.fullMoveHistory = fullMoveHistory;

        window.setTimeout(() => {
          if (fullMoveHistory.length > 0) {
            const idOfElement = "fullMove_" + fullMoveHistory[fullMoveHistory.length - 1].count;
            this.setFocusToNewMove(idOfElement);
          }
        }, 50);
      }
    );

    this.moveHistoryService.getMoveHistory$().subscribe(
      moveHistory => {
        this.moveHistory = moveHistory;
      }
    );
  }

  private setFocusToNewMove(idOfElement: string) {
    const elementToFocus: HTMLElement | null = document.getElementById(idOfElement);
    if (elementToFocus) {
      elementToFocus.focus();
    }
    else {
      LoggingUtils.log(LogLevel.ERROR, () => "Couldn't set focus for id " + idOfElement);
    }
  }

  public loadBoard(board: Board | undefined): void {
    LoggingUtils.log(LogLevel.INFO, () => `selectedMove: ${this.selectedMove}`);
    LoggingUtils.log(LogLevel.INFO, () => `loadBoard: ${board}`);

    if (board !== undefined) {
      this.boardService.loadBoard(board);
    }
  }
}
