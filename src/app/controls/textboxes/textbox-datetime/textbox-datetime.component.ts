import { Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { TextFormat } from '@app/enums/text-format';
import { DateTimeFormatService } from '@app/services/formatter/datetime-format.service';
import { TextBoxDateTimeWrapper } from '@app/wrappers/textbox-datetime-wrapper';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef;

  public value: string;

  private _format: TextFormat;
  private _formatPattern: string;

  private _dateTimeFormatService: DateTimeFormatService;

  protected init(): void {
    super.init();
    this._dateTimeFormatService = this.getInjector().get(DateTimeFormatService);
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
          const formattedValue: string = this._dateTimeFormatService.formatString(this.value, this._format, this._formatPattern);
          if (formattedValue == null) {
            this.updateComponent();
          } else {
            this.value = formattedValue;
            this.updateWrapper();
          }
        }
      }

      super.callCtrlLeave(event);
    }
  }

  public getWrapper(): TextBoxDateTimeWrapper {
    return super.getWrapper() as TextBoxDateTimeWrapper;
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this._dateTimeFormatService.parseString(this.value, this._format, this._formatPattern));
  }

  protected updateData(wrapper: TextBoxDateTimeWrapper): void {
    super.updateData(wrapper);
    this._format = wrapper.getFormat();
    this._formatPattern = wrapper.getFormatPattern();
    this.value = this._dateTimeFormatService.formatDate(wrapper.getValue(), this._format, this._formatPattern);
  }
}
