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
    { label: "white", command: () => this.resetBoard(this.selectedMove.whiteMove?.board) },
    { label: "black", command: () => this.resetBoard(this.selectedMove.blackMove?.board) }
  ];

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

  public resetBoard(board: Board | undefined): void {
    console.log("selectedMove: " + JSON.stringify(this.selectedMove));
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
