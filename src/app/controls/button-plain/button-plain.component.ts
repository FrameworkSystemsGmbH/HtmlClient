import { Component, ElementRef, ViewChild } from '@angular/core';

import { ButtonBaseComponent } from '../button-base.component';

@Component({
  selector: 'hc-btn-plain',
  templateUrl: './button-plain.component.html',
  styleUrls: ['./button-plain.component.scss']
})
export class ButtonPlainComponent extends ButtonBaseComponent {

  @ViewChild('focus') focus: ElementRef;

  public callOnClick(event: any): void {
    super.callOnClick(event);
  }

  public callOnEnter(event: any): void {
    super.callOnEnter(event);
  }

  public callOnLeave(event: any): void {
    super.callOnLeave(event);
  }

  public callOnDrag(event: any): void {
    super.callOnDrag(event);
  }

  public callOnCanDrop(event: any): void {
    super.callOnCanDrop(event);
  }

  public getCaption(): string {
    return super.getCaption();
  }

  public showCaption(): boolean {
    return super.showCaption();
  }

  public getTabStop(): boolean {
    return this.getWrapper().getTabStop();
  }

  public getStyles(): any {
    return super.getStyles();
  }

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
