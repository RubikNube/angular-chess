import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChessBoardComponent } from './components/chess-board.component';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from 'primeng/dragdrop';
import { MoveHistoryComponent } from './components/move-history/move-history.component';
import { SplitterModule } from "primeng/splitter";
import {TableModule} from 'primeng/table';

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
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
