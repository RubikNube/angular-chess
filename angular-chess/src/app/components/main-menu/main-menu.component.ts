import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BoardThemingService } from 'src/app/services/board-theming.service';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { MoveHistoryService } from 'src/app/services/move-history.service';
import { PositioningService } from 'src/app/services/positioning.service';
import BoardUtils from 'src/app/utils/board.utils';
import { ImportFenComponent } from './import-fen/import-fen.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  providers: [DialogService, MessageService]
})
export class MainMenuComponent {
  public menuItems: MenuItem[];
  private ref: DynamicDialogRef | undefined;

  private showHistoryItem: MenuItem = {
    id: 'show-history',
    label: 'Show move history',
    icon: PrimeIcons.LIST,
    command: () => this.moveHistoryService.showMoveHistory()
  };

  private hideHistoryItem: MenuItem = {
    id: 'hide-history',
    label: 'Hide move history',
    icon: PrimeIcons.LIST,
    command: () => this.moveHistoryService.hideMoveHistory()
  };

  private viewItems: MenuItem[] = [{
    label: 'Switch Board',
    icon: PrimeIcons.SYNC,
    command: () => this.positioningService.switchPerspective()
  }, {
    label: 'Toggle board theme',
    icon: PrimeIcons.MICROSOFT,
    command: () => this.themingService.toggleTheme()
  },
  this.showHistoryItem,
  this.hideHistoryItem];

  constructor(
    private boardService: ChessBoardService,
    private positioningService: PositioningService,
    private themingService: BoardThemingService,
    private moveHistoryService: MoveHistoryService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private clipboard: Clipboard
  ) {
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
        items: this.viewItems
      }
    ];;

    this.moveHistoryService.showMoveHistory$.subscribe(showHistory => {
      if (showHistory) {
        this.hideHistoryItem.visible = true;
        this.showHistoryItem.visible = false;
      }
      else {
        this.showHistoryItem.visible = true;
        this.hideHistoryItem.visible = false;
      }
    });
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
