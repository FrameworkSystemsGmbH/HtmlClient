import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { TextBoxComponent } from '../textbox.component';
import { TextBoxPlainWrapper } from '../../wrappers/textbox-plain-wrapper';
import { StringFormatService } from '../../services/formatter/string-format.service';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss']
})
export class TextBoxPlainComponent extends TextBoxComponent implements OnInit {

  @ViewChild('input')
  public input: ElementRef;

  public value: string;

  constructor(
    private stringFormatService: StringFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public onInput(event: any): void {
    this.value = this.formatValue(this.value);
  }

  public callOnLeave(event: any): void {
    const wrapper: TextBoxPlainWrapper = this.getWrapper();
    if (wrapper.getIsEditable()) {
      this.updateWrapper();
      super.callOnLeave(event);
    }
  }

  public getWrapper(): TextBoxPlainWrapper {
    return super.getWrapper() as TextBoxPlainWrapper;
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  private formatValue(value: string): string {
    return this.stringFormatService.formatString(value, this.getWrapper().getFormat());
  }

  public updateComponent(): void {
    this.value = this.formatValue(this.getWrapper().getValue());
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }
}
