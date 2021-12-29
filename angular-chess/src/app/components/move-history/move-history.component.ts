import { Component, OnInit } from '@angular/core';
import { MoveExecutionService } from 'src/app/services/move-execution.service';
import { MoveGenerationService } from 'src/app/services/move-generation.service';
import { Move } from 'src/app/types/pieces.t';
import PieceUtils from 'src/app/utils/piece.utils';
import PositionUtils from 'src/app/utils/position.utils';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements OnInit {

  constructor(public moveExecutionService: MoveExecutionService) { }

  ngOnInit(): void {
  }

  getMoveRepresentation(move: Move): string {
    return PieceUtils.getSymbol(move.piece.type, move.piece.color) + PositionUtils.getCoordinate(move.from) + "-" + PositionUtils.getCoordinate(move.to);
  }

}
