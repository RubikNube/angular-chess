import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{ provide: APP_BASE_HREF, useValue: environment.production ? './' : '/' }]
})
export class AppComponent {
}
