import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistenceService } from './persistence.service';

export interface BoardThemeConfig {
  lightMode: ModeConfig;
  darkMode: ModeConfig;
}

export interface ModeConfig {
  darkField: string;
  lightField: string;
  darkPiece: string;
  lightPiece: string;
  darkNumber: string;
  lightNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoardThemingService {
  private readonly woodTheme: BoardThemeConfig = {
    lightMode: {
      darkField: 'url(./assets/board_field_dark.png)',
      lightField: 'url(./assets/board_field_light.png)',
      darkPiece: 'black',
      lightPiece: 'white',
      darkNumber: '#c19a6b',
      lightNumber: '#300e05'
    },
    darkMode: {
      darkField: 'url(./assets/board_field_dark.png)',
      lightField: 'url(./assets/board_field_light.png)',
      darkPiece: '#C3602D',
      lightPiece: '#DCDCAA',
      darkNumber: '#c19a6b',
      lightNumber: '#300e05'
    }
  };

  private readonly brownTheme: BoardThemeConfig = {
    lightMode: {
      darkField: '#882d17',
      lightField: '#c19a6b',
      darkPiece: 'black',
      lightPiece: 'white',
      darkNumber: '#c19a6b',
      lightNumber: '#300e05'
    },
    darkMode: {
      darkField: '#181818',
      lightField: '#37373D',
      darkPiece: '#C3602D',
      lightPiece: '#DCDCAA',
      darkNumber: '#5e5ed1',
      lightNumber: '#5e5ed1'
    }
  };

  private readonly selectedTheme$$: BehaviorSubject<BoardThemeConfig> = new BehaviorSubject(this.woodTheme);
  public readonly selectedTheme$: Observable<BoardThemeConfig> = this.selectedTheme$$.asObservable();

  // add a observable for the dark mode
  private readonly isDarkModeActive$$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isDarkModeActive$: Observable<boolean> = this.isDarkModeActive$$.asObservable();

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

  public toggleDarkMode(): void {
    if (this.isDarkModeActive$$.getValue()) {
      this.isDarkModeActive$$.next(false);
    }
    else {
      this.isDarkModeActive$$.next(true);
    }
  }
}
