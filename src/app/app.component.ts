import { Component, OnInit, HostListener } from '@angular/core';

import { FormsService } from './services/forms.service';
import { WindowRefService } from './services/windowref.service';
import { FormWrapper } from './wrappers';

@Component({
  selector: 'hc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private formsService: FormsService,
    private windowRefService: WindowRefService) {}

  @HostListener('window:resize')
  public layout(): void {
    let form: FormWrapper = this.formsService.getSelectedForm();

    if (form) {
      form.doLayout();
    }
  }

}
