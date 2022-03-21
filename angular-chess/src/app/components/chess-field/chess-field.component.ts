import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Color, HighlightColor, Square } from 'src/app/types/board.t';
import { Piece } from 'src/app/types/pieces.t';
import PieceUtils from 'src/app/utils/piece.utils';

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
  public square: Square | undefined | null = undefined;

  @Output()
  public dragStart: EventEmitter<DragEvent> = new EventEmitter();

  @Output()
  public readonly dragEnd: EventEmitter<DragEvent> = new EventEmitter();

  public isFieldDark(): boolean {
    if ((this.columnIndex % 2 === 0 && this.rowIndex % 2 === 1) ||
      (this.columnIndex % 2 === 1 && this.rowIndex % 2 === 0)
    ) return true;
    return false;
  }

  public getPieceChar(): string | undefined {
    if (this.piece) {
      return PieceUtils.getPieceChar(this.piece.type, Color.BLACK);
    }
    return undefined;
  }

}
