import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { BaseComponent } from '..';
import { ButtonWrapper } from '../../wrappers';

@Component({
  selector: 'hc-btn',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends BaseComponent {

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('focus') focus: ElementRef;

  public getWrapper(): ButtonWrapper {
    return super.getWrapper() as ButtonWrapper;
  }

  public getCaption(): string {
    return this.getWrapper().getCaption();
  }

  public callOnClick(event: any): void {
    this.onClick.emit(event);
  }

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
