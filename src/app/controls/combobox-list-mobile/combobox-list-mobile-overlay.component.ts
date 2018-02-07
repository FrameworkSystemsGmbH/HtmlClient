import { Component, Inject, HostListener, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, NgZone } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { ISubscription } from 'rxjs/Subscription';

import { IComboBoxListMobileOverlayData, IComboBoxListMobileOverlayClosedData } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay';

import { CMBBOX_DATA } from 'app/controls/combobox-list-mobile/combobox-list-mobile-overlay.tokens';
import { DomUtil } from 'app/util/dom-util';
import { DataList } from 'app/common/data-list';

@Component({
  selector: 'hc-cmb-list-mobile-overlay',
  templateUrl: './combobox-list-mobile-overlay.component.html',
  styleUrls: ['./combobox-list-mobile-overlay.component.scss']
})
export class ComboBoxListMobileOverlayComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output()
  public onFinished: EventEmitter<IComboBoxListMobileOverlayClosedData> = new EventEmitter<IComboBoxListMobileOverlayClosedData>();

  @ViewChild('scroller')
  public scroller: ElementRef;

  @ViewChild('list')
  public list: ElementRef;

  public entries: DataList;
  public selectedIndex: number;
  public sizeStyle: any;

  private backdropClickSub: ISubscription;

  constructor(
    private zone: NgZone,
    private overlayRef: OverlayRef,
    @Inject(CMBBOX_DATA) data: IComboBoxListMobileOverlayData
  ) {
    this.entries = data.entries;
    this.selectedIndex = data.selectedIndex;
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
        this.scroller.nativeElement.focus();
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
