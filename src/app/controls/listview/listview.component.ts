import { Component, ViewChild, ViewContainerRef, OnInit } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { ListViewWrapper } from 'app/wrappers/listview-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { ListViewItemWrapper } from 'app/wrappers/listview-item-wrapper';

@Component({
  selector: 'hc-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListViewComponent extends ControlComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public wrapperStyle: any;

  public getWrapper(): ListViewWrapper {
    return super.getWrapper() as ListViewWrapper;
  }

  public setWrapper(wrapper: ListViewWrapper): void {
    super.setWrapper(wrapper);
  }

  protected updateData(wrapper: ListViewWrapper): void {
    super.updateData(wrapper);

    const itemWrappers: Array<ListViewItemWrapper> = wrapper.getItems();

    if (!itemWrappers || !itemWrappers.length) {
      return;
    }

    let posChange: boolean = false;

    for (const itemWrapper of itemWrappers) {
      if (itemWrapper.hasPosChanged()) {
        posChange = true;
      }

      if (itemWrapper.isNew()) {
        itemWrapper.attachComponent(this.anchor);
      } else if (itemWrapper.hasContentChanged()) {
        itemWrapper.updateComponent();
      }
    }

    if (posChange) {
      itemWrappers.forEach(i => i.ensureItemPos(this.anchor));
    }
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
    const itemWidth: number = wrapper.getItemWidth();
    const spacingHorizontal: number = wrapper.getSpacingHorizontal();
    const spacingVertical: number = wrapper.getSpacingVertical();

    let wrapperStyle: any = {
      'display': isVisible ? 'grid' : 'none',
      'column-gap': StyleUtil.getValue('px', spacingHorizontal),
      'row-gap': StyleUtil.getValue('px', spacingVertical),
      'align-content': 'flex-start',
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
        'grid-template-columns': `repeat(auto-fit, minmax(${StyleUtil.getValue('px', itemWidth)}, 1fr)`
      };
    }

    return wrapperStyle;
  }
}
