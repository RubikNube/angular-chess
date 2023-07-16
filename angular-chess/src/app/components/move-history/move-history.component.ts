import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { MoveHistoryService } from 'src/app/services/move-history.service';
import { Board } from 'src/app/types/board.t';
import { FullMove, Move } from 'src/app/types/pieces.t';
import LoggingUtils, { LogLevel } from 'src/app/utils/logging.utils';
import PieceUtils from 'src/app/utils/piece.utils';
import PositionUtils from 'src/app/utils/position.utils';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements OnInit {
  public math = Math;

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

  public getMoveRepresentation(move: Move): string {
    if (move === undefined) {
      return "";
    }
    else if (move?.isShortCastle) {
      return "O-O";
    } else if (move?.isLongCastle) {
      return "O-O-O";
    } else {
      return PositionUtils.getCoordinate(move?.from) + this.getMoveDelimiter(move) + PositionUtils.getCoordinate(move?.to) + this.getEnPassantRepresentation(move);
    }
  }

  public getPromotionRepresentation(move: Move | undefined): string {
    if (move === undefined) {
      return "";
    }

    return move.promotedPiece ? "=" + PieceUtils.getPieceChar(move.promotedPiece.type, move.promotedPiece.color) : "";
  }

  public getPieceChar(move: Move): string {
    if (move === undefined) {
      return "";
    }

    if (move?.isLongCastle || move?.isShortCastle) {
      return "";
    }
    else {
      return PieceUtils.getPieceChar(move.piece.type, move.piece.color);
    }
  }

  public getCheckOrMateRepresentation(move: Move | undefined): string {
    if (move === undefined) {
      return "";
    }

    return move.isCheck ? move.isMate ? "#" : " +" : "";
  }

  private getMoveDelimiter(move: Move): string {
    return move.capturedPiece === undefined ? "-" : "x";
  }

  private getEnPassantRepresentation(move: Move): string {
    return move.isEnPassant ? " e.p" : "";
  }
}
