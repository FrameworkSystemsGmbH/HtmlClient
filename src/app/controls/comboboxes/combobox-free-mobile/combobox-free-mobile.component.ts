import { Component, ElementRef, ViewChild, Injector } from '@angular/core';
import { IconDefinition, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { ComboBoxMobileComponent } from '@app/controls/comboboxes/combobox-mobile.component';
import { ComboBoxFreeMobileOverlayComponent } from '@app/controls/comboboxes/combobox-free-mobile/combobox-free-mobile-overlay.component';
import { ComboBoxWrapper } from '@app/wrappers/combobox-wrapper';

import * as DomUtil from '@app/util/dom-util';

@Component({
  selector: 'hc-cmb-free-mobile',
  templateUrl: './combobox-free-mobile.component.html',
  styleUrls: ['./combobox-free-mobile.component.scss']
})
export class ComboBoxFreeMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control', { static: true })
  public control: ElementRef;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef;

  public iconCaretDown: IconDefinition = faCaretDown;

  private inputValue: string;
  private overlayShown: boolean;

  private dialog: MatDialog;

  constructor(injector: Injector) {
    super(injector);
  }

  protected init(): void {
    super.init();
    this.dialog = this.getInjector().get(MatDialog);
  }

  public getControl(): ElementRef {
    return this.control;
  }

  public getArrowWidth(): number {
    return this.arrow ? this.arrow.nativeElement.getBoundingClientRect().width : 0;
  }

  protected getInputValue(): string {
    return this.inputValue;
  }

  protected setInputValue(value: string): void {
    this.inputValue = value;
  }

  public getSelectedPk(): string {
    return this.getSelectedValue();
  }

  public getSelectedValue(): string {
    const selectedIndex: number = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getInputValue();
    } else {
      return this.entries[selectedIndex].getValue();
    }
  }

  public onContainerMouseDown(event: any): void {
    if (!event.target || !DomUtil.isDescentantOrSelf(this.control.nativeElement, event.target)) {
      event.preventDefault();
    }
  }

  public onControlClick(event: any): void {
    if (this.isEditable) {
      this.overlayShown = true;

      const dialogRef: MatDialogRef<ComboBoxFreeMobileOverlayComponent> = this.dialog.open(ComboBoxFreeMobileOverlayComponent, {
        backdropClass: 'hc-backdrop',
        minWidth: 300,
        maxWidth: '90%',
        maxHeight: '90%',
        data: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex(),
          value: this.getInputValue()
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        this.control.nativeElement.focus();
        this.overlayShown = false;
        if (data.selected) {
          if (data.index != null) {
            this.setSelectedIndex(data.index);
            this.setInputValue(null);
          } else if (data.value != null) {
            this.setInputValue(data.value);
            this.setSelectedIndex(null);
          }
          this.callSelectionChanged(event);
        }
      });
    }
  }

  public callCtrlEnter(event: any): void {
    if (!this.overlayShown) {
      super.callCtrlEnter(event);
    }
  }

  public callCtrlLeave(event: any): void {
    if (!this.overlayShown) {
      super.callCtrlLeave(event);
    }
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.setInputValue(wrapper.getValue());
    this.setSelectedIndex(this.entries.findIndexOnValue(wrapper.getValue()));
  }
}
