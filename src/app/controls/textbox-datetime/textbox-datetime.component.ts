import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { TextBoxDateTimeWrapper } from '../../wrappers';
import { DateFormatService } from '../../services/formatter/date-format.service';

@Component({
  selector: 'hc-txt-datetime',
  templateUrl: './textbox-datetime.component.html',
  styleUrls: ['./textbox-datetime.component.scss']
})
export class TextBoxDateTimeComponent extends TextBoxBaseComponent implements OnInit {

  @ViewChild('input') input: ElementRef;

  public value: string;

  constructor(private dateFormatService: DateFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public callOnLeave(event: any): void {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    if (wrapper.getIsEditable()) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (String.isNullOrWhiteSpace(this.value)) {
          this.value = null;
          this.updateWrapper();
        } else {
          let formattedValue: string = this.dateFormatService.formatString(this.value, wrapper.getFormat(), wrapper.getFormatPattern());
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
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    this.value = this.dateFormatService.formatDate(wrapper.getValue(), wrapper.getFormat(), wrapper.getFormatPattern())
  }

  private updateWrapper(): void {
    let wrapper: TextBoxDateTimeWrapper = this.getWrapper();
    this.getWrapper().setValue(this.dateFormatService.parseString(this.value, wrapper.getFormat(), wrapper.getFormatPattern()));
  }
}
