import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataList } from '@app/common/data-list';
import { DialogResizeDirective } from '@app/directives/dialog-resize.directive';
import { BackButtonPriority } from '@app/enums/backbutton-priority';
import { BackService } from '@app/services/back-service';
import * as DomUtil from '@app/util/dom-util';
import * as KeyUtil from '@app/util/key-util';
import { Subscription } from 'rxjs';

@Component({
    selector: 'hc-cmb-list-mobile-overlay',
    templateUrl: './combobox-list-mobile-overlay.component.html',
    styleUrls: ['./combobox-list-mobile-overlay.component.scss'],
    imports: [
        A11yModule,
        CommonModule,
        DialogResizeDirective
    ]
})
export class ComboBoxListMobileOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper', { static: true })
  public wrapper: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('scroller', { static: true })
  public scroller: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('list', { static: true })
  public list: ElementRef<HTMLUListElement> | null = null;

  public entries: DataList | null = null;
  public selectedIndex: number | null = null;

  private readonly _backService: BackService;
  private readonly _dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent>;

  private _afterOpenSub: Subscription | null = null;
  private _backdropClickSub: Subscription | null = null;
  private _onBackButtonListener: (() => boolean) | null = null;

  public constructor(
    backService: BackService,
    dialogRef: MatDialogRef<ComboBoxListMobileOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this._backService = backService;
    this._dialogRef = dialogRef;

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

    this._backdropClickSub = this._dialogRef.backdropClick().subscribe({
      next: () => {
        this._dialogRef.close({ selected: false });
      }
    });

    this._afterOpenSub = this._dialogRef.afterOpened().subscribe({
      next: () => {
        setTimeout(() => {
          this.scrollSelectedEntryIntoView();
          if (this.wrapper != null) {
            this.wrapper.nativeElement.focus();
          }
        });
      }
    });
  }

  public ngOnDestroy(): void {
    if (this._onBackButtonListener != null) {
      this._backService.removeBackButtonListener(this._onBackButtonListener);
    }

    this._backdropClickSub?.unsubscribe();
    this._afterOpenSub?.unsubscribe();
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
    const selectedLi: HTMLLIElement | null = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi, { center: true });
    }
  }
}
