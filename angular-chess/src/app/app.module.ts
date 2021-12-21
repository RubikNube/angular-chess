import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from 'primeng/dragdrop';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    FormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
