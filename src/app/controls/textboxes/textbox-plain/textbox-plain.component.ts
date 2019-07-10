import { Component, ElementRef, ViewChild } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textboxes/textbox.component';
import { TextBoxPlainWrapper } from 'app/wrappers/textbox-plain-wrapper';
import { StringFormatService } from 'app/services/formatter/string-format.service';
import { TextFormat } from 'app/enums/text-format';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss']
})
export class TextBoxPlainComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef;

  public value: string;
  public isPasswordField: boolean;

  private format: TextFormat;

  constructor(private stringFormatService: StringFormatService) {
    super();
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public onInput(event: any): void {
    this.value = this.formatValue(this.value);
  }

  public callOnLeave(event: any): void {
    if (this.isEditable) {
      this.updateWrapper();
      super.callOnLeave(event);
    }
  }

  public getWrapper(): TextBoxPlainWrapper {
    return super.getWrapper() as TextBoxPlainWrapper;
  }

  private formatValue(value: string): string {
    return this.isPasswordField ? value : this.stringFormatService.formatString(value, this.format);
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  protected updateData(wrapper: TextBoxPlainWrapper): void {
    super.updateData(wrapper);
    this.format = wrapper.getFormat();
    this.isPasswordField = wrapper.isPasswordField();
    this.value = this.formatValue(wrapper.getValue());
  }
}
