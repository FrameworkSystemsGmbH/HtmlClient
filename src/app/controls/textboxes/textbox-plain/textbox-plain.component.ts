import { Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { TextFormat } from '@app/enums/text-format';
import { StringFormatService } from '@app/services/formatter/string-format.service';
import { TextBoxPlainWrapper } from '@app/wrappers/textbox-plain-wrapper';

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

  private stringFormatService: StringFormatService;

  protected init(): void {
    super.init();
    this.stringFormatService = this.getInjector().get(StringFormatService);
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public onInput(): void {
    this.value = this.formatValue(this.value);
  }

  public callCtrlLeave(event: any): void {
    if (this.isEditable) {
      this.updateWrapper();
      super.callCtrlLeave(event);
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
