import { Component, Inject, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { DataList } from 'app/common/data-list';
import { DomUtil } from 'app/util/dom-util';
import { BackService } from 'app/services/back-service';
import { BackButtonPriority } from 'app/enums/backbutton-priority';

@Component({
  selector: 'hc-cmb-free-mobile-overlay',
  templateUrl: './combobox-free-mobile-overlay.component.html',
  styleUrls: ['./combobox-free-mobile-overlay.component.scss']
})
export class ComboBoxFreeMobileOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef;

  @ViewChild('list', { static: true })
  public list: ElementRef;

  @ViewChild('input', { static: true })
  public input: ElementRef;

  public entries: DataList;
  public selectedIndex: number;
  public inputValue: string;

  private afterOpenSub: Subscription;
  private backdropClickSub: Subscription;
  private onBackButtonListener: () => boolean;

  constructor(
    private backService: BackService,
    private dialogRef: MatDialogRef<ComboBoxFreeMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
    this.inputValue = data.value;
  }

  public ngOnInit(): void {
    this.onBackButtonListener = this.onBackButton.bind(this);
    this.backService.addBackButtonListener(this.onBackButtonListener, BackButtonPriority.Overlay);

    this.backdropClickSub = this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({ selected: false });
    });

    this.afterOpenSub = this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
        DomUtil.setSelection(this.input.nativeElement);
        this.input.nativeElement.focus();
      });
    });
  }

  public ngOnDestroy(): void {
    this.backService.removeBackButtonListener(this.onBackButtonListener);

    if (this.backdropClickSub) {
      this.backdropClickSub.unsubscribe();
    }

    if (this.afterOpenSub) {
      this.afterOpenSub.unsubscribe();
    }
  }

  private onBackButton(): boolean {
    this.dialogRef.close({ selected: false });
    return true;
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
    if (event.key === 'Escape') {
      this.dialogRef.close({
        selected: false
      });
    }
  }

  @HostListener('window:keyboardDidShow')
  public onKeyboardShown(): void {
    setTimeout(() => {
      this.scrollSelectedEntryIntoView();
    });
  }

  @HostListener('window:keyboardDidHide')
  public onKeyboardHidden(): void {
    setTimeout(() => {
      this.scrollSelectedEntryIntoView();
    });
  }
}
