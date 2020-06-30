import { Component, ElementRef, ViewChild, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ComboBoxMobileComponent } from 'app/controls/comboboxes/combobox-mobile.component';
import { ComboBoxListMobileOverlayComponent } from 'app/controls/comboboxes/combobox-list-mobile/combobox-list-mobile-overlay.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';

import * as DomUtil from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-list-mobile',
  templateUrl: './combobox-list-mobile.component.html',
  styleUrls: ['./combobox-list-mobile.component.scss']
})
export class ComboBoxListMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control', { static: true })
  public control: ElementRef;

  @ViewChild('arrow', { static: true })
  public arrow: ElementRef;

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

  public getSelectedPk(): string {
    const selectedIndex: number = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return this.getWrapper().getValue();
    } else {
      return this.entries[selectedIndex].getPk();
    }
  }

  public getSelectedValue(): string {
    const selectedIndex: number = this.getSelectedIndex();
    if (selectedIndex == null || selectedIndex < 0) {
      return '## ' + this.getWrapper().getValue() + ' ##';
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

      const dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent> = this.dialog.open(ComboBoxListMobileOverlayComponent, {
        backdropClass: 'hc-backdrop',
        data: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex()
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        this.control.nativeElement.focus();
        this.overlayShown = false;
        if (data.selected) {
          this.setSelectedIndex(data.index);
          this.callOnSelectionChanged(event);
        }
      });
    }
  }

  public callOnEnter(event: any): void {
    if (!this.overlayShown) {
      super.callOnEnter(event);
    }
  }

  public callOnLeave(event: any): void {
    if (!this.overlayShown) {
      super.callOnLeave(event);
    }
  }

  protected updateData(wrapper: ComboBoxWrapper): void {
    super.updateData(wrapper);
    this.setSelectedIndex(this.entries.findIndexOnPk(wrapper.getValue()));
  }
}
