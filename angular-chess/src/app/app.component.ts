import { Component } from '@angular/core';
import { MoveHistoryService } from './services/move-history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public moveHistoryService: MoveHistoryService) {
  }
}
