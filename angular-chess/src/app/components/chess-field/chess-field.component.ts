import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardThemeConfig } from 'src/app/services/board-theming.service';
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
  public boardTheme: BoardThemeConfig | undefined | null;

  @Output()
  public dragStart: EventEmitter<DragEvent> = new EventEmitter();

  @Output()
  public readonly dragEnd: EventEmitter<DragEvent> = new EventEmitter();

  public isFieldDark(): boolean {
    return (this.columnIndex + this.rowIndex) % 2 === 0;
  }

  public getPieceChar(): string | undefined {
    return this.piece ? PieceUtils.getPieceChar(this.piece.type, Color.BLACK) : undefined;
  }

  public getSquareRepresentation(columnIndex: number, rowIndex: number): string {
    return PositionUtils.getSquareRepresentation(columnIndex, rowIndex);
  }
}
