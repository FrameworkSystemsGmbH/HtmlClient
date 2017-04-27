import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {

  private title: string;

  constructor(private titleRef: Title) {
    this.title = titleRef.getTitle();
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.titleRef.setTitle(title);
    this.title = title;
  }
}
