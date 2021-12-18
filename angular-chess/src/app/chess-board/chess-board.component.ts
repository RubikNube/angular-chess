import { Component, OnInit } from '@angular/core';
import { PieceColor, PieceType } from './pieces.t';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  pieces = [
    { color: PieceColor.WHITE, type: PieceType.ROOK, position: { row: 1, column: 1 } },
    { color: PieceColor.WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 2 } },
    { color: PieceColor.WHITE, type: PieceType.BISHOP, position: { row: 1, column: 3 } },
    { color: PieceColor.WHITE, type: PieceType.QUEEN, position: { row: 1, column: 4 } },
    { color: PieceColor.WHITE, type: PieceType.KING, position: { row: 1, column: 5 } },
    { color: PieceColor.WHITE, type: PieceType.BISHOP, position: { row: 1, column: 6 } },
    { color: PieceColor.WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 7 } },
    { color: PieceColor.WHITE, type: PieceType.ROOK, position: { row: 1, column: 8 } },

    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 1 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 2 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 3 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 4 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 5 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 6 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 7 } },
    { color: PieceColor.WHITE, type: PieceType.PAWN, position: { row: 2, column: 8 } },

    { color: PieceColor.BLACK, type: PieceType.ROOK, position: { row: 8, column: 1 } },
    { color: PieceColor.BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 2 } },
    { color: PieceColor.BLACK, type: PieceType.BISHOP, position: { row: 8, column: 3 } },
    { color: PieceColor.BLACK, type: PieceType.QUEEN, position: { row: 8, column: 4 } },
    { color: PieceColor.BLACK, type: PieceType.KING, position: { row: 8, column: 5 } },
    { color: PieceColor.BLACK, type: PieceType.BISHOP, position: { row: 8, column: 6 } },
    { color: PieceColor.BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 7 } },
    { color: PieceColor.BLACK, type: PieceType.ROOK, position: { row: 8, column: 8 } },

    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 1 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 2 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 3 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 4 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 5 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 6 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 7 } },
    { color: PieceColor.BLACK, type: PieceType.PAWN, position: { row: 7, column: 8 } },
  ]

  constructor() {
  }

  ngOnInit(): void {
  }
}