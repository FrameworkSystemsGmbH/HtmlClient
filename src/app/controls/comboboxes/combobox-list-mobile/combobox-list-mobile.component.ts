import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComboBoxListMobileOverlayComponent } from '@app/controls/comboboxes/combobox-list-mobile/combobox-list-mobile-overlay.component';
import { ComboBoxMobileComponent } from '@app/controls/comboboxes/combobox-mobile.component';
import { FocusService } from '@app/services/focus.service';
import * as DomUtil from '@app/util/dom-util';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';
import { faCaretDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'hc-cmb-list-mobile',
  templateUrl: './combobox-list-mobile.component.html',
  styleUrls: ['./combobox-list-mobile.component.scss']
})
export class ComboBoxListMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control', { static: true })
  public control: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef<HTMLDivElement> | null = null;

  public iconCaretDown: IconDefinition = faCaretDown;

  private readonly _dialog: MatDialog;

  private _overlayShown: boolean = false;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    dialog: MatDialog
  ) {
    super(cdr, focusService);
    this._dialog = dialog;
  }

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
    const selectedIndex: number | null = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      const wrpValue: string | null = this.getWrapper().getValue();
      if (wrpValue != null && wrpValue.trim().length > 0) {
        return `## ${wrpValue} ##`;
      } else {
        return '## NULL ##';
      }
    } else if (this.entries != null) {
      if (this.entries[selectedIndex].isNullEntry()) {
        return this.getPlaceholder();
      } else {
        return this.entries[selectedIndex].getValue();
      }
    } else {
      return this.getPlaceholder();
    }
  }

  public getPlaceholderShown(): boolean {
    const captionAsPlaceholder: boolean | null = this.getWrapper().getCaptionAsPlaceholder();
    const selectedIndex: number | null = this.getSelectedIndex();

    if (!captionAsPlaceholder) {
      return false;
    }

    if (selectedIndex == null || selectedIndex < 0) {
      return false;
    }

    if (this.entries != null && !this.entries[selectedIndex].isNullEntry()) {
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

      const dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent> = this._dialog.open(ComboBoxListMobileOverlayComponent, {
        backdropClass: 'hc-backdrop',
        data: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex()
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (this.control != null) {
          this.control.nativeElement.focus();
        }

        this._overlayShown = false;

        if (data.selected) {
          this.setSelectedIndex(data.index);
          this.callSelectionChanged();
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
    this.setSelectedIndex(this.entries != null && wrpValue != null ? this.entries.findIndexOnPk(wrpValue) : null);
  }
}
