import { Component, ElementRef, ViewChild } from '@angular/core';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/takeUntil';

import { ComboBoxMobileComponent } from 'app/controls/combobox-mobile.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { ComboBoxListMobileOverlay } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay';
import { ComboBoxListMobileOverlayRef } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay.ref';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-list-mobile',
  templateUrl: './combobox-list-mobile.component.html',
  styleUrls: ['./combobox-list-mobile.component.scss']
})
export class ComboBoxListMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control')
  public control: ElementRef;

  @ViewChild('arrow')
  public arrow: ElementRef;

  private overlayShown: boolean;

  constructor(private cmbOverlay: ComboBoxListMobileOverlay) {
    super();
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
      const cmbRef: ComboBoxListMobileOverlayRef = this.cmbOverlay.openCmbBoxOverlay({
        comboBoxData: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex()
        }
      });

      cmbRef.onClosed().subscribe(data => {
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

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    super.updateProperties(wrapper);
    this.setSelectedIndex(this.entries.findIndexOnPk(wrapper.getValue()));
  }
}
