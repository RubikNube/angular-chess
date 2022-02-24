import { Component, OnInit } from '@angular/core';
import { ChessBoardService } from 'src/app/services/chess-board.service';

@Component({
  selector: 'app-import-fen',
  templateUrl: './import-fen.component.html',
  styleUrls: ['./import-fen.component.css']
})
export class ImportFenComponent implements OnInit {

  constructor(public boardService: ChessBoardService) { }

  ngOnInit(): void {
  }

}
