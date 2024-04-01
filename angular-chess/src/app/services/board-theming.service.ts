import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from '../types/board.t';
import { PersistenceService } from './persistence.service';

export interface NamedTheme {
  name: string;
  modes: BoardThemeConfig;
}

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
  private readonly themeConfigUrl = './assets/themes/theme-config.json';
  private defaultTheme: NamedTheme = {
    name: 'DefaultTheme',
    modes: {
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
    }
  };

  private availableThemes: NamedTheme[] = [this.defaultTheme];
  private actualThemeIndex = 0;
  private readonly selectedTheme$$: BehaviorSubject<NamedTheme> = new BehaviorSubject(this.defaultTheme);
  public readonly selectedTheme$: Observable<NamedTheme> = this.selectedTheme$$.asObservable();

  // add a observable for the dark mode
  private readonly isDarkModeActive$$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isDarkModeActive$: Observable<boolean> = this.isDarkModeActive$$.asObservable();


  private constructor(
    @Inject(DOCUMENT) private document: Document,
    private persistenceService: PersistenceService,
    private http: HttpClient) {
    const persistedTheme: NamedTheme = this.persistenceService.load('selectedTheme');
    // check if persisted theme can be cast to a NamedTheme
    if (persistedTheme && persistedTheme.name && persistedTheme.modes) {
      this.loadAvailableThemes(persistedTheme);
      this.selectedTheme$$.next(persistedTheme);
    } else {
      this.loadAvailableThemes(this.defaultTheme);
      this.selectedTheme$$.next(this.availableThemes[0]);
    }
  }

  private loadAvailableThemes(persistedTheme: NamedTheme): void {
    this.http.get<NamedTheme[]>(this.themeConfigUrl).subscribe(
      (themes: NamedTheme[]) => {
        this.availableThemes = themes;
      },
      (error: any) => {
        if (persistedTheme) {
          this.availableThemes = [persistedTheme];
        }
        else {
          this.availableThemes = [this.defaultTheme];
        }
        console.error('Failed to load theme config:', error);
      }
    );
  }

  public toggleTheme(): void {
    this.actualThemeIndex = (this.actualThemeIndex + 1) % this.availableThemes.length;
    const newTheme = this.availableThemes[this.actualThemeIndex];
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

  public getSelectedTheme(): NamedTheme {
    return this.selectedTheme$$.getValue();
  }

  public getColorForPlayer(color: Color): string {
    const selectedTheme = this.getSelectedTheme();
    const mode = this.getDarkModeActive() ? selectedTheme.modes.darkMode : selectedTheme.modes.lightMode;
    return color === Color.WHITE ? mode.lightPiece : mode.darkPiece;
  }

  public getBackgroundColorForPlayer(color: Color): string {
    const selectedTheme = this.getSelectedTheme();
    if (this.getDarkModeActive()) {
      return selectedTheme.modes.darkMode.colorIndicator;
    }
    else {
      return selectedTheme.modes.lightMode.colorIndicator;
    }
  }
}
