import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { BehaviorSubject, Observable, distinctUntilChanged, map, tap } from 'rxjs';
import { BoardThemingService } from '../services/board-theming.service';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveHistoryService } from '../services/move-history.service';
import { PositioningService } from '../services/positioning.service';
import { Board, HighlightColor, Result, SquareWithHighlight } from '../types/board.t';
import { Color, PieceType, Square } from '../types/compressed.types.t';
import { Move, Piece } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import LoggingUtils, { LogLevel } from '../utils/logging.utils';
import MoveGenerationUtils from '../utils/move-generation/move.generation.utils';
import SquareUtils from '../utils/square.utils';

/**
 * Represents the types of chess pieces.
 */
enum PieceTypeRepresentation {
  QUEEN = "Queen",
  ROOK = "Rook",
  BISHOP = "Bishop",
  KNIGHT = "Knight"
}

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss'],
  providers: [MessageService]
})
export class ChessBoardComponent implements OnInit {
  public BoardUtils = BoardUtils;
  public readonly numbersOneToEight: number[] = [...Array(8)].map((_, i) => i + 1);
  public readonly numbersOneToEightDesc = [...this.numbersOneToEight].sort((a, b) => b - a);

  private isDragDisabled$$: BehaviorSubject<boolean>;
  public isDragDisabled$: Observable<boolean>;
  public playerPerspectiveRows$: Observable<number[]> | undefined;
  public playerPerspectiveColumns$: Observable<number[]> | undefined;
  private dragPos: Square = Square.SQ_NONE;
  private grabbedPiece: Piece | undefined = undefined;
  public selectedPromotionPiece: PieceType | undefined;
  public possiblePromotionPieces: PieceTypeRepresentation[] = [
    PieceTypeRepresentation.QUEEN,
    PieceTypeRepresentation.ROOK,
    PieceTypeRepresentation.KNIGHT,
    PieceTypeRepresentation.BISHOP
  ];
  private lastMove: Move | undefined;

  @ViewChild("op")
  public overlayPanel: OverlayPanel | undefined;
  public SquareUtils = SquareUtils;

  constructor(
    public boardService: ChessBoardService,
    public readonly themingService: BoardThemingService,
    public highlightingService: HighlightingService,
    public positioningService: PositioningService,
    private messageService: MessageService,
    private moveHistoryService: MoveHistoryService
  ) {
    this.isDragDisabled$$ = new BehaviorSubject<boolean>(false);
    this.isDragDisabled$ = this.isDragDisabled$$.asObservable();

    this.boardService.getResult$()
      .pipe(
        tap(r => LoggingUtils.log(LogLevel.INFO, () => `getResult: {r}`)),
        distinctUntilChanged())
      .subscribe(result => {
        if (result) {
          this.showResultToast(result);
        }
        this.isDragDisabled$$.next(Result.UNKNOWN !== result);
      });

    this.moveHistoryService.getMoveHistory$().subscribe(moveHistory => {
      LoggingUtils.log(LogLevel.INFO, () => `getMoveHistory: ${moveHistory.length}`);
    });
  }

  ngOnInit(): void {
    this.playerPerspectiveRows$ = this.positioningService.perspective$.pipe(
      map(perspective =>
        perspective === Color.WHITE ? this.numbersOneToEightDesc : this.numbersOneToEight
      ),
      tap(data => LoggingUtils.log(LogLevel.INFO, () => `ngOnInit result: ${data}`)),
    );
    this.playerPerspectiveColumns$ = this.positioningService.perspective$.pipe(map(perspective =>
      perspective === Color.WHITE ? this.numbersOneToEight : this.numbersOneToEightDesc
    ));
  }

