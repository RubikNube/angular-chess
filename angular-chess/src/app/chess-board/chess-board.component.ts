import { Component, OnInit } from '@angular/core';
import { Color, Field, HighlightColor, Position } from './../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {
  perspective = Color.WHITE;
  pieces: Piece[] = [];
  fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  dragPos: Position = { row: 0, column: 0 };
  grabbedPiece: Piece | undefined = undefined;
  fields: Field[] = [];

  constructor() {
    this.importFen(this.fen)
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
    this.grabbedPiece = this.getPieceOnPos(this.dragPos);
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

    let draggedPiece = this.getPieceOnPos(this.dragPos);

    if (draggedPiece !== undefined) {
      this.removePiece(draggedPiece);

      let dropPos: Position = this.getPosition(e);
      let pieceOnDropPos = this.getPieceOnPos(dropPos);
      if (pieceOnDropPos !== undefined) {
        this.removePiece(pieceOnDropPos);
      }

      draggedPiece.position = dropPos;
      this.pieces.push(draggedPiece);
    }
  }

  private getPieceOnPos(pos: Position): Piece | undefined {
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
    let result=this.getPieceOnPos(position)===undefined;
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
