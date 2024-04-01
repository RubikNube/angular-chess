import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { BoardThemingService, NamedTheme } from 'src/app/services/board-theming.service';
import { Color, HighlightColor, Square } from 'src/app/types/board.t';
import { Piece } from 'src/app/types/pieces.t';
import PieceUtils from 'src/app/utils/piece.utils';
import PositionUtils from 'src/app/utils/position.utils';

@Component({
  selector: 'app-chess-field',
  templateUrl: './chess-field.component.html',
  styleUrls: ['./chess-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessFieldComponent {

  public readonly HighlightColor = HighlightColor;

  @Input()
  public rowIndex!: number;

  @Input()
  public columnIndex!: number;

  @Input()
  public piece: Piece | undefined | null = undefined;

  @Input()
  public activePlayer: Color | null = Color.WHITE;

  @Input()
  public disabled: boolean | null = false;

  @Input()
  public square: Square | undefined | null = undefined;

  @Input()
  public boardTheme: NamedTheme | undefined | null;

  @Output()
  public dragStart: EventEmitter<DragEvent> = new EventEmitter();

  @Output()
  public readonly dragEnd: EventEmitter<DragEvent> = new EventEmitter();

  constructor(public themingSerive: BoardThemingService) { }

  public isFieldDark(): boolean {
    return (this.columnIndex + this.rowIndex) % 2 === 0;
  }

  public getPieceChar(): string | undefined {
    return this.piece ? PieceUtils.getPieceChar(this.piece.type, Color.BLACK) : undefined;
  }

  public getSquareRepresentation(columnIndex: number, rowIndex: number): string {
    return PositionUtils.getSquareRepresentation(columnIndex, rowIndex);
  }

  public getSquareColor(): Observable<string | undefined> {
    return combineLatest([
      this.themingSerive.isDarkModeActive$,
      this.themingSerive.selectedTheme$
    ]).pipe(
      map(([isDarkModeActive, selectedTheme]) => {
        if (isDarkModeActive) {
          return this.isFieldDark() ? selectedTheme?.modes.darkMode?.darkField : selectedTheme?.modes.darkMode?.lightField;
        } else {
          return this.isFieldDark() ? selectedTheme?.modes.lightMode?.darkField : selectedTheme?.modes.lightMode?.lightField;
        }
      })
    );
  }

  public getSquareNumberColor(): Observable<string | undefined> {
    return combineLatest([
      this.themingSerive.isDarkModeActive$,
      this.themingSerive.selectedTheme$
    ]).pipe(
      map(([isDarkModeActive, selectedTheme]) => {
        if (isDarkModeActive) {
          return this.isFieldDark() ? selectedTheme?.modes.darkMode?.darkNumber : selectedTheme?.modes.darkMode?.lightNumber;
        } else {
          return this.isFieldDark() ? selectedTheme?.modes.lightMode?.darkNumber : selectedTheme?.modes.lightMode?.lightNumber;
        }
      })
    );
  }

  public getPieceColor(): Observable<string | undefined> {
    return combineLatest([
      this.themingSerive.isDarkModeActive$,
      this.themingSerive.selectedTheme$
    ]).pipe(
      map(([isDarkModeActive, selectedTheme]) => {
        if (isDarkModeActive) {
          return this.isPieceBlack() ? selectedTheme?.modes.darkMode?.darkPiece : selectedTheme?.modes.darkMode?.lightPiece;
        } else {
          return this.isPieceBlack() ? selectedTheme?.modes.lightMode?.darkPiece : selectedTheme?.modes.lightMode?.lightPiece;
        }
      })
    );
  }

  public isPieceBlack(): boolean {
    return this.piece?.color === Color.BLACK;
  }
}
