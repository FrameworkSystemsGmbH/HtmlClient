import { Component, ViewChild, ViewContainerRef, OnInit, ElementRef } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { StyleUtil } from 'app/util/style-util';
import { ContainerComponent } from 'app/controls/container.component';
import { TabPageWrapper } from 'app/wrappers/tabbed-window/tab-page-wrapper';

@Component({
  selector: 'hc-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss']
})
export class TabPageComponent extends ContainerComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  @ViewChild('wrapper', { static: true })
  public wrapperEl: ElementRef;

  public wrapperStyle: any;

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  protected updateStyles(wrapper: TabPageWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: TabPageWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isVisible: boolean = this.isVisible && layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': isVisible ? 'flex' : 'none',
      'flex-direction': 'column',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }
}
