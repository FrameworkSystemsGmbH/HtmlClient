import { Component, OnInit, HostListener } from '@angular/core';

import { FormsService } from './services/forms.service';
import { WindowRefService } from './services/windowref.service';
import { FormWrapper } from './wrappers';
import { FocusService } from './services/focus.service';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private focusService: FocusService,
    private formsService: FormsService,
    private windowRefService: WindowRefService) { }

  @HostListener('window:resize')
  private layout(): void {
    let form: FormWrapper = this.formsService.getSelectedForm();
    if (form) {
      form.doLayout();
    }
  }

  @HostListener('window:keydown', ['$event'])
  private globalKeyDown(event: any): void {
    this.focusService.setLastKeyEvent(event);
  }

  @HostListener('window:mousedown', ['$event'])
  private globalMouseDown(event: any): void {
    this.focusService.setLastMouseEvent(event);
  }
}
