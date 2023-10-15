import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BoardThemingService } from 'src/app/services/board-theming.service';
import { ChessBoardService } from 'src/app/services/chess-board.service';
import { EngineService } from 'src/app/services/engine.service';
import { MoveHistoryService } from 'src/app/services/move-history.service';
import { PositioningService } from 'src/app/services/positioning.service';
import { Color } from 'src/app/types/board.t';
import BoardUtils from 'src/app/utils/board.utils';
import { ImportFenComponent } from './import-fen/import-fen.component';
import { ImportPgnComponent } from './import-pgn/import-pgn.component';

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

  private readonly activateDarkMode: MenuItem = {
    label: 'Turn on dark mode',
    icon: PrimeIcons.MOON,
    command: () => this.themingService.toggleDarkMode()
  };

  private readonly deactivateDarkMode: MenuItem = {
    label: 'Turn off dark mode',
    icon: PrimeIcons.SUN,
    command: () => this.themingService.toggleDarkMode()
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
  this.activateDarkMode,
  this.deactivateDarkMode,
  this.showHistoryItem,
  this.hideHistoryItem];

  constructor(
    private boardService: ChessBoardService,
    private positioningService: PositioningService,
    private themingService: BoardThemingService,
    private moveHistoryService: MoveHistoryService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private clipboard: Clipboard,
    private engineService: EngineService
  ) {
    const startEngineItem: MenuItem = { label: 'Start Engine', icon: PrimeIcons.PLAY, command: () => this.engineService.startEngine() };
    const stopEngineItem: MenuItem = { label: 'Stop Engine', icon: PrimeIcons.PAUSE, command: () => this.engineService.stopEngine() };
    const toggleEngineWhite: MenuItem = { label: 'Toggle Engine Color', icon: PrimeIcons.CIRCLE_FILL, command: () => this.engineService.toggleEngineColor() };
    const toggleEngineBlack: MenuItem = { label: 'Toggle Engine Color', icon: PrimeIcons.CIRCLE, command: () => this.engineService.toggleEngineColor() };
    this.menuItems = [
      {
        label: 'Edit',
        icon: PrimeIcons.PENCIL,
        items: [
          { label: 'Import FEN', icon: PrimeIcons.DOWNLOAD, command: () => this.showImportFenDialog() },
          { label: 'Copy FEN To Clipboard', icon: PrimeIcons.UPLOAD, command: () => this.copyCurrentFenToClipboard() },
          { label: 'Import PGN', icon: PrimeIcons.DOWNLOAD, command: () => this.showImportPgnDialog() },
          { label: 'Export PGN', icon: PrimeIcons.UPLOAD, command: () => this.copyGameToClipboard() },
          { label: 'Reset Board', icon: PrimeIcons.REFRESH, command: () => this.resetBoard() }
        ]
      },
      {
        label: 'View',
        icon: PrimeIcons.EYE,
        items: this.viewItems
      },
      {
        label: 'Engine',
        icon: PrimeIcons.COG,
        items: [
          startEngineItem,
          stopEngineItem,
          toggleEngineWhite,
          toggleEngineBlack,
        ]
      }
    ];

    this.engineService.isRunning$.subscribe(isRunning => {
      startEngineItem.visible = !isRunning;
      stopEngineItem.visible = isRunning;
    });

    this.engineService.engineColor$.subscribe(engineColor => {
      toggleEngineWhite.visible = engineColor === Color.WHITE;
      toggleEngineBlack.visible = engineColor === Color.BLACK;
    });

    this.themingService.isDarkModeActive$.subscribe(isDarkModeActive => {
      this.activateDarkMode.visible = !isDarkModeActive;
      this.deactivateDarkMode.visible = isDarkModeActive;
    });

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

  private copyGameToClipboard(): void {
    const currentPgn = this.moveHistoryService.getPgn();
    this.clipboard.copy(currentPgn);

    this.showInfo(`Copied '${currentPgn}'`, 'Copy PGN')
  }

  private resetBoard(): void {
    this.boardService.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq");
  }

  private showImportFenDialog(): void {
    this.ref = this.dialogService.open(ImportFenComponent, {
      header: 'Import FEN'
    });
  }

  private showImportPgnDialog(): void {
    this.ref = this.dialogService.open(ImportPgnComponent, {
      header: 'Import PGN'
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

    this.showInfo(`Copied '${currentFen}'`, 'Copy FEN')
  }

  private showInfo(message: string, summary: string) {
    this.messageService.add({ key: 'tc', severity: 'info', summary, detail: message });
  }
}
