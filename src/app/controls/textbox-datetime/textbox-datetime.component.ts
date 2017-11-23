import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textbox.component';
import { TextBoxDateTimeWrapper } from 'app/wrappers/textbox-datetime-wrapper';
import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends TextBoxComponent implements OnInit {

  @ViewChild('input')
  public input: ElementRef;

  public value: string;

  constructor(private dateTimeFormatService: DateTimeFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public callOnLeave(event: any): void {
    const wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    if (wrapper.getIsEditable()) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (String.isNullOrWhiteSpace(this.value)) {
          this.value = null;
          this.updateWrapper();
        } else {
          const formattedValue: string = this.dateTimeFormatService.formatString(this.value, wrapper.getFormat(), wrapper.getFormatPattern());
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

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public updateComponent(): void {
    const wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    this.value = this.dateTimeFormatService.formatDate(wrapper.getValue(), wrapper.getFormat(), wrapper.getFormatPattern());
  }

  private updateWrapper(): void {
    const wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    this.getWrapper().setValue(this.dateTimeFormatService.parseString(this.value, wrapper.getFormat(), wrapper.getFormatPattern()));
  }
}
