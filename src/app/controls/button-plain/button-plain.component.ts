import { Component, ElementRef, ViewChild } from '@angular/core';

import { ButtonBaseComponent } from '../button-base.component';

@Component({
  selector: 'hc-btn-plain',
  templateUrl: './button-plain.component.html',
  styleUrls: ['./button-plain.component.scss']
})
export class ButtonPlainComponent extends ButtonBaseComponent {

  @ViewChild('focus') focus: ElementRef;

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
