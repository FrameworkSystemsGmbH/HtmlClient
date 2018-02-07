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
import { ComboBoxFreeMobileOverlay } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay';
import { ComboBoxFreeMobileOverlayRef } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay.ref';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-free-mobile',
  templateUrl: './combobox-free-mobile.component.html',
  styleUrls: ['./combobox-free-mobile.component.scss']
})
export class ComboBoxFreeMobileComponent extends ComboBoxMobileComponent {

  @ViewChild('control')
  public control: ElementRef;

  @ViewChild('arrow')
  public arrow: ElementRef;

  private inputValue: string;
  private overlayShown: boolean;

  constructor(private cmbOverlay: ComboBoxFreeMobileOverlay) {
    super();
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
      const cmbRef: ComboBoxFreeMobileOverlayRef = this.cmbOverlay.openCmbBoxOverlay({
        comboBoxData: {
          entries: this.entries,
          selectedIndex: this.getSelectedIndex(),
          value: this.getInputValue()
        }
      });

      cmbRef.onClosed().subscribe(data => {
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
    this.setInputValue(wrapper.getValue());
    this.setSelectedIndex(this.entries.findIndexOnValue(wrapper.getValue()));
  }
}
