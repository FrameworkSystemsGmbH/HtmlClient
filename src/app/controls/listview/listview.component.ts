import { Component, ViewChild, ViewContainerRef, OnInit, ComponentFactory, ComponentRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';
import { ListViewItemComponent } from 'app/controls/listview/listview-item.component';

@Component({
  selector: 'hc-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListViewComponent extends ControlComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  private itemFactory: ComponentFactory<ListViewItemComponent>;
  private selectionMode: ListViewSelectionMode;
  private itemArrangement: ListViewItemArrangement;
  private spacingHorizontal: number;
  private spacingVertical: number;
  private itemMinWidth: number;
  private itemMinHeight: number;
  private itemMaxWidth: number;
  private itemMaxHeight: number;

  public getWrapper(): ListViewWrapper {
    return super.getWrapper() as ListViewWrapper;
  }

  public setWrapper(wrapper: ListViewWrapper): void {
    super.setWrapper(wrapper);
  }

  protected updateData(wrapper: ListViewWrapper): void {
    super.updateData(wrapper);

    this.itemFactory = wrapper.getItemFactory();
    this.selectionMode = wrapper.getSelectionMode();
    this.itemArrangement = wrapper.getItemArrangement();
    this.spacingHorizontal = wrapper.getSpacingHorizontal();
    this.spacingVertical = wrapper.getSpacingVertical();
    this.itemMinWidth = wrapper.getItemMinWidth();
    this.itemMinHeight = wrapper.getItemMinHeight();
    this.itemMaxWidth = wrapper.getItemMaxWidth();
    this.itemMaxHeight = wrapper.getItemMaxHeight();

    this.createItems(wrapper);
  }

  protected updateStyles(wrapper: ListViewWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ListViewWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getWidth();
    const layoutHeight: number = layoutableProperties.getHeight();
    const isVisible: boolean = this.isVisible && layoutWidth > 0 && layoutHeight > 0;
    const itemArrangement: ListViewItemArrangement = wrapper.getItemArrangement();
    const itemMinWidth: number = wrapper.getItemMinWidth();
    const spacingHorizontal: number = wrapper.getSpacingHorizontal();
    const spacingVertical: number = wrapper.getSpacingVertical();

    let wrapperStyle: any = {
      'display': isVisible ? 'grid' : 'none',
      'overflow': 'auto',
      'column-gap': StyleUtil.getValue('px', spacingHorizontal),
      'row-gap': StyleUtil.getValue('px', spacingVertical),
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'width.px': layoutWidth,
      'height.px': layoutHeight,
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
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
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline()),
      'cursor': !this.isEditable ? 'not-allowed' : null
    };

    if (itemArrangement === ListViewItemArrangement.List) {
      wrapperStyle = {
        ...wrapperStyle,
        'grid-template-columns': '1fr'
      };
    } else {
      wrapperStyle = {
        ...wrapperStyle,
        'grid-template-columns': `repeat(auto-fit, minmax(${StyleUtil.getValue('px', itemMinWidth)}, 1fr)`,
        'align-content': 'flex-start'
      };
    }

    return wrapperStyle;
  }

  private createItems(wrapper: ListViewWrapper): void {
    const items: Array<ListViewItemWrapper> = wrapper.getItems();

    if (!items || !items.length) {
      return;
    }

    for (const item of items) {
      const itemRef: ComponentRef<ListViewItemComponent> = this.anchor.createComponent(this.itemFactory);
      const itemInstance: ListViewItemComponent = itemRef.instance;

      itemInstance.id = item.getId();

      for (const value of item.getValues()) {
        itemInstance.values.push(value.getValue());
      }
    }
  }
}