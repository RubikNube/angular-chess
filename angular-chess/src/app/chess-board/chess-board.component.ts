import { Component, OnInit } from '@angular/core';
import { Color, Piece, PieceType } from './pieces.t';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  perspective = Color.WHITE;
  pieces: Piece[] = [];
  fen:string="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

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
    console.log("importFen: "+newFen)
    this.fen=newFen;

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
}
