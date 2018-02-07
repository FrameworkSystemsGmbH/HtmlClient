import { Component, Inject, HostListener, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, NgZone } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { ISubscription } from 'rxjs/Subscription';

import { IComboBoxFreeMobileOverlayData, IComboBoxFreeMobileOverlayClosedData } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay';

import { CMBBOX_DATA } from 'app/controls/combobox-free-mobile/combobox-free-mobile-overlay.tokens';
import { DomUtil } from 'app/util/dom-util';
import { DataList } from 'app/common/data-list';

@Component({
  selector: 'hc-cmb-list-mobile-overlay',
  templateUrl: './combobox-free-mobile-overlay.component.html',
  styleUrls: ['./combobox-free-mobile-overlay.component.scss']
})
export class ComboBoxFreeMobileOverlayComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output()
  public onFinished: EventEmitter<IComboBoxFreeMobileOverlayClosedData> = new EventEmitter<IComboBoxFreeMobileOverlayClosedData>();

  @ViewChild('scroller')
  public scroller: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  @ViewChild('input')
  public input: ElementRef;

  public entries: DataList;
  public selectedIndex: number;
  public inputValue: string;
  public sizeStyle: any;

  private backdropClickSub: ISubscription;

  constructor(
    private zone: NgZone,
    private overlayRef: OverlayRef,
    @Inject(CMBBOX_DATA) data: IComboBoxFreeMobileOverlayData
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
    this.inputValue = data.value;
  }

  public ngOnInit(): void {
    this.refreshSizeStyle();

    this.backdropClickSub = this.overlayRef.backdropClick().subscribe(() => {
      this.onFinished.emit({ selected: false });
    });
  }

  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
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
  }

  public onEntrySelected(event: any, index: number): void {
    this.onFinished.emit({
      selected: true,
      index
    });
  }

  public onFreetextConfirm(event: any): void {
    this.onFinished.emit({
      selected: true,
      value: this.inputValue
    });
  }

  protected scrollSelectedEntryIntoView(): void {
    if (!this.scroller || !this.list) { return; }
    const selectedLi: HTMLLIElement = this.list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(this.scroller.nativeElement, selectedLi);
    }
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.onFinished.emit({
        selected: false
      });
    }
  }

  @HostListener('window:resize')
  public refreshSizeStyle(): void {
    const vpWidth: number = DomUtil.getViewportWidth();
    const vpHeight: number = DomUtil.getViewportHeight();

    this.sizeStyle = {
      'min-width.px': Math.min(300, vpWidth * 0.9),
      'max-width.px': Math.min(900, vpWidth * 0.9),
      'max-height.px': vpHeight * 0.9
    };
  }
}
