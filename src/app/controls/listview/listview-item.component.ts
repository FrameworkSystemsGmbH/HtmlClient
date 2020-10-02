import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { PlatformService } from 'app/services/platform.service';
import { ListViewSelectorPosition } from 'app/enums/listview-selector-position';
import { FramesService } from 'app/services/frames.service';
import { ParseMethod } from 'app/enums/parse-method';

import * as DomUtil from 'app/util/dom-util';
import * as StyleUtil from 'app/util/style-util';

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

  @ViewChild('content', { static: true })
  public contentEl: ElementRef;

  public isMouseDown: boolean;
  public isEditable: boolean;
  public selectorSize: number;
  public containerStyle: any;
  public selectorStyle: any;

  private id: string;
  private width: number;
  private height: number;
  private selectedVal: boolean;
  private isHover: boolean;
  private selectionMode: ListViewSelectionMode;
  private selectorPosition: ListViewSelectorPosition;
  private itemWrapper: ListViewItemWrapper;
  private listViewWrapper: ListViewWrapper;

  constructor(
    private baseFormatService: BaseFormatService,
    private platformService: PlatformService,
    private framesService: FramesService
  ) { }

  get selected(): boolean {
    return this.selectedVal;
  }

  set selected(val: boolean) {
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
    this.updateComponent();
  }

  public onMouseEnter(): void {
    this.isHover = true;
  }

  public onMouseLeave(): void {
    this.isHover = false;
    this.isMouseDown = false;
  }

  public onMouseDown(event: any): void {
    if (event.buttons === 1 && event.target && !DomUtil.isDescentantOrSelf(this.selector.nativeElement, event.target)) {
      this.isMouseDown = true;
    }
  }

  public onMouseUp(): void {
    this.isMouseDown = false;
  }

  public getId(): string {
    return this.id;
  }

  public getSelectorVisible(): boolean {
    if (this.selectionMode === ListViewSelectionMode.None) {
      return false;
    }

    if (this.platformService.isNative()) {
      return this.selected || this.listViewWrapper.getMobileSelectionModeEnabled();
    } else {
      return this.selected || (this.isEditable && this.isHover);
    }
  }

  public setWrapper(itemWrapper: ListViewItemWrapper): void {
    this.itemWrapper = itemWrapper;
    this.listViewWrapper = itemWrapper.getListViewWrapper();

    const templateCss: string = this.listViewWrapper.getViewTemplateCss();
    const templateHtml: string = this.listViewWrapper.getViewTemplateHtml();

    this.contentEl.nativeElement.init(templateCss, templateHtml);
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
    this.selectedVal = itemWrapper.getSelected();

    const formattedValues: Array<string> = new Array<string>();

    for (const templateValue of itemWrapper.getViewTemplateValues()) {
      formattedValues.push(this.baseFormatService.formatString(templateValue.getValue(), ParseMethod.Server, templateValue.getFormat(), templateValue.getFormatPattern()));
    }

    this.contentEl.nativeElement.update(this.isEditable, formattedValues);

    itemWrapper.confirmContentUpdate();
  }

  private updateStyles(itemWrapper: ListViewItemWrapper, listViewWrapper: ListViewWrapper): void {
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
          'top.rem': StyleUtil.pixToRem((this.height / 2) - (this.selectorSize / 2)),
          'left.rem': margin
        };
        break;
      case ListViewSelectorPosition.MiddleRight:
        selectorStyle = {
          ...selectorStyle,
          'top.rem': StyleUtil.pixToRem((this.height / 2) - (this.selectorSize / 2)),
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

  public onPress(event: any): void {
    if (!this.isEditable || !this.platformService.isNative() || this.selectionMode === ListViewSelectionMode.None) {
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

    if (this.platformService.isNative() && this.listViewWrapper.getMobileSelectionModeEnabled()) {
      this.selected = !this.selected;

      if (this.listViewWrapper.getSelectedItems().length === 0) {
        this.listViewWrapper.setMobileSelectionModeEnabled(false);
      }
    } else if (event.target && !DomUtil.isDescentantOrSelf(this.selector.nativeElement, event.target)) {
      this.listViewWrapper.callOnItemActivated(this.getId());
    }
  }
}
