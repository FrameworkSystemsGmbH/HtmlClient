import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { TextFormat } from '@app/enums/text-format';
import { FocusService } from '@app/services/focus.service';
import { DateTimeFormatService } from '@app/services/formatter/datetime-format.service';
import { TextBoxDateTimeWrapper } from '@app/wrappers/textbox-datetime-wrapper';
import * as Moment from 'moment-timezone';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  public value: string | null = null;

  private _format: TextFormat = TextFormat.None;
  private _formatPattern: string | null = null;

  private readonly _dateTimeFormatService: DateTimeFormatService;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    dateTimeFormatService: DateTimeFormatService
  ) {
    super(cdr, focusService);
    this._dateTimeFormatService = dateTimeFormatService;
  }

  public getInput(): ElementRef<HTMLInputElement> | null {
    return this.input;
  }

  public callCtrlLeave(event: any): void {
    if (this.isEditable && this.input != null) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (this.value == null || this.value.trim().length === 0) {
          this.value = null;
          this.updateWrapper();
        } else {
          const formattedValue: string | null = this._dateTimeFormatService.formatString(this.value, this._format, this._formatPattern);
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
    this.getWrapper().setValue(this.value != null ? this._dateTimeFormatService.parseString(this.value, this._format, this._formatPattern) : null);
  }

  protected updateData(wrapper: TextBoxDateTimeWrapper): void {
    super.updateData(wrapper);

    this._format = wrapper.getFormat();
    this._formatPattern = wrapper.getFormatPattern();

    const value: Moment.Moment | null = wrapper.getValue();
    this.value = value != null ? this._dateTimeFormatService.formatDate(value, this._format, this._formatPattern) : null;
  }
}
