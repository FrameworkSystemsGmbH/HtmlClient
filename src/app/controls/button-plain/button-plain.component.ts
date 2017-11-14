import { Component, ElementRef, ViewChild } from '@angular/core';

import { ButtonComponent } from '../button.component';

@Component({
  selector: 'hc-btn-plain',
  templateUrl: './button-plain.component.html',
  styleUrls: ['./button-plain.component.scss']
})
export class ButtonPlainComponent extends ButtonComponent {

  @ViewChild('focus')
  public focus: ElementRef;

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
