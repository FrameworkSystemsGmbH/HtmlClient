import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const DEFAULT_TITLE: string = 'HTML Client';

@Injectable({ providedIn: 'root' })
export class TitleService {

  private readonly _title: Title;
  private _currentTitle: string | null = null;

  public constructor(title: Title) {
    this._title = title;
  }

  public getTitle(): string {
    return this._currentTitle != null ? this._currentTitle : DEFAULT_TITLE;
  }

  public setTitle(title: string): void {
    this._currentTitle = title;
    this.updateTitle();
  }

  public setDefault(): void {
    this._currentTitle = null;
    this.updateTitle();
  }

  private updateTitle(): void {
    this._title.setTitle(this.getTitle());
  }
}
