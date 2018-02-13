import { Component, Inject, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription';

import { DataList } from 'app/common/data-list';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-cmb-list-mobile-overlay',
  templateUrl: './combobox-list-mobile-overlay.component.html',
  styleUrls: ['./combobox-list-mobile-overlay.component.scss']
})
export class ComboBoxListMobileOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper')
  public wrapper: ElementRef;

  @ViewChild('scroller')
  public scroller: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  public entries: DataList;
  public selectedIndex: number;

  private afterOpenSub: ISubscription;
  private backdropClickSub: ISubscription;

  constructor(
    private dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
  }

  public ngOnInit(): void {
    this.backdropClickSub = this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({ selected: false });
    });

    this.afterOpenSub = this.dialogRef.afterOpen().subscribe(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
        this.wrapper.nativeElement.focus();
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

  protected scrollSelectedEntryIntoView(): void {
    if (!this.scroller || !this.list) { return; }
    const selectedLi: HTMLLIElement = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi, { center: true });
    }
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === 27) {
      this.dialogRef.close({
        selected: false
      });
    }
  }
}