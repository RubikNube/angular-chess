import { Component, OnInit } from '@angular/core';
import { ChessBoardService } from '../services/chess-board.service';
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
  fen: string = "";

  constructor(public boardService:ChessBoardService) {
    boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
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
      let validMoves = this.getValidMoves(this.grabbedPiece);

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
    // console.log("getCursor " + JSON.stringify({ piece: piece, grabbedPiece: this.grabbedPiece }))
    // if(this.grabbedPiece!==undefined&&this.grabbedPiece===piece){
    //   return "grabbing";
    // }
    // else{
    //   return "grab";
    // }
    return "grab";
  }


  getValidMoves(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];

    if (piece.type === PieceType.PAWN) {
      return this.getValidPawnMoves(piece);
    }

    return fieldsToMove;
  }

  getValidPawnMoves(piece: Piece): Position[] {
    let fieldsToMove: Position[] = [];

    // normalize position white <-> black
    let normalizedPosition: Position = this.normalizePosition(piece.color, piece.position);

    this.addIfFree(fieldsToMove,{
      column: piece.position.column,
      row: normalizedPosition.row + 1
    });

    if (normalizedPosition.row === 2) {
      this.addIfFree(fieldsToMove,{
        column: piece.position.column,
        row: normalizedPosition.row + 2
      });
    }
    return fieldsToMove.map(p => {
      return this.denormalizePosition(piece.color, p);
    });
  }

  private addIfFree(fieldsToMove: Position[],fieldToMove: Position) {
    if (this.isFree(fieldToMove)) {
      fieldsToMove.push(fieldToMove);
    }
  }

  isFree(position: Position): boolean {
    let result=this.boardService.getPieceOnPos(position)===undefined;
    console.log("isFree position:"+JSON.stringify(position)+", result: "+result);
    return result;
  }

  normalizePosition(color: Color, position: Position): Position {
    if (color === Color.WHITE) {
      return position;
    }
    else {
      return {
        row: 9 - position.row,
        column: position.column
      };
    }
  }

  denormalizePosition(color: Color, position: Position): Position {
    if (color === Color.WHITE) {
      return position;
    }
    else {
      return {
        row: 9 - position.row,
        column: position.column
      };
    }
  }

}
