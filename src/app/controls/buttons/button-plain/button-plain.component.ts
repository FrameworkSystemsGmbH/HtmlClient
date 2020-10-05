import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ButtonComponent } from '@app/controls/buttons/button.component';

@Component({
  selector: 'hc-btn-plain',
  templateUrl: './button-plain.component.html',
  styleUrls: ['./button-plain.component.scss']
})
export class ButtonPlainComponent extends ButtonComponent {

  @ViewChild('button', { static: true })
  public button: ElementRef;

  constructor(injector: Injector) {
    super(injector);
  }

  protected getButton(): ElementRef {
    return this.button;
  }
}
