import { Component, ViewChild, ElementRef } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textbox.component';
import { TextBoxDateTimeWrapper } from 'app/wrappers/textbox-datetime-wrapper';
import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';
import { TextFormat } from 'app/enums/text-format';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends TextBoxComponent {

  @ViewChild('input')
  public input: ElementRef;

  public value: string;

  private format: TextFormat;
  private formatPattern: string;

  constructor(private dateTimeFormatService: DateTimeFormatService) {
    super();
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public callOnLeave(event: any): void {
    if (this.isEditable) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (String.isNullOrWhiteSpace(this.value)) {
          this.value = null;
          this.updateWrapper();
        } else {
          const formattedValue: string = this.dateTimeFormatService.formatString(this.value, this.format, this.formatPattern);
          if (formattedValue == null) {
            this.updateComponent();
          } else {
            this.value = formattedValue;
            this.updateWrapper();
          }
        }
      }

      super.callOnLeave(event);
    }
  }

  public getWrapper(): TextBoxDateTimeWrapper {
    return super.getWrapper() as TextBoxDateTimeWrapper;
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.dateTimeFormatService.parseString(this.value, this.format, this.formatPattern));
  }

  protected updateProperties(wrapper: TextBoxDateTimeWrapper): void {
    super.updateProperties(wrapper);
    this.format = wrapper.getFormat();
    this.formatPattern = wrapper.getFormatPattern();
    this.value = this.dateTimeFormatService.formatDate(wrapper.getValue(), this.format, this.formatPattern);
  }
}
