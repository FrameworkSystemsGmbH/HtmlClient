import { Component, ViewChild, ElementRef } from '@angular/core';

import { ButtonComponent } from 'app/controls/buttons/button.component';

@Component({
  selector: 'hc-btn-plain',
  templateUrl: './button-plain.component.html',
  styleUrls: ['./button-plain.component.scss']
})
export class ButtonPlainComponent extends ButtonComponent {

  @ViewChild('button')
  public button: ElementRef;

  protected getButton(): ElementRef {
    return this.button;
  }
}
