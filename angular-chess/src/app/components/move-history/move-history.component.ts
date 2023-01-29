import { AfterViewInit, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
  fullMoveHistory: FullMove[] = [];
  public selectedMove: FullMove = { count: 0 };
  public menuItems: MenuItem[] = [
    { label: "white", command: () => this.loadBoard(this.selectedMove.whiteMove?.boardBeforeMove) },
    { label: "black", command: () => this.loadBoard(this.selectedMove.blackMove?.boardBeforeMove) }
  ];
  moveHistory: Move[] = [];

  constructor(private moveHistoryService: MoveHistoryService,
    public boardService: ChessBoardService) {
  }

  ngAfterViewInit(): void {
    this.moveHistoryService.getFullMoveHistory$().subscribe(
      p => {
        this.fullMoveHistory = p;

        window.setTimeout(() => {
          const idOfElement = "fullMove_" + p[p.length - 1].count;
          this.setFocusToNewMove(idOfElement);
        }, 50);
      }
    );

    this.moveHistoryService.getMoveHistory$().subscribe(
      p => {
        this.moveHistory = p;
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
    const firstMove: Move = this.moveHistory[0];
    const startingPos: Board | undefined = firstMove.boardBeforeMove;
    if (startingPos) {
      this.boardService.loadBoard(startingPos);
      this.setFocusToNewMove("fullMove_1");
    }
  }

  public moveBack(): void {

  }

  public moveForward(): void {

  }

  public moveToEnd(): void {

  }

  public playPause(): void {

  }
}
