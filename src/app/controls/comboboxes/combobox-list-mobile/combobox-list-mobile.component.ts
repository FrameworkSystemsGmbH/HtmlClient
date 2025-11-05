import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComboBoxListMobileOverlayComponent } from '@app/controls/comboboxes/combobox-list-mobile/combobox-list-mobile-overlay.component';
import { ComboBoxMobileComponent } from '@app/controls/comboboxes/combobox-mobile.component';
import * as DomUtil from '@app/util/dom-util';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hc-cmb-list-mobile',
  templateUrl: './combobox-list-mobile.component.html',
  styleUrls: ['./combobox-list-mobile.component.scss'],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ComboBoxListMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control', { static: true })
  public control: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef<HTMLDivElement> | null = null;

  public iconCaretDown: IconDefinition = faCaretDown;

  private readonly _dialog = inject(MatDialog);

  private _overlayShown: boolean = false;

  public getControl(): ElementRef<HTMLElement> | null {
    return this.control;
  }

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  public getSelectedPk(): string | null {
    const selectedIndex: number | null = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getWrapper().getValue();
    } else if (this.entries != null) {
      return this.entries[selectedIndex].getPk();
    } else {
      return null;
    }
  }

  public getDisplayValue(): string | null {
    const wrpValue: string | null = this.getWrapper().getValue();
    const selectedIndex: number | null = this.getSelectedIndex();

    if ((selectedIndex == null || selectedIndex < 0) && wrpValue != null && wrpValue.trim().length > 0) {
      return `## ${wrpValue} ##`;
    }

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

    const wrpValue: string | null = this.getWrapper().getValue();
    const selectedIndex: number | null = this.getSelectedIndex();

    if ((selectedIndex == null || selectedIndex < 0) && wrpValue != null && wrpValue.trim().length > 0) {
      return false;
    }

    if (selectedIndex != null && selectedIndex >= 0 && this.entries != null && selectedIndex < this.entries.length && !this.entries[selectedIndex].isNullEntry()) {
      return false;
    }

    return true;
  }

  public onContainerMouseDown(event: any): void {
    if (this.control != null && (!event.target || !DomUtil.isDescendantOrSelf(this.control.nativeElement, event.target))) {
      event.preventDefault();
    }
  }

  public onControlClick(): void {
    if (this.isEditable) {
      this._overlayShown = true;

      const dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent> = this._dialog.open(ComboBoxListMobileOverlayComponent, {
        backdropClass: 'hc-backdrop',
        data: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex()
        }
      });

      dialogRef.afterClosed().subscribe({
        next: data => {
          if (this.control != null) {
            this.control.nativeElement.focus();
          }

          this._overlayShown = false;

          if (data.selected) {
            this.setSelectedIndex(data.index);
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
    const wrpValue: string | null = wrapper.getValue();
    this.setSelectedIndex(this.entries != null && this.entries.length > 0 && wrpValue != null ? this.entries.findIndexOnPk(wrpValue) : null);
  }
}
