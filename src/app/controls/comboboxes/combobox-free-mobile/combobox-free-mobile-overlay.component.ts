import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataList } from '@app/common/data-list';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BackService } from '@app/services/back-service';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hc-cmb-free-mobile-overlay',
  templateUrl: './combobox-free-mobile-overlay.component.html',
  styleUrls: ['./combobox-free-mobile-overlay.component.scss']
})
export class ComboBoxFreeMobileOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('list', { static: true })
  public list: ElementRef<HTMLUListElement> | null = null;

  @ViewChild('input', { static: true })
  public input: ElementRef<HTMLInputElement> | null = null;

  public entries: DataList;
  public selectedIndex: number;
  public inputValue: string;

  private _afterOpenSub: Subscription | null = null;
  private _backdropClickSub: Subscription | null = null;
  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    private readonly _backService: BackService,
    private readonly _dialogRef: MatDialogRef<ComboBoxFreeMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
    this.inputValue = data.value;
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent): void {
    if (KeyUtil.getKeyString(event) === 'Escape') {
      this._dialogRef.close({
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

  public ngOnInit(): void {
    this._onBackButtonListener = this.onBackButton.bind(this);
    this._backService.addBackButtonListener(this._onBackButtonListener, BackButtonPriority.Overlay);

    this._backdropClickSub = this._dialogRef.backdropClick().subscribe(() => {
      this._dialogRef.close({ selected: false });
    });

    this._afterOpenSub = this._dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.scrollSelectedEntryIntoView();
        if (this.input != null) {
          DomUtil.setSelection(this.input.nativeElement);
          this.input.nativeElement.focus();
        }
      });
    });
  }

  public ngOnDestroy(): void {
    if (this._onBackButtonListener != null) {
      this._backService.removeBackButtonListener(this._onBackButtonListener);
    }

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

  public onFreetextConfirm(): void {
    const index: number = this.entries.findIndexOnValue(this.inputValue);

    if (index >= 0) {
      this._dialogRef.close({
        selected: true,
        index
      });
    } else {
      this._dialogRef.close({
        selected: true,
        value: this.inputValue
      });
    }
  }

  protected scrollSelectedEntryIntoView(): void {
    if (!this.scroller || !this.list) {
      return;
    }
    const selectedLi: HTMLLIElement | null = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi, { center: true });
    }
  }
}
