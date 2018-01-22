import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textbox.component';
import { TextBoxNumberWrapper } from 'app/wrappers/textbox-number-wrapper';
import { NumberFormatService } from 'app/services/formatter/number-format.service';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxComponent implements OnInit {

  @ViewChild('input')
  public input: ElementRef;

  public value: string;

  constructor(private numberFormatService: NumberFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public getInput(): ElementRef {
    return this.input;
  }

  public callOnLeave(event: any): void {
    const wrapper: TextBoxNumberWrapper = this.getWrapper();
    if (wrapper.getIsEditable()) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (String.isNullOrWhiteSpace(this.value)) {
          this.value = null;
          this.updateWrapper();
        } else {
          const formattedValue: string = this.numberFormatService.formatString(this.value, wrapper.getFormat(), wrapper.getFormatPattern());
          if (formattedValue == null) {
            this.updateComponent();
          } else {
            this.value = formattedValue;
            this.updateWrapper();
          }
        }
      }
    }

    super.callOnLeave(event);
  }

  public getWrapper(): TextBoxNumberWrapper {
    return super.getWrapper() as TextBoxNumberWrapper;
  }

  public setFocus(): void {
    this.input.nativeElement.focus();
  }

  public updateComponent(): void {
    const wrapper: TextBoxNumberWrapper = this.getWrapper();
    this.value = this.numberFormatService.formatNumber(wrapper.getValue(), wrapper.getFormat(), wrapper.getFormatPattern());
  }

  private updateWrapper(): void {
    const wrapper: TextBoxNumberWrapper = this.getWrapper();
    this.getWrapper().setValue(this.numberFormatService.parseString(this.value, wrapper.getFormat(), wrapper.getFormatPattern()));
  }
}
