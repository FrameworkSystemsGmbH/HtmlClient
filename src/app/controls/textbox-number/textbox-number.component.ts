import { Component, ViewChild, ElementRef } from '@angular/core';

import { TextBoxComponent } from 'app/controls/textbox.component';
import { TextBoxNumberWrapper } from 'app/wrappers/textbox-number-wrapper';
import { NumberFormatService } from 'app/services/formatter/number-format.service';
import { TextFormat } from 'app/enums/text-format';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxComponent {

  @ViewChild('input')
  public input: ElementRef;

  public value: string;

  private format: TextFormat;
  private formatPattern: string;

  constructor(private numberFormatService: NumberFormatService) {
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
          const formattedValue: string = this.numberFormatService.formatString(this.value, this.format, this.formatPattern);
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

  private updateWrapper(): void {
    this.getWrapper().setValue(this.numberFormatService.parseString(this.value, this.format, this.formatPattern));
  }

  protected updateProperties(wrapper: TextBoxNumberWrapper): void {
    super.updateProperties(wrapper);
    this.format = wrapper.getFormat();
    this.formatPattern = wrapper.getFormatPattern();
    this.value = this.numberFormatService.formatNumber(wrapper.getValue(), this.format, this.formatPattern);
  }
}
