import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';

import { TextBoxBaseComponent } from '../textbox-base.component';
import { TextBoxNumberWrapper } from '../../wrappers/textbox-number-wrapper';
import { NumberFormatService } from '../../services/formatter/number-format.service';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxBaseComponent implements OnInit {

  @ViewChild('input') input: ElementRef;

  public value: string;

  constructor(private numberFormatService: NumberFormatService) {
    super();
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public callOnLeave(event: any): void {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();
    if (wrapper.getIsEditable()) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (String.isNullOrWhiteSpace(this.value)) {
          this.value = null;
          this.updateWrapper();
        } else {
          let formattedValue: string = this.numberFormatService.formatString(this.value, wrapper.getFormat(), wrapper.getFormatPattern());
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
    let wrapper: TextBoxNumberWrapper = this.getWrapper();
    this.value = this.numberFormatService.formatNumber(this.getWrapper().getValue(), wrapper.getFormat(), wrapper.getFormatPattern());
  }

  private updateWrapper(): void {
    let wrapper: TextBoxNumberWrapper = this.getWrapper();
    this.getWrapper().setValue(this.numberFormatService.parseString(this.value, wrapper.getFormat(), wrapper.getFormatPattern()));
  }
}
