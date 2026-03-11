import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextBoxComponent } from '@app/controls/textboxes/textbox.component';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxDefaultButton } from '@app/enums/msgbox-defaultbutton';
import { MsgBoxIcon } from '@app/enums/msgbox-icon';
import { TextFormat } from '@app/enums/text-format';
import { DialogService } from '@app/services/dialog.service';
import { StringFormatService } from '@app/services/formatter/string-format.service';
import { TextBoxPlainWrapper } from '@app/wrappers/textbox-plain-wrapper';

@Component({
  selector: 'hc-txt-plain',
  templateUrl: './textbox-plain.component.html',
  styleUrls: ['./textbox-plain.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TextBoxPlainComponent extends TextBoxComponent {

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  public value: string | null = null;
  public isPasswordField: boolean = false;

  private _format: TextFormat = TextFormat.None;
  private _regexPattern: string | null = null;

  private readonly _dialogService = inject(DialogService);
  private readonly _stringFormatService = inject(StringFormatService);

  public getInput(): ElementRef<HTMLElement> | null {
    return this.input;
  }

  public onInput(): void {
    this.value = this.formatValue(this.value);
  }

  public callCtrlLeave(event: any): void {
    if (this.isEditable) {
      if (this._regexPattern != null && this.value != null && this.value.length > 0) {
        if (!this.matchesFull(this.value, this._regexPattern)) {
          this._dialogService.showMsgBox({
            title: 'Validierung',
            message: `Der eingegebene Wert entspricht nicht dem erwarteten Format.\n\nErwartetes Format: ${this._regexPattern}`,
            icon: MsgBoxIcon.Exclamation,
            buttons: MsgBoxButtons.Ok,
            defaultButton: MsgBoxDefaultButton.First
          });
          this.updateComponent();
          super.callCtrlLeave(event);
          return;
        }
      }

      this.updateWrapper();
      super.callCtrlLeave(event);
    }
  }

  public getWrapper(): TextBoxPlainWrapper {
    return super.getWrapper() as TextBoxPlainWrapper;
  }

  private formatValue(value: string | null): string | null {
    if (value == null) {
      return null;
    }

    if (this.isPasswordField) {
      return value;
    }

    return this._stringFormatService.formatString(value, this._format);
  }

  private updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  /**
  * Prüft, ob der gesamte Wert dem Regex-Pattern entspricht.
  * Bildet das Verhalten von Java String.matches() nach, welches implizit
  * den gesamten String gegen das Pattern prüft (Full-Match).
  * JavaScript RegExp.test() hingegen prüft nur, ob das Pattern irgendwo
  * im String matcht (Partial-Match). Daher wird das Pattern hier in
  * ^(?:...)$ gewrappt, um einen Full-Match zu erzwingen.
  * Vorhandene ^/$ Anker werden vorher entfernt, um doppelte Anker zu vermeiden.
  */
  private matchesFull(value: string, pattern: string): boolean {
    try {
      const innerPattern: string = pattern.replace(/^\^/, '').replace(/\$$/, '');
      return new RegExp(`^(?:${innerPattern})$`).test(value);
    } catch {
      return true;
    }
  }

  protected updateData(wrapper: TextBoxPlainWrapper): void {
    super.updateData(wrapper);
    this._format = wrapper.getFormat();
    this._regexPattern = wrapper.getRegexPattern();
    this.isPasswordField = wrapper.isPasswordField();
    this.value = this.formatValue(wrapper.getValue());
  }
}
