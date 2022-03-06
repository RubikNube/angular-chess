import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { distinctUntilChanged, tap } from 'rxjs';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveExecutionService } from '../services/move-execution.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { PositioningService } from '../services/positioning.service';
import { Board, Color, HighlightColor, Position, Result, Square } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
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
  public selectedPromotionPiece: PieceType | undefined;
  public possiblePromotionPieces: PieceType[] = [
    PieceType.QUEEN,
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP
  ];
  private lastMove: Move | undefined;

  @ViewChild("op")
  public overlayPanel: OverlayPanel | undefined;

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
    return this.positioningService.getUiPosition(position).row;
  }

  public getLeftPosition(position: Position): number {
    return this.positioningService.getUiPosition(position).column;
  }

  public dragStart(event: DragEvent) {
    this.dragPos = this.positioningService.getMousePosition(event);
    const currentBoard: Board = this.boardService.getBoard();
    this.grabbedPiece = PositionUtils.getPieceOnPos(currentBoard, this.dragPos);
    console.log('dragStart - grabbedPiece: ', this.grabbedPiece);
    this.updateHighlightingSquares(currentBoard);
  }

  private updateHighlightingSquares(currentBoard: Board): void {
    if (this.grabbedPiece !== undefined && this.grabbedPiece.color === currentBoard.playerToMove) {
      const validSquares: Square[] = this.moveGenerationService.getValidMoves(currentBoard, this.grabbedPiece, false).map(move => {
        return {
          position: move.to,
          highlight: HighlightColor.GREEN
        }
      });

      const getValidCaptures: Square[] = this.moveGenerationService.getValidCaptures(currentBoard, this.grabbedPiece).map(m => {
        return {
          position: m.to,
          highlight: HighlightColor.RED
        }
      });

      this.highlightingService.addSquares(...validSquares, ...getValidCaptures);
    }
  }

  public dragEnd(e: DragEvent) {
    console.log('dragEnd: ', e);
    this.highlightingService.clearSquares();
    if (this.grabbedPiece === undefined) {
      return;
    }

    let dropPos: Position = this.positioningService.getMousePosition(e);
    let currentBoard: Board = this.boardService.getBoard();
    let executableMove: Move | undefined = this.moveGenerationService.getExecutableMove(currentBoard, this.grabbedPiece, dropPos);
    this.lastMove = executableMove;

    if (executableMove?.piece.type === PieceType.PAWN) {
      if (executableMove?.piece.color === Color.WHITE) {
        if (executableMove?.to.row === 8) {
          // pick a piece
          this.overlayPanel?.toggle(e);
          return;
        }
      }
      else {
        if (executableMove?.to.row === 1) {
          // pick a piece
          this.overlayPanel?.toggle(e);
          return;
        }
      }
    }

    if (executableMove !== undefined) {
      this.moveExecutionService.executeMove(executableMove);
    }

  }

  public selectPromotionPiece(event: any) {
    console.log("selectedPromotionPiece event: " + JSON.stringify(event));

    let selectedPiece = this.getPieceType(event.value);
    if (this.lastMove !== undefined) {
      this.lastMove.promotedPiece = { type: selectedPiece, color: this.lastMove.piece.color, position: this.lastMove.to };
      this.moveExecutionService.executeMove(this.lastMove);
    }

    this.overlayPanel?.hide();
  }

  private getPieceType(pieceName: string) {
    switch (pieceName) {
      case "QUEEN":
        return PieceType.QUEEN;
      case "ROOK":
        return PieceType.ROOK;
      case "BISHOP":
        return PieceType.BISHOP;
      case "KNIGHT":
        return PieceType.KNIGHT;
      default:
        return PieceType.QUEEN;
    }
  }

  public getCursor(piece: Piece, board: Board) {
    return piece.color === board.playerToMove ? "grab" : "default";
  }
}
