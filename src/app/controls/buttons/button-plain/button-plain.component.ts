import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '@app/controls/buttons/button.component';

@Component({
  selector: 'hc-btn-plain',
  templateUrl: './button-plain.component.html',
  styleUrls: ['./button-plain.component.scss']
})
export class ButtonPlainComponent extends ButtonComponent {

  @ViewChild('button', { static: true })
  public button: ElementRef<HTMLButtonElement> | null = null;

  protected getButton(): ElementRef<HTMLButtonElement> | null {
    return this.button;
  }
}
