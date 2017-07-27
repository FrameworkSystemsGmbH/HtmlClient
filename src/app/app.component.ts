import { Component, HostListener } from '@angular/core';

import { FocusService } from './services/focus.service';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private focusService: FocusService) { }

  @HostListener('window:keydown', ['$event'])
  private globalKeyDown(event: any): void {
    this.focusService.setLastKeyEvent(event);
  }

  @HostListener('window:mousedown', ['$event'])
  private globalMouseDown(event: any): void {
    this.focusService.setLastMouseEvent(event);
  }
}
