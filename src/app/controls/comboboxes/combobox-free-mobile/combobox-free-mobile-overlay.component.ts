import { Component, Inject, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription';

import { DataList } from 'app/common/data-list';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-free-mobile-overlay',
  templateUrl: './combobox-free-mobile-overlay.component.html',
  styleUrls: ['./combobox-free-mobile-overlay.component.scss']
})
export class ComboBoxFreeMobileOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('scroller')
  public scroller: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  @ViewChild('input')
  public input: ElementRef;

  public entries: DataList;
  public selectedIndex: number;
  public inputValue: string;

  private afterOpenSub: ISubscription;
  private backdropClickSub: ISubscription;

  constructor(
    private zone: NgZone,
    private dialogRef: MatDialogRef<ComboBoxFreeMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
    this.inputValue = data.value;
  }

  public ngOnInit(): void {
    this.backdropClickSub = this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({ selected: false });
    });

    this.afterOpenSub = this.dialogRef.afterOpen().subscribe(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
        DomUtil.setSelection(this.input.nativeElement);
        this.input.nativeElement.focus();
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.backdropClickSub) {
      this.backdropClickSub.unsubscribe();
    }

    if (this.afterOpenSub) {
      this.afterOpenSub.unsubscribe();
    }
  }

  public onEntrySelected(event: any, index: number): void {
    this.dialogRef.close({
      selected: true,
      index
    });
  }

  public onFreetextConfirm(event: any): void {
    const index: number = this.entries.findIndexOnValue(this.inputValue);

    if (index >= 0) {
      this.dialogRef.close({
        selected: true,
        index
      });
    } else {
      this.dialogRef.close({
        selected: true,
        value: this.inputValue
      });
    }
  }

  protected scrollSelectedEntryIntoView(): void {
    if (!this.scroller || !this.list) { return; }
    const selectedLi: HTMLLIElement = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi, { center: true });
    }
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.dialogRef.close({
        selected: false
      });
    }
  }

  @HostListener('window:keyboardDidShow')
  public onKeyboardShown(): void {
    this.zone.run(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
      });
    });
  }

  @HostListener('window:keyboardDidHide')
  public onKeyboardHidden(): void {
    this.zone.run(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
      });
    });
  }
}
