import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { TextFormat } from '@app/enums/text-format';
import { FocusService } from '@app/services/focus.service';
import { StringFormatService } from '@app/services/formatter/string-format.service';
import { TextBoxPlainWrapper } from '@app/wrappers/textbox-plain-wrapper';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss']
})
export class TextBoxPlainComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  public value: string | null = null;
  public isPasswordField: boolean = false;

  private _format: TextFormat = TextFormat.None;

  private readonly _stringFormatService: StringFormatService;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    stringFormatService: StringFormatService
  ) {
    super(cdr, focusService);
    this._stringFormatService = stringFormatService;
  }

  public getInput(): ElementRef<HTMLElement> | null {
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

  private formatValue(value: string | null): string | null {
    if (value == null) {
      return null;
    }

    if (this.isPasswordField) {
      return value;
    }

    return this._stringFormatService.formatString(value, this._format);
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  protected updateData(wrapper: TextBoxPlainWrapper): void {
    super.updateData(wrapper);
    this._format = wrapper.getFormat();
    this.isPasswordField = wrapper.isPasswordField();
    this.value = this.formatValue(wrapper.getValue());
  }
}
