import { AfterViewInit, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { MoveHistoryService } from 'src/app/services/move-history.service';
import { Board } from 'src/app/types/board.t';
import { FullMove, Move } from 'src/app/types/pieces.t';
import BoardUtils from 'src/app/utils/board.utils';
import PieceUtils from 'src/app/utils/piece.utils';
import PositionUtils from 'src/app/utils/position.utils';


@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements AfterViewInit {
  public readonly startIndex = -1;

  fullMoveHistory: FullMove[] = [];
  public selectedMove: FullMove = { count: 0 };
  public menuItems: MenuItem[] = [
    { label: "white", command: () => this.moveToIndex((2 * this.selectedMove.count) - 2) },
    { label: "black", command: () => this.moveToIndex((2 * this.selectedMove.count) - 1) }
  ];
  public moveHistory: Move[] = [];
  private selectedMoveNumber$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public selectedMoveNumber$: Observable<number> = this.selectedMoveNumber$$.asObservable();

  private isPlaying$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlaying$$.asObservable();

  private playingInterval: number | undefined = undefined;

  constructor(private moveHistoryService: MoveHistoryService,
    public boardService: ChessBoardService) {
  }

  ngAfterViewInit(): void {
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
        this.selectedMoveNumber$$.next(moveHistory.length);
      }
    );

    this.isPlaying$.subscribe(
      isPlaying => {
        if (!isPlaying && this.playingInterval) {
          window.clearInterval(this.playingInterval);
          this.playingInterval = undefined;
        }
      }
    );
  }

  private setFocusToNewMove(idOfElement: string) {
    const elementToFocus: HTMLElement | null = document.getElementById(idOfElement);
    if (elementToFocus) {
      elementToFocus.focus();
    }
    else {
      console.error("Couldn't set focus for id " + idOfElement);
    }
  }

  public loadBoard(board: Board | undefined): void {
    console.log("selectedMove: " + JSON.stringify(this.selectedMove));
    console.log("loadBoard: " + JSON.stringify(board));

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

  public moveToStart(): void {
    this.moveToStartBoard();
  }

  public moveBack(): void {
    this.moveToIndex(this.selectedMoveNumber$$.getValue() - 1 > this.startIndex ? this.selectedMoveNumber$$.getValue() - 1 : this.startIndex);
  }

  public moveForward(): void {
    this.moveToIndex(this.selectedMoveNumber$$.getValue() + 1 < this.moveHistory.length - 1 ? this.selectedMoveNumber$$.getValue() + 1 : this.moveHistory.length - 1);
  }

  public moveToEnd(): void {
    this.moveToIndex(this.moveHistory.length - 1);
  }

  private moveToIndex(selectedMoveIndex: number) {
    console.error("moveToIndex: " + selectedMoveIndex);
    this.selectedMoveNumber$$.next(selectedMoveIndex);
    if (selectedMoveIndex === this.startIndex) {
      this.moveToStartBoard();
    }

    const selectedMove: Move = this.moveHistory[selectedMoveIndex];
    const selectedPos: Board | undefined = selectedMove.boardAfterMove;

    if (selectedPos) {
      this.boardService.loadBoard(selectedPos);
      this.setFocusToNewMove("fullMove_" + (Math.floor(selectedMoveIndex / 2) + 1));
    }
  }

  private moveToStartBoard(): void {
    console.error("moveToStartBoard: ");
    const startingBoard = this.boardService.getStartingBoard();
    this.selectedMoveNumber$$.next(this.startIndex);
    this.boardService.loadBoard(startingBoard);
    this.setFocusToNewMove("fullMove_1");
  }

  public play(): void {
    this.playingInterval = window.setInterval(() => {
      this.isPlaying$$.next(true);
      let selectedMoveIndex: number = this.selectedMoveNumber$$.getValue() + 1;
      if (!this.isPlaying$$.getValue() || selectedMoveIndex >= this.moveHistory.length - 1) {
        this.isPlaying$$.next(false);
      }

      this.moveToIndex(selectedMoveIndex);
    }, 1000);
  }

  public pause(): void {
    this.isPlaying$$.next(false);
  }
}
