import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { PositioningService } from 'src/app/services/positioning.service';
import BoardUtils from 'src/app/utils/board.utils';
import { ImportFenComponent } from './import-fen/import-fen.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
  providers: [DialogService, MessageService]
})
export class MainMenuComponent {
  public menuItems: MenuItem[];
  private ref: DynamicDialogRef | undefined;

  constructor(
    private boardService: ChessBoardService,
    private positioningService: PositioningService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private clipboard: Clipboard) {
    this.menuItems = [
      {
        label: 'Edit',
        icon: PrimeIcons.PENCIL,
        items: [
          { label: 'Import FEN', icon: PrimeIcons.DOWNLOAD, command: () => this.showImportFenDialog() },
          { label: 'Copy FEN To Clipboard', icon: PrimeIcons.UPLOAD, command: () => this.copyCurrentFenToClipboard() },
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

  private showImportFenDialog(): void {
    this.ref = this.dialogService.open(ImportFenComponent, {
      header: 'Import FEN'
    });
  }

  public ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  private copyCurrentFenToClipboard() {
    const currentFen = BoardUtils.getFen(this.boardService.getBoard());
    this.clipboard.copy(currentFen);

    this.showInfo(`Copied '${currentFen}'`)
  }

  private showInfo(message: string) {
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Copy FEN', detail: message });
  }
}
