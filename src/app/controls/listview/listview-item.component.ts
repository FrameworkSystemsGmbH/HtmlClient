import { Component, ViewChild, ViewContainerRef, OnInit, ComponentRef, ElementRef } from '@angular/core';
import { ListViewItemContentComponent } from 'app/controls/listview/listview-item-content.component';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { PlatformService } from 'app/services/platform/platform.service';
import { DomUtil } from 'app/util/dom-util';
import { ListViewSelectorPosition } from 'app/enums/listview-selector-position';
import { FramesService } from 'app/services/frames.service';
import { StyleUtil } from 'app/util/style-util';
import { ParseMethod } from 'app/enums/parse-method';

@Component({
  selector: 'hc-listview-item',
  templateUrl: './listview-item.component.html',
  styleUrls: ['./listview-item.component.scss']
})
export class ListViewItemComponent implements OnInit {

  private static minSelectorSize: number = 12;
  private static maxSelectorSize: number = 20;

  @ViewChild('selector', { read: ElementRef, static: true })
  public selector: ElementRef;

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  public isMouseDown: boolean;
  public isEditable: boolean;
  public selectorSize: number;
  public containerStyle: any;
  public selectorStyle: any;

  private id: string;
  private values: Array<string>;
  private width: number;
  private height: number;
  private selectedVal: boolean;
  private isHover: boolean;
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

  public onMouseEnter(event: any): void {
    this.isHover = true;
  }

  public onMouseLeave(event: any): void {
    this.isHover = false;
    this.isMouseDown = false;
  }

  public onMouseDown(event: any): void {
    if (event.buttons === 1 && event.target && !DomUtil.isDescentantOrSelf(this.selector.nativeElement, event.target)) {
      this.isMouseDown = true;
    }
  }

  public onMouseUp(event: any): void {
    this.isMouseDown = false;
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
      return this.selected || (this.isEditable && this.isHover);
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
    this.isEditable = this.listViewWrapper.getIsEditable();
    this.selectionMode = this.listViewWrapper.getSelectionMode();
    this.selectorPosition = this.listViewWrapper.getSelectorPosition();
    this.values = itemWrapper.getValues().map(v => this.baseFormatService.formatString(v.getValue(), ParseMethod.Server, v.getFormat(), v.getFormatPattern()));
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
      'min-width.rem': StyleUtil.pixToRem(this.width),
      'min-height.rem': StyleUtil.pixToRem(this.height),
      'max-height.rem': StyleUtil.pixToRem(this.height),
      'cursor': this.isEditable ? (listViewWrapper.hasOnItemActivatedEvent() ? 'pointer' : 'default') : 'not-allowed'
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

    // Selector margin is 10% of the length of the shorter edge (but 20 size units max)
    const margin: number = StyleUtil.pixToRem(Math.min(20, Math.roundDec(shortEdge * 0.1, 0)));

    switch (this.selectorPosition) {
      case ListViewSelectorPosition.TopLeft:
        selectorStyle = {
          ...selectorStyle,
          'top.rem': margin,
          'left.rem': margin
        };
        break;
      case ListViewSelectorPosition.TopRight:
        selectorStyle = {
          ...selectorStyle,
          'top.rem': margin,
          'right.rem': margin
        };
        break;
      case ListViewSelectorPosition.MiddleLeft:
        selectorStyle = {
          ...selectorStyle,
          'top.rem': (this.height / 2) - (this.selectorSize / 2),
          'left.rem': margin
        };
        break;
      case ListViewSelectorPosition.MiddleRight:
        selectorStyle = {
          ...selectorStyle,
          'top.rem': (this.height / 2) - (this.selectorSize / 2),
          'right.rem': margin
        };
        break;
      case ListViewSelectorPosition.BottomLeft:
        selectorStyle = {
          ...selectorStyle,
          'bottom.rem': margin,
          'left.rem': margin
        };
        break;
      case ListViewSelectorPosition.BottomRight:
        selectorStyle = {
          ...selectorStyle,
          'bottom.rem': margin,
          'right.rem': margin
        };
        break;
    }

    return selectorStyle;
  }

  private attachContentComponent(): void {
    this.contentCompRef = this.anchor.createComponent(this.listViewWrapper.getItemFactory());
    this.contentCompInstance = this.contentCompRef.instance;
  }

  private setContentValues(): void {
    if (!this.contentCompInstance) {
      return;
    }

    this.contentCompInstance.enabled = this.isEditable;
    this.contentCompInstance.values = this.values;
  }

  public onPress(event: any): void {
    if (!this.isEditable || !this.platformService.isMobile() || this.selectionMode === ListViewSelectionMode.None) {
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

    event.preventDefault();
  }

  public onClick(event: any): void {
    if (!this.isEditable) {
      return;
    }

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
