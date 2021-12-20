import { Component, OnInit } from '@angular/core';
import { Color, Piece, PieceType } from './pieces.t';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  perspective = Color.WHITE;
  pieces = [
    { color: Color.WHITE, type: PieceType.ROOK, position: { row: 1, column: 1 } },
    { color: Color.WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 2 } },
    { color: Color.WHITE, type: PieceType.BISHOP, position: { row: 1, column: 3 } },
    { color: Color.WHITE, type: PieceType.QUEEN, position: { row: 1, column: 4 } },
    { color: Color.WHITE, type: PieceType.KING, position: { row: 1, column: 5 } },
    { color: Color.WHITE, type: PieceType.BISHOP, position: { row: 1, column: 6 } },
    { color: Color.WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 7 } },
    { color: Color.WHITE, type: PieceType.ROOK, position: { row: 1, column: 8 } },

    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 1 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 2 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 3 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 4 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 5 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 6 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 7 } },
    { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 8 } },

    { color: Color.BLACK, type: PieceType.ROOK, position: { row: 8, column: 1 } },
    { color: Color.BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 2 } },
    { color: Color.BLACK, type: PieceType.BISHOP, position: { row: 8, column: 3 } },
    { color: Color.BLACK, type: PieceType.QUEEN, position: { row: 8, column: 4 } },
    { color: Color.BLACK, type: PieceType.KING, position: { row: 8, column: 5 } },
    { color: Color.BLACK, type: PieceType.BISHOP, position: { row: 8, column: 6 } },
    { color: Color.BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 7 } },
    { color: Color.BLACK, type: PieceType.ROOK, position: { row: 8, column: 8 } },

    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 1 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 2 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 3 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 4 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 5 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 6 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 7 } },
    { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 8 } },
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

  switchBoard() {
    console.log("switchBoard");

    this.perspective = this.perspective === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  getTopPosition(piece: Piece): number {
    if(this.perspective===Color.WHITE){
      return (8 - piece.position.row) * 12.5;
    }
    else{
      return (piece.position.row-1) * 12.5;
    }
  }

  getLeftPosition(piece: Piece): number {
    if(this.perspective===Color.WHITE){
      return (piece.position.column - 1) * 12.5
    }
    else{
      return (8 - piece.position.column) * 12.5;
    }
  }

  importFen(fen:string):void{
    
  }
}
