import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const DEFAULT_TITLE: string = 'HTML Client';

@Injectable()
export class TitleService {

  private currentTitle: string;

  public constructor(private readonly title: Title) { }

  public getTitle(): string {
    return !String.isNullOrWhiteSpace(this.currentTitle) ? this.currentTitle : DEFAULT_TITLE;
  }

  public setTitle(title: string): void {
    this.currentTitle = title;
    this.updateTitle();
  }

  public setDefault(): void {
    this.currentTitle = null;
    this.updateTitle();
  }

  private updateTitle(): void {
    this.title.setTitle(this.getTitle());
  }
}
