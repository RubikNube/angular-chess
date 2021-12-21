import { Injectable } from '@angular/core';
import { Color, Position } from '../types/board.t';
import { Piece, PieceType } from '../types/pieces.t';

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {
  pieces: Piece[] = [];
  fen: string = "";

  constructor() { }

  public getPieces():Piece[]{
    return this.pieces;
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

  
  getPieceOnPos(pos: Position): Piece | undefined {
    return this.pieces.find(p => {
      return p.position.row === pos.row
        && p.position.column === pos.column;
    });
  }

  addPiece(piece:Piece){
    this.pieces.push(piece);
  }

  removePiece(draggedPiece: Piece) {
    let index = this.pieces.indexOf(draggedPiece, 0);
    if (index > -1) {
      this.pieces.splice(index, 1);
    }
  }

}
