import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const DEFAULT_TITLE: string = 'HTML Client';

@Injectable()
export class TitleService {

  private _currentTitle: string;

  public constructor(private readonly _title: Title) { }

  public getTitle(): string {
    return !String.isNullOrWhiteSpace(this._currentTitle) ? this._currentTitle : DEFAULT_TITLE;
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
