import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BoardThemeConfig {
  darkField: string;
  lightField: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoardThemingService {

  private readonly woodTheme: BoardThemeConfig = {
    darkField: 'url(/board_field_dark.png)',
    lightField: 'url(/board_field_light.png)'
  };

  private readonly brownTheme: BoardThemeConfig = {
    darkField: '#b58863',
    lightField: '#f0d9b5',
  };

  private readonly selectedTheme$$: BehaviorSubject<BoardThemeConfig> = new BehaviorSubject(this.woodTheme);
  public readonly selectedTheme$: Observable<BoardThemeConfig> = this.selectedTheme$$.asObservable();

  public toggleTheme(): void {
    const actualTheme = this.selectedTheme$$.getValue();
    this.selectedTheme$$.next(actualTheme === this.woodTheme ? this.brownTheme : this.woodTheme)
  }

}
