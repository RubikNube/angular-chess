import { Component, OnInit } from '@angular/core';
import { ChessBoardService } from '../services/chess-board.service';
import { MoveGenerationService } from '../services/move-generation.service';
import { Color, Field, HighlightColor, Position } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {
  perspective = Color.WHITE;
  dragPos: Position = { row: 0, column: 0 };
  grabbedPiece: Piece | undefined = undefined;
  fields: Field[] = [];

  constructor(public boardService:ChessBoardService,
    public moveGenerationService:MoveGenerationService) {
    boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  }

  ngOnInit(): void {
  }

  switchBoard() {
    console.log("switchBoard");

    this.perspective = this.perspective === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  getTopPosition(position: Position): number {
    if (this.perspective === Color.WHITE) {
      return (8 - position.row) * 12.5;
    }
    else {
      return (position.row - 1) * 12.5;
    }
  }

  getLeftPosition(position: Position): number {
    if (this.perspective === Color.WHITE) {
      return (position.column - 1) * 12.5
    }
    else {
      return (8 - position.column) * 12.5;
    }
  }

  dragStart(e: MouseEvent, c: any) {
    this.dragPos = this.getPosition(e);
    this.grabbedPiece = this.boardService.getPieceOnPos(this.dragPos);
    if (this.grabbedPiece !== undefined) {
      let validMoves = this.moveGenerationService.getValidMoves(this.grabbedPiece);

      let validFields: Field[] = validMoves.map(m => {
        return {
          position: m,
          highlight: HighlightColor.GREEN
        }
      });

      this.fields = validFields;
    }
  }

  getPosition(e: MouseEvent): Position {
    let boardElem = document.querySelector('div.board');
    let rect = boardElem?.getBoundingClientRect();

    let d_x = e.clientX - (rect?.x === undefined ? 0 : rect.x);
    let d_y = e.clientY - (rect?.y === undefined ? 0 : rect.y);

    // get corresponding square
    let ev_height = boardElem?.scrollHeight === undefined ? 1 : boardElem?.scrollHeight;
    let squareLength = ev_height / 8;

    // get row
    let row = Math.ceil(d_y / squareLength);

    // get column
    let column = 9 - Math.ceil(d_x / squareLength);

    if (this.perspective === Color.BLACK) {
      return { row: row, column: column };
    }
    else {
      return { row: 9 - row, column: 9 - column };
    }
  }

  dragEnd(e: MouseEvent) {
    document.body.classList.remove('inheritCursors');
    document.body.style.cursor = 'unset';

    let draggedPiece = this.boardService.getPieceOnPos(this.dragPos);

    if (draggedPiece !== undefined) {
      this.boardService.removePiece(draggedPiece);

      let dropPos: Position = this.getPosition(e);
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
