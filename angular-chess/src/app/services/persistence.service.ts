import { Injectable } from '@angular/core';
import LoggingUtils, { LogLevel } from '../utils/logging.utils';

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
    LoggingUtils.log(LogLevel.INFO, () => `saving key ${key} value ${value}`);
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
    LoggingUtils.log(LogLevel.INFO, () => `loading key ${key} value ${parsedValue}`);
    return parsedValue;
  }
}
