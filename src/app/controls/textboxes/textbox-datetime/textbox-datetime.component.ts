import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
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

  private format: TextFormat;
  private formatPattern: string;

  private dateTimeFormatService: DateTimeFormatService;

  protected init(): void {
    super.init();
    this.dateTimeFormatService = this.getInjector().get(DateTimeFormatService);
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
          const formattedValue: string = this.dateTimeFormatService.formatString(this.value, this.format, this.formatPattern);
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
    this.getWrapper().setValue(this.dateTimeFormatService.parseString(this.value, this.format, this.formatPattern));
  }

  protected updateData(wrapper: TextBoxDateTimeWrapper): void {
    super.updateData(wrapper);
    this.format = wrapper.getFormat();
    this.formatPattern = wrapper.getFormatPattern();
    this.value = this.dateTimeFormatService.formatDate(wrapper.getValue(), this.format, this.formatPattern);
  }
}
