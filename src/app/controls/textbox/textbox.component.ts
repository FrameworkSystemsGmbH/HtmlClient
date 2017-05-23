import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { BaseComponent } from '..';

@Component({
  selector: 'hc-txt',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss']
})
export class TextBoxComponent extends BaseComponent {

  public value: string;

  @Output() onLeave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('focus') focus: ElementRef;

  public getValue() {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public callOnLeave(event: any): void {
    this.onLeave.emit(event);
  }

  public setFocus(): void {
    this.focus.nativeElement.focus();
  }
}
