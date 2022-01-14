import { Component } from '@angular/core';
import { MoveHistoryService } from 'src/app/services/move-history.service';
import { FullMove, Move } from 'src/app/types/pieces.t';
import PieceUtils from 'src/app/utils/piece.utils';
import PositionUtils from 'src/app/utils/position.utils';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent {
  fullMoveHistory: FullMove[] = [];

  constructor(public moveHistoryService: MoveHistoryService) {
    this.moveHistoryService.getFullMoveHistory$().subscribe(
      p => {
        this.fullMoveHistory = p;
      }
    );
  }

  getMoveRepresentation(move: Move): string {
    if (move === undefined) {
      return "";
    }
    else if (move?.isShortCastle) {
      return "O-O";
    } else if (move?.isLongCastle) {
      return "O-O-O";
    } else {
      return PieceUtils.getSymbol(move?.piece.type, move?.piece.color) + PositionUtils.getCoordinate(move?.from) + this.getMoveDelimiter(move) + PositionUtils.getCoordinate(move?.to) + this.getEnPassantRepresentation(move) + this.getCheckOrMateRepresentation(move);
    }

  }
  getCheckOrMateRepresentation(move: Move): string {
    return move.isCheck ? move.isMate ? "#" : " +" : "";
  }

  getMoveDelimiter(move: Move): string {
    return move.capturedPiece === undefined ? "-" : "x";
  }

  getEnPassantRepresentation(move: Move): string {
    return move.isEnPassant ? " e.p" : "";
  }

}
