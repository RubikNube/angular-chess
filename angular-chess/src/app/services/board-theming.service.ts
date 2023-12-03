import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersistenceService } from './persistence.service';
import { DOCUMENT } from '@angular/common';

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
  colorIndicator: string;
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
      lightNumber: '#300e05',
      colorIndicator: '#882d17',
    },
    darkMode: {
      darkField: 'url(./assets/dm_board_field_dark.png)',
      lightField: 'url(./assets/dm_board_field_light.png)',
      darkPiece: '#edad17',
      lightPiece: '#DCDCAA',
      darkNumber: '#DCDCAA',
      lightNumber: '#DCDCAA',
      colorIndicator: '#181818'
    }
  };

  private readonly brownTheme: BoardThemeConfig = {
    lightMode: {
      darkField: '#882d17',
      lightField: '#c19a6b',
      darkPiece: 'black',
      lightPiece: 'white',
      darkNumber: '#c19a6b',
      lightNumber: '#300e05',
      colorIndicator: '#882d17'
    },
    darkMode: {
      darkField: '#181818',
      lightField: '#37373D',
      darkPiece: '#C3602D',
      lightPiece: '#DCDCAA',
      darkNumber: '#5e5ed1',
      lightNumber: '#5e5ed1',
      colorIndicator: '#181818'
    }
  };

  private readonly selectedTheme$$: BehaviorSubject<BoardThemeConfig> = new BehaviorSubject(this.woodTheme);
  public readonly selectedTheme$: Observable<BoardThemeConfig> = this.selectedTheme$$.asObservable();

  // add a observable for the dark mode
  private readonly isDarkModeActive$$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isDarkModeActive$: Observable<boolean> = this.isDarkModeActive$$.asObservable();

  private constructor(
    @Inject(DOCUMENT) private document: Document,
    private persistenceService: PersistenceService) {
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
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (this.isDarkModeActive$$.getValue()) {
      this.isDarkModeActive$$.next(false);
      if (themeLink) {
        themeLink.href = 'md-light-indigo.css';
      }
    }
    else {
      this.isDarkModeActive$$.next(true);
      if (themeLink) {
        themeLink.href = 'md-dark-indigo.css';
      }
    }
  }

  public getDarkModeActive(): boolean {
    return this.isDarkModeActive$$.getValue();
  }

  public getSelectedTheme(): BoardThemeConfig {
    return this.selectedTheme$$.getValue();
  }
}
