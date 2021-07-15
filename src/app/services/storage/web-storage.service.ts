import { Injectable } from '@angular/core';

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
