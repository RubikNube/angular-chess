import { Component, OnInit } from '@angular/core';
import { Color } from './board.t';
import { Piece, PieceType, Position } from './pieces.t';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  perspective = Color.WHITE;
  pieces: Piece[] = [];
  fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  dragPos: Position = { row: 0, column: 0 };

  constructor() {
    this.importFen(this.fen)
  }

  ngOnInit(): void {
  }

  switchBoard() {
    console.log("switchBoard");

    this.perspective = this.perspective === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  getTopPosition(piece: Piece): number {
    if (this.perspective === Color.WHITE) {
      return (8 - piece.position.row) * 12.5;
    }
    else {
      return (piece.position.row - 1) * 12.5;
    }
  }

  getLeftPosition(piece: Piece): number {
    if (this.perspective === Color.WHITE) {
      return (piece.position.column - 1) * 12.5
    }
    else {
      return (8 - piece.position.column) * 12.5;
    }
  }

  public importFen(newFen: string): void {
    console.log("importFen: " + newFen)
    this.fen = newFen;

    this.pieces = [];

    let fenRows: string[] = newFen.split("/");
    for (let j = 0; j < fenRows.length; j++) {
      let fenRow: string = fenRows[j];
      let currentPos: number = 0;
      for (let i = 0; i < fenRow.length; i++) {
        const currentChar = fenRow[i];
        console.log("currentChar " + currentChar);

        if (currentChar.match("\\d")) {
          let columnsToAdd = parseInt(currentChar);
          console.log("columnsToAdd " + columnsToAdd);
          currentPos += columnsToAdd;
        }
        else if (currentChar.toUpperCase().match("[R|B|Q|K|N|P]")) {
          let newPiece: Piece = {
            color: currentChar.match("[A-Z]") ? Color.WHITE : Color.BLACK,
            type: this.getPiece(currentChar),
            position: { row: 8 - j, column: currentPos + 1 }
          };

          console.log("add piece " + JSON.stringify(newPiece))

          this.pieces.push(newPiece);
          currentPos++;
        } else {
          console.error("Not a number or a piece char: " + currentChar);
        }
      }
    };
  }

  getPiece(pieceChar: string): PieceType {
    switch (pieceChar.toUpperCase()) {
      case 'K':
        return PieceType.KING;
      case 'Q':
        return PieceType.QUEEN;
      case 'R':
        return PieceType.ROOK;
      case 'B':
        return PieceType.BISHOP;
      case 'N':
        return PieceType.KNIGHT;
      case 'P':
        return PieceType.PAWN;
      default:
        throw Error("Unknown piece: " + pieceChar);
    }
  }

  dragStart(e: MouseEvent, c: any) {
    this.dragPos = this.getPosition(e);
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
    let draggedPiece = this.getPieceOnPos(this.dragPos);
    
    if (draggedPiece !== undefined) {
      this.removePiece(draggedPiece);
      
      let dropPos: Position = this.getPosition(e);
      let pieceOnDropPos=this.getPieceOnPos(dropPos);
      if(pieceOnDropPos!==undefined){
        this.removePiece(pieceOnDropPos);
      }

      draggedPiece.position = dropPos;
      this.pieces.push(draggedPiece);
    }
  }

  private getPieceOnPos(pos:Position):Piece|undefined {
    return this.pieces.find(p => {
      return p.position.row === pos.row
        && p.position.column === pos.column;
    });
  }

  private removePiece(draggedPiece: Piece) {
    let index = this.pieces.indexOf(draggedPiece, 0);
    if (index > -1) {
      this.pieces.splice(index, 1);
    }
  }
}
