import { Component, OnInit } from '@angular/core';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveExecutionService } from '../services/move-execution.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { PositioningService } from '../services/positioning.service';
import { Board, HighlightColor, Position } from '../types/board.t';
import { Piece } from '../types/pieces.t';
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
    let currentBoard: Board = this.boardService.getBoard();
    this.grabbedPiece = PositionUtils.getPieceOnPos(currentBoard, this.dragPos);
    if (this.grabbedPiece !== undefined) {
      let validSquares = this.moveGenerationService.getValidMoves(currentBoard, this.grabbedPiece, false).map(m => {
        return {
          position: m.to,
          highlight: HighlightColor.GREEN
        }
      });

      let getValidCaptures = this.moveGenerationService.getValidCaptures(currentBoard, this.grabbedPiece).map(m => {
        return {
          position: m.to,
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

    let dropPos: Position = this.positioningService.getMousePosition(e);
    let currentBoard: Board = this.boardService.getBoard();
    let executableMove = this.moveGenerationService.getExecutableMove(currentBoard, this.grabbedPiece, dropPos);

    if (executableMove !== undefined) {
      this.moveExecutionService.executeMove(executableMove);
    }

  }

  getCursor(piece: Piece) {
    return "grab";
  }
}