  private showResultToast(result: Result): void {
    LoggingUtils.log(LogLevel.INFO, () => `showResultToast: ${result}`);
    if (result !== Result.UNKNOWN) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: this.getResultRepresentation(result) });
    }
  }

  public getResultRepresentation(result: Result | null): string {
    if (!result) {
      return "*";
    }

    switch (result) {
      case Result.REMIS:
        return "Remis";
      case Result.WHITE_WIN:
        return "White wins";
      case Result.BLACK_WIN:
        return "Black wins";
      default:
        return "*";
    }
  }

  public dragStart(event: DragEvent): void {
    this.dragPos = this.positioningService.getMousePosition(event);
    const currentBoard: Board = this.boardService.getBoard();
    this.grabbedPiece = SquareUtils.getPieceOnPos(currentBoard, this.dragPos);
    this.updateHighlightingSquares(currentBoard);
  }

  private updateHighlightingSquares(currentBoard: Board): void {
    if (this.grabbedPiece !== undefined && this.grabbedPiece.color === currentBoard.playerToMove) {
      const validSquares: SquareWithHighlight[] = MoveGenerationUtils.getValidMoves(currentBoard, this.grabbedPiece, false).map(move => {
        return {
          position: move.to,
          highlight: HighlightColor.GREEN
        }
      });

      const getValidCaptures: SquareWithHighlight[] = MoveGenerationUtils.getValidCaptures(currentBoard, this.grabbedPiece).map(m => {
        return {
          position: m.to,
          highlight: HighlightColor.RED
        }
      });

      this.highlightingService.clearSquaresByPosition(...getValidCaptures.map(e => e.position))
      this.highlightingService.addSquares(...validSquares, ...getValidCaptures);
    }
  }

  public dragEnd(e: DragEvent): void {
    LoggingUtils.log(LogLevel.INFO, () => `dragEnd: ${e}`);
    if (this.grabbedPiece === undefined) {
      return;
    }

    let dropPos: Square = this.positioningService.getMousePosition(e);
    let currentBoard: Board = this.boardService.getBoard();
    let executableMove: Move | undefined = MoveGenerationUtils.getExecutableMove(currentBoard, this.grabbedPiece, dropPos);
    this.lastMove = executableMove;

    if (executableMove?.piece.type === PieceType.PAWN) {
      const toPosition = SquareUtils.convertSquareToPosition(executableMove.to);
      if (executableMove?.piece.color === Color.WHITE) {
        if (toPosition.row === 8) {
          // pick a piece
          this.overlayPanel?.toggle(e);
          return;
        }
      }
      else {
        if (toPosition.row === 1) {
          // pick a piece
          this.overlayPanel?.toggle(e);
          return;
        }
      }
    }

    if (executableMove !== undefined) {
      this.clearAllSquares();
      this.boardService.executeMove(executableMove, currentBoard);
    }
    else {
      this.clearAllButLastMoveSquare();
      const lastMove: Move = this.moveHistoryService.getLastMove();
      const fromSquare: SquareWithHighlight = { position: lastMove.from, highlight: HighlightColor.BLUE };
      const toSquare: SquareWithHighlight = { position: lastMove.to, highlight: HighlightColor.BLUE };
      this.highlightingService.addSquares(fromSquare, toSquare);
    }
  }

  private clearAllSquares(): void {
    this.highlightingService.clearNotListedColoredSquares();
  }

  private clearAllButLastMoveSquare(): void {
    this.highlightingService.clearNotListedColoredSquares(HighlightColor.BLUE);
  }

  // TODO: event type has to change to specific type
  public selectPromotionPiece(event: any): void {

    const selectedPiece = this.getPieceType(event.option);
    LoggingUtils.log(LogLevel.INFO, () => `selectedPromotionPiece event: ${JSON.stringify(event)}\nselectedPiece: ${selectedPiece}`);

    if (this.lastMove !== undefined) {
      this.lastMove.promotedPiece = { type: selectedPiece, color: this.lastMove.piece.color, position: this.lastMove.to };

      this.boardService.executeMove(this.lastMove, this.boardService.getBoard());
    }

    this.overlayPanel?.hide();
  }

  /**
   * Returns the corresponding PieceType based on the given pieceName.
   * @param pieceName - The name of the piece.
   * @returns The corresponding PieceType.
   */
  private getPieceType(pieceName: string) {
    if (pieceName === PieceTypeRepresentation.QUEEN.valueOf()) {
      return PieceType.QUEEN;
    } else if (pieceName === PieceTypeRepresentation.ROOK.valueOf()) {
      return PieceType.ROOK;
    } else if (pieceName === PieceTypeRepresentation.BISHOP.valueOf()) {
      return PieceType.BISHOP;
    } else if (pieceName === PieceTypeRepresentation.KNIGHT.valueOf()) {
      return PieceType.KNIGHT;
    } else {
      LoggingUtils.log(LogLevel.ERROR, () => `getPieceType unknown piece: ${pieceName}`);
      return PieceType.PAWN;
    }
  }
}
