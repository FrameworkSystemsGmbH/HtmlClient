import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComboBoxFreeMobileOverlayComponent } from '@app/controls/comboboxes/combobox-free-mobile/combobox-free-mobile-overlay.component';
import { ComboBoxMobileComponent } from '@app/controls/comboboxes/combobox-mobile.component';
import { FocusService } from '@app/services/focus.service';
import * as DomUtil from '@app/util/dom-util';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'hc-cmb-free-mobile',
  templateUrl: './combobox-free-mobile.component.html',
  styleUrls: ['./combobox-free-mobile.component.scss'],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ComboBoxFreeMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control', { static: true })
  public control: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef<HTMLDivElement> | null = null;

  public iconCaretDown: IconDefinition = faCaretDown;

  private readonly _dialog: MatDialog;

  private _inputValue: string | null = null;
  private _overlayShown: boolean = false;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    dialog: MatDialog
  ) {
    super(cdr, focusService);
    this._dialog = dialog;
  }

  public getControl(): ElementRef<HTMLDivElement> | null {
    return this.control;
  }

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  protected getInputValue(): string | null {
    return this._inputValue;
  }

  protected setInputValue(value: string | null): void {
    this._inputValue = value;
  }

  public getSelectedPk(): string | null {
    return this.getSelectedValue();
  }

  public getSelectedValue(): string | null {
    const selectedIndex: number | null = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getInputValue();
    } else if (this.entries != null) {
      return this.entries[selectedIndex].getValue();
    } else {
      return null;
    }
  }

  public getDisplayValue(): string | null {
    const inputValue: string | null = this.getInputValue();

    if (inputValue != null && inputValue.length > 0) {
      return inputValue;
    }

    const selectedIndex: number | null = this.getSelectedIndex();

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return this.entries[selectedIndex].getValue();
    }

    return this.getPlaceholder();
  }

  public getPlaceholderShown(): boolean {
    const captionAsPlaceholder: boolean | null = this.getWrapper().getCaptionAsPlaceholder();

    if (!captionAsPlaceholder) {
      return false;
    }

    const inputValue: string | null = this.getInputValue();

    if (inputValue != null && inputValue.length > 0) {
      return false;
    }

    const selectedIndex: number | null = this.getSelectedIndex();

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return false;
    }

    return true;
  }

  public onContainerMouseDown(event: any): void {
    if (this.control != null && (!event.target || !DomUtil.isDescentantOrSelf(this.control.nativeElement, event.target))) {
      event.preventDefault();
    }
  }

  public onControlClick(): void {
    if (this.isEditable) {
      this._overlayShown = true;

      const dialogRef: MatDialogRef<ComboBoxFreeMobileOverlayComponent> = this._dialog.open(ComboBoxFreeMobileOverlayComponent, {
        backdropClass: 'hc-backdrop',
        minWidth: 300,
        maxWidth: '90%',
        maxHeight: '90%',
        data: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex(),
          value: this.getInputValue(),
          placeholder: this.getPlaceholder()
        }
      });

      dialogRef.afterClosed().subscribe({
        next: data => {
          if (this.control != null) {
            this.control.nativeElement.focus();
          }

          this._overlayShown = false;

          if (data.selected) {
            if (data.index != null) {
              this.setSelectedIndex(data.index);
              this.setInputValue(null);
            } else if (data.value != null) {
              this.setInputValue(data.value);
              this.setSelectedIndex(null);
            }
            this.callSelectionChanged();
          }
        }
      });
    }
  }

  public callCtrlEnter(event: any): void {
    if (!this._overlayShown) {
      super.callCtrlEnter(event);
    }
  }

  public callCtrlLeave(event: any): void {
    if (!this._overlayShown) {
      super.callCtrlLeave(event);
    }
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.setInputValue(wrapper.getValue());
    const wrpValue: string | null = wrapper.getValue();
    this.setSelectedIndex(this.entries != null && this.entries.length > 0 && wrpValue != null ? this.entries.findIndexOnValue(wrpValue) : null);
  }
}
