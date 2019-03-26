import { Component, ViewChild, ViewContainerRef, OnInit, ComponentRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { PlatformService } from 'app/services/platform.service';
import { DomUtil } from 'app/util/dom-util';
import { ListViewSelectorPosition } from 'app/enums/listview-selector-position';
import { FormsService } from 'app/services/forms.service';
import { FramesService } from 'app/services/frames.service';

@Component({
  selector: 'hc-listview-item',
  templateUrl: './listview-item.component.html',
  styleUrls: ['./listview-item.component.scss']
})
export class ListViewItemComponent implements OnInit {

  @ViewChild('selector', { read: ElementRef })
  public selector: ElementRef;

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  private static minSelectorSize: number = 12;
  private static maxSelectorSize: number = 20;

  public isHover: boolean;
  public selectorSize: number;
  public containerStyle: any;
  public selectorStyle: any;

  private id: string;
  private values: Array<string>;
  private width: number;
  private height: number;
  private selectedVal: boolean;
  private selectionMode: ListViewSelectionMode;
  private selectorPosition: ListViewSelectorPosition;
  private itemWrapper: ListViewItemWrapper;
  private listViewWrapper: ListViewWrapper;
  private contentCompRef: ComponentRef<ListViewItemContentComponent>;
  private contentCompInstance: ListViewItemContentComponent;

  constructor(
    private baseFormatService: BaseFormatService,
    private platformService: PlatformService,
    private framesService: FramesService
  ) { }

  get selected() {
    return this.selectedVal;
  }

  set selected(val) {
    if (this.selectedVal === val) {
      return;
    }

    this.selectedVal = val;

    this.updateWrapper();

    if (this.selectionMode === ListViewSelectionMode.Single && val) {
      this.itemWrapper.notifySingleSelectionChanged();
    }

    this.listViewWrapper.callOnItemSelectionChanged();
  }

  public ngOnInit(): void {
    this.attachContentComponent();
    this.updateComponent();
  }

  public getId(): string {
    return this.id;
  }

  public getSelectorVisible(): boolean {
    if (this.selectionMode === ListViewSelectionMode.None) {
      return false;
    }

    if (this.platformService.isMobile()) {
      return this.selected || this.listViewWrapper.getMobileSelectionModeEnabled();
    } else {
      return this.selected || this.isHover;
    }
  }

  public setWrapper(itemWrapper: ListViewItemWrapper) {
    this.itemWrapper = itemWrapper;
    this.listViewWrapper = itemWrapper.getListViewWrapper();
  }

  private updateWrapper(): void {
    this.itemWrapper.setSelected(this.selected);
  }

  public updateComponent(): void {
    this.updateData(this.itemWrapper);
    this.updateStyles(this.itemWrapper, this.listViewWrapper);
  }

  private updateData(itemWrapper: ListViewItemWrapper): void {
    this.id = itemWrapper.getId();
    this.width = this.listViewWrapper.getItemWidth();
    this.height = this.listViewWrapper.getItemHeight();
    this.selectionMode = this.listViewWrapper.getSelectionMode();
    this.selectorPosition = this.listViewWrapper.getSelectorPosition();
    this.values = itemWrapper.getValues().map(v => this.baseFormatService.formatString(v.getValue(), v.getFormat(), v.getFormatPattern()));
    this.selectedVal = itemWrapper.getSelected();
    itemWrapper.confirmContentUpdate();
    this.setContentValues();
  }

  private updateStyles(itemWrapper: ListViewItemWrapper, listViewWrapper: ListViewWrapper) {
    this.containerStyle = this.createContainerStyle(itemWrapper, listViewWrapper);
    this.selectorStyle = this.createSelectorStyle();
  }

  private createContainerStyle(itemWrapper: ListViewItemWrapper, listViewWrapper: ListViewWrapper): any {
    return {
      'min-width.px': this.width,
      'height.px': this.height,
      'cursor': listViewWrapper.hasOnItemActivatedEvent() ? 'pointer' : 'default'
    };
  }

  private createSelectorStyle(): any {
    let selectorStyle: any = {
      'position': 'absolute'
    };

    // Set selector size depending on list item height
    if (this.height >= 40) {
      this.selectorSize = ListViewItemComponent.maxSelectorSize;
    } else if (this.height <= 20) {
      this.selectorSize = ListViewItemComponent.minSelectorSize;
    } else {
      this.selectorSize = Math.min(ListViewItemComponent.minSelectorSize, Math.roundDec(this.height / 2, 0));
    }

    // Determine shorter edge of the list item
    const shortEdge: number = Math.max(1, Math.min(this.width, this.height));

    // Selector margin is 10% of the length of the shorter edge (but 20px max)
    const margin: number = Math.min(20, Math.roundDec(shortEdge * 0.1, 0));

    switch (this.selectorPosition) {
      case ListViewSelectorPosition.TopLeft:
        selectorStyle = {
          ...selectorStyle,
          'top.px': margin,
          'left.px': margin
        };
        break;
      case ListViewSelectorPosition.TopRight:
        selectorStyle = {
          ...selectorStyle,
          'top.px': margin,
          'right.px': margin
        };
        break;
      case ListViewSelectorPosition.MiddleLeft:
        selectorStyle = {
          ...selectorStyle,
          'top.px': (this.height / 2) - (this.selectorSize / 2),
          'left.px': margin
        };
        break;
      case ListViewSelectorPosition.MiddleRight:
        selectorStyle = {
          ...selectorStyle,
          'top.px': (this.height / 2) - (this.selectorSize / 2),
          'right.px': margin
        };
        break;
      case ListViewSelectorPosition.BottomLeft:
        selectorStyle = {
          ...selectorStyle,
          'bottom.px': margin,
          'left.px': margin
        };
        break;
      case ListViewSelectorPosition.BottomRight:
        selectorStyle = {
          ...selectorStyle,
          'bottom.px': margin,
          'right.px': margin
        };
        break;
    }

    return selectorStyle;
  }

  private attachContentComponent(): void {
    this.contentCompRef = this.anchor.createComponent(this.itemWrapper.getListViewWrapper().getItemFactory());
    this.contentCompInstance = this.contentCompRef.instance;
  }

  private setContentValues(): void {
    if (!this.contentCompInstance) {
      return;
    }

    this.contentCompInstance.values = this.values;
  }

  public onPress(event: any): void {
    if (!this.platformService.isMobile() || this.selectionMode === ListViewSelectionMode.None) {
      return;
    }

    if (this.selectionMode === ListViewSelectionMode.Single) {
      this.selected = !this.selected;
    } else {
      if (this.listViewWrapper.getMobileSelectionModeEnabled()) {
        this.listViewWrapper.setMobileSelectionModeEnabled(false);
      } else {
        this.listViewWrapper.setMobileSelectionModeEnabled(true);

        if (!this.selected) {
          this.selected = true;
        }
      }

      this.framesService.layout();
    }
  }

  public onTap(event: any): void {
    if (this.platformService.isMobile() && this.listViewWrapper.getMobileSelectionModeEnabled()) {
      this.selected = !this.selected;

      if (this.listViewWrapper.getSelectedItems().length === 0) {
        this.listViewWrapper.setMobileSelectionModeEnabled(false);
      }
    } else if (event.target && !DomUtil.isDescentantOrSelf(this.selector.nativeElement, event.target)) {
      this.listViewWrapper.callOnItemActivated(this.getId());
    }
  }
}
