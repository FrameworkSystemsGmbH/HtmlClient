import { Injectable } from '@angular/core';
/**
 * Setzt am LocalStoreage ein Item im Browser.
 * Wenn Cookies gelöscht werden, werden die gelöscht.
 * Tokens und SessionData
 */
@Injectable({ providedIn: 'root' })
export class WebStorageService {

  public load(key: string): string | null {
    return localStorage.getItem(key);
  }

  public save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public delete(key: string): void {
    localStorage.removeItem(key);
  }
}
