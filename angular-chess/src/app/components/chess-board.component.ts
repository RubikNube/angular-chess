import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { BoardThemingService } from '../services/board-theming.service';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveExecutionService } from '../services/move-execution.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { MoveHistoryService } from '../services/move-history.service';
import { PositioningService } from '../services/positioning.service';
import { Board, Color, HighlightColor, Position, Result, Square } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import PositionUtils from '../utils/position.utils';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss'],
  providers: [MessageService]
})
export class ChessBoardComponent implements OnInit {
  public readonly numbersOneToEight: number[] = [...Array(8)].map((_, i) => i + 1);
  public readonly numbersOneToEightDesc = [...this.numbersOneToEight].sort((a, b) => b - a);

  public playerPerspectiveRows$: Observable<number[]> | undefined;
  public playerPerspectiveColumns$: Observable<number[]> | undefined;
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

  constructor(
    public boardService: ChessBoardService,
    public readonly themingService: BoardThemingService,
    public highlightingService: HighlightingService,
    public positioningService: PositioningService,
    private moveGenerationService: MoveGenerationService,
    private moveExecutionService: MoveExecutionService,
    private messageService: MessageService,
    private moveHistoryService: MoveHistoryService
  ) {
    this.boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq");

    this.boardService.getResult$()
      .pipe(
        tap(r => console.log("getResult: " + r)),
        distinctUntilChanged())
      .subscribe(r => this.showResultToast(r));
  }

  ngOnInit(): void {
    this.playerPerspectiveRows$ = this.positioningService.perspective$.pipe(
      map(perspective =>
        perspective === Color.WHITE ? this.numbersOneToEightDesc : this.numbersOneToEight
      ),
      tap(data => console.log("ngOnInit result: ", data)),
    );
    this.playerPerspectiveColumns$ = this.positioningService.perspective$.pipe(map(perspective =>
      perspective === Color.WHITE ? this.numbersOneToEight : this.numbersOneToEightDesc
    ));
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

  public dragStart(event: DragEvent) {
    this.dragPos = this.positioningService.getMousePosition(event);
    const currentBoard: Board = this.boardService.getBoard();
    this.grabbedPiece = PositionUtils.getPieceOnPos(currentBoard, this.dragPos);
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

      this.highlightingService.clearSquaresByPosition(...getValidCaptures.map(e => e.position))
      this.highlightingService.addSquares(...validSquares, ...getValidCaptures);
    }
  }

  public dragEnd(e: DragEvent) {
    console.log('dragEnd: ', e);
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
      this.clearAllSquares();
      this.moveExecutionService.executeMove(executableMove);
    }
    else {
      this.clearAllButLastMoveSquare();
      const lastMove: Move = this.moveHistoryService.getLastMove();
      const fromSquare: Square = { position: lastMove.from, highlight: HighlightColor.BLUE };
      const toSquare: Square = { position: lastMove.to, highlight: HighlightColor.BLUE };
      this.highlightingService.addSquares(fromSquare, toSquare);
    }
  }

  private clearAllSquares() {
    this.highlightingService.clearSquaresByColor();
  }

  private clearAllButLastMoveSquare() {
    this.highlightingService.clearSquaresByColor(HighlightColor.BLUE);
  }

  // TODO: event type has to change to specific type
  public selectPromotionPiece(event: any) {
    console.log("selectedPromotionPiece event: " + JSON.stringify(event));

    let selectedPiece = this.getPieceType(event.value);
    if (this.lastMove !== undefined) {
      this.lastMove.promotedPiece = { type: selectedPiece, color: this.lastMove.piece.color, position: this.lastMove.to };
      this.moveExecutionService.executeMove(this.lastMove);
    }

    this.overlayPanel?.hide();
  }

  // TODO: Move this function to PieceUtils
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
}
