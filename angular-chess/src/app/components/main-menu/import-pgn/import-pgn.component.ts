import { Component } from '@angular/core';
import { ChessBoardService } from 'src/app/services/chess-board.service';

@Component({
  selector: 'app-import-pgn',
  templateUrl: './import-pgn.component.html',
  styleUrls: ['./import-pgn.component.scss']
})
export class ImportPgnComponent {

  constructor(public boardService: ChessBoardService) { }
}
