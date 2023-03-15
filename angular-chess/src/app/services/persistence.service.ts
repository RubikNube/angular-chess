import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * This service is responsible for persisting the user settings.
 */
export class PersistenceService {
  constructor() { }

  /**
   * Saves the given value under the given key in local storage
   * 
   * @param key the key to save the value under
   * @param value the value to save 
   */
  public save(key: string, value: any): void {
    console.log('saving', key, value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * load value from local storage
   * 
   * @param key the key to load the value for
   * @returns the persisted value or undefined if no value was persisted
   */
  public load(key: string): any {
    const value = localStorage.getItem(key);
    if (!value) {
      return undefined;
    }
    const parsedValue = JSON.parse(value);
    console.log('loading', key, parsedValue);
    return parsedValue;
  }
}
