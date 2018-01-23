import { OnInit, DoCheck, AfterViewChecked, Output, EventEmitter, NgZone } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { DataList } from 'app/common/data-list';
import { StyleUtil } from 'app/util/style-util';
import { ControlVisibility } from 'app/enums/control-visibility';
import { DomUtil } from 'app/util/dom-util';
import { ElementRef } from '@angular/core/src/linker/element_ref';

export abstract class ComboBoxComponent extends ControlComponent implements OnInit, DoCheck, AfterViewChecked {

  @Output()
  public onSelectionChanged: EventEmitter<any>;

  public selectedIndex: number;
  public selectedListIndex: number;
  public entries: DataList;
  public dropDownVisible: boolean;
  public isEditable: boolean;

  public containerStyle: any;
  public controlStyle: any;
  public dropDownStyle: any;
  public dropDownScrollerStyle: any;

  private lastScrolledIndex: number;

  constructor(protected zone: NgZone) {
    super();
  }

  public abstract getArrowWidth(): number;

  public abstract getSelectedPk(): string;

  public abstract getSelectedValue(): string;

  protected abstract getScroller(): ElementRef;

  protected abstract getList(): ElementRef;

  public ngDoCheck(): void {
    this.updateStyles(this.getWrapper());
  }

  public ngOnInit(): void {
    this.updateComponent();
  }

  public ngAfterViewChecked(): void {
    if (this.dropDownVisible) {
      const selectedListIndex: number = this.getSelectedListIndex();
      if (selectedListIndex !== this.lastScrolledIndex) {
        this.lastScrolledIndex = selectedListIndex;
        this.zone.runOutsideAngular(() => {
          this.scrollSelectedEntryIntoView();
        });
      }
    }
  }

  protected getSelectedIndex(): number {
    return this.selectedIndex;
  }

  protected setSelectedIndex(index: number) {
    this.selectedIndex = index;
    this.setSelectedListIndex(null);
  }

  protected getSelectedListIndex(): number {
    const selectedIndex: number = this.getSelectedIndex();
    return this.selectedListIndex != null ? this.selectedListIndex : (selectedIndex != null ? selectedIndex : -1);
  }

  protected setSelectedListIndex(index: number): void {
    this.selectedListIndex = index;
  }

  public getWrapper(): ComboBoxWrapper {
    return super.getWrapper() as ComboBoxWrapper;
  }

  public setWrapper(wrapper: ComboBoxWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnSelectionChangedEvent()) {
      this.onSelectionChanged = new EventEmitter<any>();
    }
  }

  public abstract onEnterKey(event: any): void;

  protected onKeyDown(event: any): void {
    if (!event || !this.isEditable) {
      return;
    }

    switch (event.which) {
      // Down
      case 40:
        this.selectNext();
        break;

      // Up
      case 38:
        this.selectPrevious();
        break;

      // Enter
      case 13:
        this.onEnterKey(event);
        break;

      // Escape
      case 27:
        this.hideList();
        break;
    }
  }

  public onAfterEnter(): void {
    // Override in subclasses
  }

  protected callOnSelectionChanged(event?: any): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnSelectionChangedEvent()) {
      this.onSelectionChanged.emit(event);
    }
  }

  public callOnLeave(event: any): void {
    this.hideList();
    if (this.getWrapper().getIsEditable()) {
      this.updateWrapper();
      super.callOnLeave(event);
    }
  }

  protected scrollSelectedEntryIntoView(): void {
    const scroller: ElementRef = this.getScroller();
    const list: ElementRef = this.getList();

    if (!scroller || !list) { return; }
    const selectedLi: HTMLLIElement = list.nativeElement.querySelector('li.selected');
    if (selectedLi) {
      DomUtil.scrollIntoView(scroller.nativeElement, selectedLi);
    }
  }

  protected selectNext(): void {
    if (!this.entries || !this.entries.length) {
      return;
    }

    if (this.dropDownVisible) {
      const currentListIndex: number = this.getSelectedListIndex();
      this.setSelectedListIndex(currentListIndex != null ? Math.min(currentListIndex + 1, this.entries.length - 1) : 0);
    } else {
      this.showList();
    }
  }

  protected selectPrevious(): void {
    if (this.dropDownVisible) {
      const currentListIndex: number = this.getSelectedListIndex();
      this.setSelectedListIndex(currentListIndex != null ? Math.max(currentListIndex - 1, 0) : 0);
    } else {
      this.showList();
    }
  }

  public showList(): void {
    this.dropDownVisible = true;
  }

  public hideList(): void {
    this.dropDownVisible = false;
    this.lastScrolledIndex = null;
    this.setSelectedListIndex(null);
  }

  public updateComponent(): void {
    const wrapper: ComboBoxWrapper = this.getWrapper();
    this.updateProperties(wrapper);
    this.updateStyles(wrapper);
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.getSelectedPk());
  }

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    this.isEditable = this.getWrapper().getIsEditable();
    this.entries = wrapper.getEntries();
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    this.containerStyle = this.createContainerStyle(wrapper);
    this.controlStyle = this.createControlStyle(wrapper);
    this.dropDownStyle = this.createDropDownStyle(wrapper);
    this.dropDownScrollerStyle = this.createDropDownScrollerStyle(wrapper);
  }

  protected createContainerStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize()
    };

    return styles;
  }

  protected createControlStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
      'min-width.px': 0,
      'min-height.px': 0,
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.getFourValue('px',
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.getFourValue('px',
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.getFourValue('px',
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'cursor': 'pointer'
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }

  protected createValueStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = {
      'border': 'none',
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getFontSize(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };

    return styles;
  }

  protected createDropDownStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
      'top.px': layoutableProperties.getHeight() + wrapper.getMarginTop(),
      'left.px': wrapper.getMarginLeft(),
      'min-width.px': layoutableProperties.getWidth(),
      'border': '1px solid ' + wrapper.getBorderColor(),
      'border-radius': StyleUtil.getFourValue('px',
        wrapper.getBorderRadiusBottomLeft(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusTopLeft())
    };

    return styles;
  }

  protected createDropDownScrollerStyle(wrapper: ComboBoxWrapper): any {
    const maxWidth: number = wrapper.getMaxDropDownWidth();
    const maxHeight: number = wrapper.getMaxDropDownHeight();

    const styles: any = {
      'max-width.px': maxWidth > 0 ? maxWidth : null,
      'max-height.px': maxHeight > 0 ? maxHeight : null
    };

    return styles;
  }
}
