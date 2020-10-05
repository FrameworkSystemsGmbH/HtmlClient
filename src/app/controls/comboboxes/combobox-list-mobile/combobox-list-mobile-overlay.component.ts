import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataList } from '@app/common/data-list';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BackService } from '@app/services/back-service';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-cmb-list-mobile-overlay',
  templateUrl: './combobox-list-mobile-overlay.component.html',
  styleUrls: ['./combobox-list-mobile-overlay.component.scss']
})
export class ComboBoxListMobileOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper', { static: true })
  public wrapper: ElementRef;

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef;

  @ViewChild('list', { static: true })
  public list: ElementRef;

  public entries: DataList;
  public selectedIndex: number;

  private afterOpenSub: Subscription;
  private backdropClickSub: Subscription;
  private onBackButtonListener: () => boolean;

  constructor(
    private backService: BackService,
    private dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
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
        this.wrapper.nativeElement.focus();
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

  public onEntrySelected(index: number): void {
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
    if (KeyUtil.getKeyString(event) === 'Escape') {
      this.dialogRef.close({
        selected: false
      });
    }
  }
}
