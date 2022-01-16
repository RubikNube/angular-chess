import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { distinctUntilChanged, tap } from 'rxjs';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveExecutionService } from '../services/move-execution.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { PositioningService } from '../services/positioning.service';
import { Board, Color, HighlightColor, Position, Result } from '../types/board.t';
import { Piece } from '../types/pieces.t';
import PieceUtils from '../utils/piece.utils';
import PositionUtils from '../utils/position.utils';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss'],
  providers: [MessageService]
})
export class ChessBoardComponent {
  private dragPos: Position = { row: 0, column: 0 };
  private grabbedPiece: Piece | undefined = undefined;

  constructor(public boardService: ChessBoardService,
    public highlightingService: HighlightingService,
    public positioningService: PositioningService,
    private moveGenerationService: MoveGenerationService,
    private moveExecutionService: MoveExecutionService,
    private messageService: MessageService) {
    boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq");

    boardService.getResult$()
      .pipe(
        tap(r => console.log("getResult: " + r)),
        distinctUntilChanged())
      .subscribe(r => this.showResultToast(r));
  }

  private showResultToast(result: Result) {
    console.log("showResultToast: " + result);
    if (result !== Result.UNKNOWN) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: this.getResultRepresentation(result) });
    }
  }

  public getResultRepresentation(result: Result | null): string {
    if (!result) {
      return "*";
    }

    switch (result) {
      case Result.UNKNOWN:
        return "*";
      case Result.REMIS:
        return "Remis";
      case Result.WHITE_WIN:
        return "White wins";
      case Result.BLACK_WIN:
        return "Black wins";
    }
  }

  public getBlackPieceChar(piece: Piece): string {
    return PieceUtils.getPieceChar(piece.type, Color.BLACK);
  }

  public getTopPosition(position: Position): number {
    let uiRow = this.positioningService.getUiPosition(position).row;

    return (8 - uiRow) * 12.5;
  }

  public getLeftPosition(position: Position): number {
    let uiCol = this.positioningService.getUiPosition(position).column;

    return (uiCol - 1) * 12.5
  }

  public dragStart(e: MouseEvent, c: any) {
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

  public dragEnd(e: MouseEvent) {
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

  public getCursor(piece: Piece) {
    return "grab";
  }
}
