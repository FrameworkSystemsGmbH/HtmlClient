import { Component, ViewChild, ElementRef, Injector } from '@angular/core';

import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { TextBoxNumberWrapper } from '@app/wrappers/textbox-number-wrapper';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import { TextFormat } from '@app/enums/text-format';
import { ParseMethod } from '@app/enums/parse-method';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef;

  public value: string;

  private format: TextFormat;
  private formatPattern: string;

  private numberFormatService: NumberFormatService;

  constructor(injector: Injector) {
    super(injector);
  }

  protected init(): void {
    super.init();
    this.numberFormatService = this.getInjector().get(NumberFormatService);
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
          const formattedValue: string = this.numberFormatService.formatString(this.value, ParseMethod.Client, this.format, this.formatPattern);
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
    this.getWrapper().setValue(this.numberFormatService.parseString(this.value, ParseMethod.Client, this.format, this.formatPattern));
  }

  protected updateData(wrapper: TextBoxNumberWrapper): void {
    super.updateData(wrapper);
    this.format = wrapper.getFormat();
    this.formatPattern = wrapper.getFormatPattern();
    this.value = this.numberFormatService.formatNumber(wrapper.getValue(), this.format, this.formatPattern);
  }
}
