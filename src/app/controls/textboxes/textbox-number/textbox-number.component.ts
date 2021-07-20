import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { ParseMethod } from '@app/enums/parse-method';
import { TextFormat } from '@app/enums/text-format';
import { FocusService } from '@app/services/focus.service';
import { NumberFormatService } from '@app/services/formatter/number-format.service';
import { TextBoxNumberWrapper } from '@app/wrappers/textbox-number-wrapper';

@Component({
  selector: 'hc-txt-number',
  templateUrl: './textbox-number.component.html',
  styleUrls: ['./textbox-number.component.scss']
})
export class TextBoxNumberComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  public value: string | null = null;

  private _format: TextFormat = TextFormat.None;
  private _formatPattern: string | null = null;

  private readonly _numberFormatService: NumberFormatService;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    numberFormatService: NumberFormatService
  ) {
    super(cdr, focusService);
    this._numberFormatService = numberFormatService;
  }

  public getInput(): ElementRef<HTMLElement> | null {
    return this.input;
  }

  public callCtrlLeave(event: any): void {
    if (this.isEditable && this.input != null) {
      if (this.input.nativeElement.classList.contains('ng-dirty')) {
        if (this.value == null || this.value.trim().length === 0) {
          this.value = null;
          this.updateWrapper();
        } else {
          const formattedValue: string | null = this._numberFormatService.formatString(this.value, ParseMethod.Client, this._format, this._formatPattern);
          if (formattedValue == null) {
            this.updateComponent();
          } else {
            this.value = formattedValue;
            this.updateWrapper();
          }
        }

        this.getChangeDetectorRef().detectChanges();
      }
    }

    super.callCtrlLeave(event);
  }

  public getWrapper(): TextBoxNumberWrapper {
    return super.getWrapper() as TextBoxNumberWrapper;
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value != null ? this._numberFormatService.parseString(this.value, ParseMethod.Client, this._format, this._formatPattern) : null);
  }

  protected updateData(wrapper: TextBoxNumberWrapper): void {
    super.updateData(wrapper);

    this._format = wrapper.getFormat();
    this._formatPattern = wrapper.getFormatPattern();

    const value: number | null = wrapper.getValue();

    this.value = value != null ? this._numberFormatService.formatNumber(value, this._format, this._formatPattern) : null;
  }
}
