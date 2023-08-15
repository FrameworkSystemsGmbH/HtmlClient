import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListViewSelectionMode } from '@app/enums/listview-selection-mode';
import { ListViewSelectorPosition } from '@app/enums/listview-selector-position';
import { ParseMethod } from '@app/enums/parse-method';
import { BaseFormatService } from '@app/services/formatter/base-format.service';
import { FramesService } from '@app/services/frames.service';
import { PlatformService } from '@app/services/platform.service';
import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';
import { ListViewItemContentWebComp } from '@app/webcomponents/listview-item-content/listview-item-content.webcomp';
import { ListViewItemWrapper } from '@app/wrappers/listview-item-wrapper';
import { ListViewWrapper } from '@app/wrappers/listview-wrapper';

@Component({
  standalone: true,
  selector: 'hc-listview-item',
  templateUrl: './listview-item.component.html',
  styleUrls: ['./listview-item.component.scss'],
  imports: [
    CommonModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ListViewItemComponent implements OnInit, OnDestroy {

  private static readonly minSelectorSize: number = 12;
  private static readonly maxSelectorSize: number = 20;

  @ViewChild('selector', { read: ElementRef, static: true })
  public selector: ElementRef | null = null;

  @ViewChild('content', { static: true })
  public contentEl: ElementRef<ListViewItemContentWebComp> | null = null;

  public isMouseDown: boolean = false;
  public isEditable: boolean = true;
  public selectorSize: number = ListViewItemComponent.minSelectorSize;
  public containerStyle: any;
  public selectorStyle: any;

  private readonly _baseFormatService: BaseFormatService;
  private readonly _platformService: PlatformService;
  private readonly _framesService: FramesService;

  private _id: string = String.empty();
  private _width: number = 0;
  private _height: number = 0;
  private _selectedVal: boolean = false;
  private _isHover: boolean = false;
  private _selectionMode: ListViewSelectionMode = ListViewSelectionMode.None;
  private _selectorPosition: ListViewSelectorPosition = ListViewSelectorPosition.MiddleRight;
  private _itemWrapper: ListViewItemWrapper | null = null;
  private _listViewWrapper: ListViewWrapper | null = null;

  public constructor(
    baseFormatService: BaseFormatService,
    platformService: PlatformService,
    framesService: FramesService
  ) {
    this._baseFormatService = baseFormatService;
    this._platformService = platformService;
    this._framesService = framesService;
  }

  public get selected(): boolean {
    return this._selectedVal;
  }

  public set selected(val: boolean) {
    if (this._selectedVal === val) {
      return;
    }

    this._selectedVal = val;

    this.updateWrapper();

    if (this._selectionMode === ListViewSelectionMode.Single && val && this._itemWrapper != null) {
      this._itemWrapper.notifySingleSelectionChanged();
    }

    if (this._listViewWrapper != null) {
      this._listViewWrapper.callOnItemSelectionChanged();
    }
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public ngOnDestroy(): void {
    if (this._itemWrapper) {
      this._itemWrapper.onComponentDestroyed();
    }
  }

  public onMouseEnter(): void {
    this._isHover = true;
  }

  public onMouseLeave(): void {
    this._isHover = false;
    this.isMouseDown = false;
  }

  public onMouseDown(event: any): void {
    if (this.selector != null && (event.buttons === 1 && event.target && !DomUtil.isDescentantOrSelf(this.selector.nativeElement, event.target))) {
      this.isMouseDown = true;
    }
  }

  public onMouseUp(): void {
    this.isMouseDown = false;
  }

  public getId(): string {
    return this._id;
  }

  public getSelectorVisible(): boolean {
    if (this._selectionMode === ListViewSelectionMode.None) {
      return false;
    }

    if (this._platformService.isNative()) {
      return this._listViewWrapper != null && (this.selected || this._listViewWrapper.getMobileSelectionModeEnabled());
    } else {
      return this.selected || this.isEditable && this._isHover;
    }
  }

  public setWrapper(itemWrapper: ListViewItemWrapper): void {
    this._itemWrapper = itemWrapper;
    this._listViewWrapper = itemWrapper.getListViewWrapper();

    const globalCss: string | null = this._listViewWrapper.getListViewItemCssGlobal();
    const templateCss: string | null = this._listViewWrapper.getViewTemplateCss();
    const templateHtml: string | null = this._listViewWrapper.getViewTemplateHtml();

    if (this.contentEl != null) {
      this.contentEl.nativeElement.init(globalCss, templateCss, templateHtml);
    }
  }

  private updateWrapper(): void {
    if (this._itemWrapper != null) {
      this._itemWrapper.setSelected(this.selected);
    }
  }

  public updateComponent(): void {
    if (this._itemWrapper != null && this._listViewWrapper != null) {
      this.updateData(this._itemWrapper);
      this.updateStyles(this._itemWrapper, this._listViewWrapper);
    }
  }

  private updateData(itemWrapper: ListViewItemWrapper): void {
    if (this._listViewWrapper != null) {

      this._id = itemWrapper.getId();
      this._width = this._listViewWrapper.getItemWidth();
      this._height = this._listViewWrapper.getItemHeight();
      this.isEditable = this._listViewWrapper.getIsEditable();
      this._selectionMode = this._listViewWrapper.getSelectionMode();
      this._selectorPosition = this._listViewWrapper.getSelectorPosition();
      this._selectedVal = itemWrapper.getSelected();

      const formattedValues: Array<string | null> = new Array<string | null>();

      for (const templateValue of itemWrapper.getViewTemplateValues()) {
        const value: string | null = templateValue.getValue();
        formattedValues.push(value != null ? this._baseFormatService.formatString(value, ParseMethod.Server, templateValue.getFormat(), templateValue.getFormatPattern()) : null);
      }

      if (this.contentEl != null) {
        this.contentEl.nativeElement.update(this.isEditable, formattedValues);
      }

      itemWrapper.confirmContentUpdate();
    }
  }

  private updateStyles(itemWrapper: ListViewItemWrapper, listViewWrapper: ListViewWrapper): void {
    this.containerStyle = this.createContainerStyle(itemWrapper, listViewWrapper);
    this.selectorStyle = this.createSelectorStyle();
  }

  private createContainerStyle(itemWrapper: ListViewItemWrapper, listViewWrapper: ListViewWrapper): any {
    return {
      'min-width.rem': StyleUtil.pixToRem(this._width),
      'min-height.rem': StyleUtil.pixToRem(this._height),
      'max-height.rem': StyleUtil.pixToRem(this._height),
      'cursor': this.isEditable ? listViewWrapper.hasOnItemActivatedEvent() ? 'pointer' : 'default' : 'not-allowed'
    };
  }

  private createSelectorStyle(): any {
    let selectorStyle: any = {
      'position': 'absolute'
    };

    // Set selector size depending on list item height
    if (this._height >= 40) {
      this.selectorSize = ListViewItemComponent.maxSelectorSize;
    } else if (this._height <= 20) {
      this.selectorSize = ListViewItemComponent.minSelectorSize;
    } else {
      this.selectorSize = Math.min(ListViewItemComponent.minSelectorSize, Math.roundDec(this._height / 2, 0));
    }

    // Determine shorter edge of the list item
    const shortEdge: number = Math.max(1, Math.min(this._width, this._height));

    // Selector margin is 10% of the length of the shorter edge (but 20 size units max)
    const margin: number = StyleUtil.pixToRem(Math.min(20, Math.roundDec(shortEdge * 0.1, 0)));

    switch (this._selectorPosition) {
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
          'top.rem': StyleUtil.pixToRem(this._height / 2 - this.selectorSize / 2),
          'left.rem': margin
        };
        break;
      case ListViewSelectorPosition.MiddleRight:
        selectorStyle = {
          ...selectorStyle,
          'top.rem': StyleUtil.pixToRem(this._height / 2 - this.selectorSize / 2),
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
    if (!this.isEditable || !this._platformService.isNative() || this._selectionMode === ListViewSelectionMode.None) {
      return;
    }

    if (this._selectionMode === ListViewSelectionMode.Single) {
      this.selected = !this.selected;
    } else if (this._listViewWrapper != null) {
      if (this._listViewWrapper.getMobileSelectionModeEnabled()) {
        this._listViewWrapper.setMobileSelectionModeEnabled(false);
      } else {
        this._listViewWrapper.setMobileSelectionModeEnabled(true);

        if (!this.selected) {
          this.selected = true;
        }
      }

      this._framesService.layout();
    }

    event.preventDefault();
  }

  public onClick(event: any): void {
    if (!this.isEditable) {
      return;
    }

    if (this._platformService.isNative() && this._listViewWrapper != null && this._listViewWrapper.getMobileSelectionModeEnabled()) {
      this.selected = !this.selected;

      if (this._listViewWrapper.getSelectedItems().length === 0) {
        this._listViewWrapper.setMobileSelectionModeEnabled(false);
      }
    } else if (this.selector != null && (event.target && !DomUtil.isDescentantOrSelf(this.selector.nativeElement, event.target))) {
      if (this._listViewWrapper != null) {
        this._listViewWrapper.callOnItemActivated(this.getId());
      }
    }
  }
}
