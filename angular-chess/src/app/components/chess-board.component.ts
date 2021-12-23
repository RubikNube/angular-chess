import { Component, OnInit } from '@angular/core';
import { ChessBoardService } from '../services/chess-board.service';
import { HighlightingService } from '../services/highlighting.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { PositioningService } from '../services/positioning.service';
import { HighlightColor, Position } from '../types/board.t';
import { Piece } from '../types/pieces.t';

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
    public positioningService: PositioningService) {
    boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
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

    let draggedPiece = this.boardService.getPieceOnPos(this.dragPos);

    if (draggedPiece !== undefined) {
      this.boardService.removePiece(draggedPiece);

      let dropPos: Position = this.positioningService.getMousePosition(e);
      let pieceOnDropPos = this.boardService.getPieceOnPos(dropPos);
      if (pieceOnDropPos !== undefined) {
        this.boardService.removePiece(pieceOnDropPos);
      }

      draggedPiece.position = dropPos;
      this.boardService.addPiece(draggedPiece);
    }
  }

  getCursor(piece: Piece) {
    return "grab";
  }
}
