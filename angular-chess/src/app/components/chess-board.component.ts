import { Component, OnInit } from '@angular/core';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveExecutionService } from '../services/move-execution.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { PositioningService } from '../services/positioning.service';
import { Color, HighlightColor, Position } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import PositionUtils from '../utils/position.utils';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {
  dragPos: Position = { row: 0, column: 0 };
  grabbedPiece: Piece | undefined = undefined;

  constructor(public boardService: ChessBoardService,
    public moveGenerationService: MoveGenerationService,
    public highlightingService: HighlightingService,
    public positioningService: PositioningService,
    public moveExecutionService: MoveExecutionService) {
    boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq");
  }

  ngOnInit(): void {
  }


  getTopPosition(position: Position): number {
    let uiRow = this.positioningService.getUiPosition(position).row;

    return (8 - uiRow) * 12.5;
  }

  getLeftPosition(position: Position): number {
    let uiCol = this.positioningService.getUiPosition(position).column;

    return (uiCol - 1) * 12.5
  }

  dragStart(e: MouseEvent, c: any) {
    this.dragPos = this.positioningService.getMousePosition(e);
    this.grabbedPiece = this.boardService.getPieceOnPos(this.dragPos);
    if (this.grabbedPiece !== undefined) {
      let validSquares = this.moveGenerationService.getValidMoves(this.grabbedPiece).map(m => {
        return {
          position: m,
          highlight: HighlightColor.GREEN
        }
      });

      let getValidCaptures = this.moveGenerationService.getValidCaptures(this.grabbedPiece).map(m => {
        return {
          position: m,
          highlight: HighlightColor.RED
        }
      });

      this.highlightingService.addSquares(...validSquares, ...getValidCaptures);
    }
  }

  dragEnd(e: MouseEvent) {
    this.highlightingService.clearSquares();
    if (this.grabbedPiece === undefined) {
      return;
    }

    let validSquares = this.moveGenerationService.getValidMoves(this.grabbedPiece);
    let validCaptures = this.moveGenerationService.getValidCaptures(this.grabbedPiece);

    let dropPos: Position = this.positioningService.getMousePosition(e);

    if (PositionUtils.includes(validSquares, dropPos) || PositionUtils.includes(validCaptures, dropPos)) {
      let move: Move = {
        from: this.dragPos,
        to: dropPos,
        piece: this.grabbedPiece
      }

      if (PositionUtils.includes(validCaptures, dropPos) && this.boardService.isAbsFree(dropPos)) {
        move.isEnPassant = true;
      }

      if (this.grabbedPiece.type === PieceType.KING && Math.abs(this.grabbedPiece.position.column - dropPos.column)) {
        if (dropPos.column === 7) {
          move.isShortCastle = true;
        } else if (dropPos.column === 3) {
          move.isLongCastle = true;
        }
      }

      this.moveExecutionService.executeMove(move);
    }

  }

  getCursor(piece: Piece) {
    return "grab";
  }
}
