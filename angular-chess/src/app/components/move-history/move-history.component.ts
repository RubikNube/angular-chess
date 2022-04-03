import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';
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
export class MoveHistoryComponent {
  @ViewChild('move')
  historyTable!: QueryList<ElementRef>;

  fullMoveHistory: FullMove[] = [];
  public menuItems: MenuItem[] = [
    { label: "white", command: () => this.resetBoard(this.selectedMove$$.getValue().whiteMove?.board) },
    { label: "black", command: () => this.resetBoard(this.selectedMove$$.getValue().blackMove?.board) }
  ];
  public selectedMove$$: BehaviorSubject<FullMove> = new BehaviorSubject<FullMove>({ count: 0 });
  public selectedMove$: Observable<FullMove> = this.selectedMove$$.asObservable();

  constructor(private moveHistoryService: MoveHistoryService,
    public boardService: ChessBoardService) {
    this.moveHistoryService.getFullMoveHistory$().subscribe(
      p => {
        this.fullMoveHistory = p;
        this.selectedMove$$.next(p[p.length - 1]);
        let table = this.historyTable;
        this.historyTable.toArray()[(p.length - 1)].nativeElement.focus();
      }
    );

    this.selectedMove$.subscribe(p => {
      console.log("### selectedMove$: " + JSON.stringify(p));
    })
  }

  public resetBoard(board: Board | undefined): void {
    console.log("selectedMove: " + JSON.stringify(this.selectedMove$$.getValue()));
    console.log("resetBoard: " + JSON.stringify(board));

    if (board !== undefined) {
      const fen: string = BoardUtils.getFen(board);
      this.boardService.importFen(fen);
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
