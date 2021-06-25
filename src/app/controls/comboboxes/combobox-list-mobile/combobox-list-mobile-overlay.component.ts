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

  private _afterOpenSub: Subscription;
  private _backdropClickSub: Subscription;
  private _onBackButtonListener: () => boolean;

  public constructor(
    private readonly _backService: BackService,
    private readonly _dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (KeyUtil.getKeyString(event) === 'Escape') {
      this._dialogRef.close({
        selected: false
      });
    }
  }

  public ngOnInit(): void {
    this._onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this._onBackButtonListener, BackButtonPriority.Overlay);

    this._backdropClickSub = this._dialogRef.backdropClick().subscribe(() => {
      this._dialogRef.close({ selected: false });
    });

    this._afterOpenSub = this._dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
        this.wrapper.nativeElement.focus();
      });
    });
  }

  public ngOnDestroy(): void {
    this._backService.removeBackButtonListener(this._onBackButtonListener);

    if (this._backdropClickSub) {
      this._backdropClickSub.unsubscribe();
    }

    if (this._afterOpenSub) {
      this._afterOpenSub.unsubscribe();
    }
  }

  private onBackButton(): boolean {
    this._dialogRef.close({ selected: false });
    return true;
  }

  public onEntrySelected(index: number): void {
    this._dialogRef.close({
      selected: true,
      index
    });
  }

  protected scrollSelectedEntryIntoView(): void {
    if (!this.scroller || !this.list) {
      return;
    }
    const selectedLi: HTMLLIElement = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi, { center: true });
    }
  }
}
