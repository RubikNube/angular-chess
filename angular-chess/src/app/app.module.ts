import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitterModule } from "primeng/splitter";
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './components/chess-board.component';
import { MoveHistoryComponent } from './components/move-history/move-history.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    MoveHistoryComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    FormsModule,
    DragDropModule,
    SplitterModule,
    TableModule,
    ToastModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    ListboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
