import { Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { ParseMethod } from '@app/enums/parse-method';
import { TextFormat } from '@app/enums/text-format';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import { TextBoxNumberWrapper } from '@app/wrappers/textbox-number-wrapper';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef;

  public value: string;

  private _format: TextFormat;
  private _formatPattern: string;

  private _numberFormatService: NumberFormatService;

  protected init(): void {
    super.init();
    this._numberFormatService = this.getInjector().get(NumberFormatService);
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public callCtrlLeave(event: any): void {
    if (this.isEditable) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (String.isNullOrWhiteSpace(this.value)) {
          this.value = null;
          this.updateWrapper();
        } else {
          const formattedValue: string = this._numberFormatService.formatString(this.value, ParseMethod.Client, this._format, this._formatPattern);
          if (formattedValue == null) {
            this.updateComponent();
          } else {
            this.value = formattedValue;
            this.updateWrapper();
          }
        }
      }
    }

    super.callCtrlLeave(event);
  }

  public getWrapper(): TextBoxNumberWrapper {
    return super.getWrapper() as TextBoxNumberWrapper;
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this._numberFormatService.parseString(this.value, ParseMethod.Client, this._format, this._formatPattern));
  }

  protected updateData(wrapper: TextBoxNumberWrapper): void {
    super.updateData(wrapper);
    this._format = wrapper.getFormat();
    this._formatPattern = wrapper.getFormatPattern();
    this.value = this._numberFormatService.formatNumber(wrapper.getValue(), this._format, this._formatPattern);
  }
}
