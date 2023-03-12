import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistenceService } from './persistence.service';

export interface BoardThemeConfig {
  darkField: string;
  lightField: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoardThemingService {

  private readonly woodTheme: BoardThemeConfig = {
    darkField: 'url(./assets/board_field_dark.png)',
    lightField: 'url(./assets/board_field_light.png)'
  };

  private readonly brownTheme: BoardThemeConfig = {
    darkField: '#882d17',
    lightField: '#c19a6b',
  };

  private readonly selectedTheme$$: BehaviorSubject<BoardThemeConfig> = new BehaviorSubject(this.woodTheme);
  public readonly selectedTheme$: Observable<BoardThemeConfig> = this.selectedTheme$$.asObservable();

  private constructor(private persistenceService: PersistenceService) {
    const persistedTheme = this.persistenceService.load('selectedTheme');
    if (persistedTheme) {
      this.selectedTheme$$.next(persistedTheme);
    }
   }

  public toggleTheme(): void {
    const actualTheme = this.selectedTheme$$.getValue();
    const newTheme = actualTheme === this.woodTheme ? this.brownTheme : this.woodTheme;
    this.persistenceService.save('selectedTheme', newTheme);
    this.selectedTheme$$.next(newTheme);
  }
}
