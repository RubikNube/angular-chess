import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitterModule } from "primeng/splitter";
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './components/chess-board.component';
import { ImportFenComponent } from './components/main-menu/import-fen/import-fen.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MoveHistoryComponent } from './components/move-history/move-history.component';
import { ChessFieldComponent } from './components/chess-field/chess-field.component';
import { ImportPgnComponent } from './components/main-menu/import-pgn/import-pgn.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    ChessFieldComponent,
    ImportFenComponent,
    ImportPgnComponent,
    MainMenuComponent,
    MoveHistoryComponent

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    ClipboardModule,
    ContextMenuModule,
    DragDropModule,
    DynamicDialogModule,
    FormsModule,
    ListboxModule,
    MenubarModule,
    OverlayPanelModule,
    SplitterModule,
    TableModule,
    ToastModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
