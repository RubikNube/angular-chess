import { Component } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { PositioningService } from 'src/app/services/positioning.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
  public menuItems: MenuItem[];

  constructor(
    private boardService: ChessBoardService,
    private positioningService: PositioningService) {
    this.menuItems = [
      {
        label: 'Edit',
        icon: PrimeIcons.PENCIL,
        items: [
          { label: 'Import FEN', icon: PrimeIcons.DOWNLOAD },
          { label: 'Export FEN', icon: PrimeIcons.UPLOAD },
          { label: 'Reset Board', icon: PrimeIcons.REFRESH, command: () => this.resetBoard() }
        ]
      },
      {
        label: 'View',
        icon: PrimeIcons.EYE,
        items: [{
          label: 'Switch Board',
          icon: PrimeIcons.SYNC,
          command: () => this.positioningService.switchPerspective()
        }]
      }
    ];
  }

  private resetBoard(): void {
    this.boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq");
  }

}
