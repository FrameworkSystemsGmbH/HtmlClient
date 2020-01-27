import { Component, ViewChild, ViewContainerRef, OnInit, Output, EventEmitter } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { StyleUtil } from 'app/util/style-util';
import { ContainerComponent } from 'app/controls/container.component';
import { TabbedWindowWrapper } from 'app/wrappers/tabbed-window/tabbed-window-wrapper';
import { TabPageWrapper } from 'app/wrappers/tabbed-window/tab-page-wrapper';
import { TabPageTemplate } from 'app/wrappers/tabbed-window/tab-page-template';
import { TabAlignment } from 'app/enums/tab-alignment';
import { PlatformService } from 'app/services/platform/platform.service';
import { Visibility } from 'app/enums/visibility';

@Component({
  selector: 'hc-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss']
})
export class TabbedWindowComponent extends ContainerComponent implements OnInit {

  @Output()
  public onTabClicked: EventEmitter<{ tabPage: TabPageWrapper; event: any }>;

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  public tabPages: Array<TabPageWrapper>;
  public tabAlignment: TabAlignment;

  public wrapperStyle: any;
  public headerStyle: any;
  public scrollerStyle: any;
  public tabsStyle: any;
  public contentStyle: any;

  private isMobile: boolean;

  constructor(private platformService: PlatformService) {
    super();
  }

  public callOnTabClicked(tabPage: TabPageWrapper, event?: any): void {
    const wrapper: TabbedWindowWrapper = this.getWrapper();
    if ((wrapper.hasOnSelectedTabPageChangeEvent() || wrapper.hasOnSelectedTabPageChangedEvent())
      && tabPage.getIsEditable()
      && tabPage.getVisibility() === Visibility.Visible) {
      this.onTabClicked.emit({ tabPage, event });
    }
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getWrapper(): TabbedWindowWrapper {
    return super.getWrapper() as TabbedWindowWrapper;
  }

  public setWrapper(wrapper: TabbedWindowWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnSelectedTabPageChangeEvent() || wrapper.hasOnSelectedTabPageChangedEvent()) {
      this.onTabClicked = new EventEmitter<any>();
    }
  }

  protected updateData(wrapper: TabbedWindowWrapper): void {
    super.updateData(wrapper);
    this.isMobile = this.platformService.isMobile();
    this.tabPages = wrapper.getTabPages();
    this.tabAlignment = wrapper.getTabAlignment();
  }

  protected updateStyles(wrapper: TabbedWindowWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.headerStyle = this.createHeaderStyle(wrapper);
    this.scrollerStyle = this.createScrollerStyle(wrapper);
    this.tabsStyle = this.createTabsStyle(wrapper);
    this.contentStyle = this.createContentStyle(wrapper);
  }

  public getTabClasses(tabPage: TabPageWrapper): any {
    return {
      'selected': tabPage.isTabSelected(),
      'disabled': tabPage.getIsEditable() === false
    };
  }

  public getTabStyle(tabPage: TabPageWrapper): any {
    const template: TabPageTemplate = this.getWrapper().getCurrentTabPageTemplate(tabPage);

    return {
      'background-color': template.getBackColor(),
      'border-style': 'solid',
      'border-color': template.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        template.getBorderRadiusTopLeft(),
        template.getBorderRadiusTopRight(),
        template.getBorderRadiusBottomRight(),
        template.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.pixToRemFourValueStr(
        template.getBorderThicknessTop(),
        template.getBorderThicknessRight(),
        template.getBorderThicknessBottom(),
        template.getBorderThicknessLeft()),
      'padding': StyleUtil.pixToRemFourValueStr(
        template.getPaddingTop(),
        template.getPaddingRight(),
        template.getPaddingBottom(),
        template.getPaddingLeft()),
      'font-family': template.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(template.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(template.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(template.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(template.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(template.getFontUnderline())
    };
  }

  protected createWrapperStyle(wrapper: TabbedWindowWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isVisible: boolean = this.isVisible && layoutWidth > 0 && layoutHeight > 0;

    let style: any = {
      'display': isVisible ? 'flex' : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };

    switch (this.tabAlignment) {
      case TabAlignment.Left:
        style = { ...style, 'flex-direction': 'row' };
        break;
      case TabAlignment.Right:
        style = { ...style, 'flex-direction': 'row-reverse' };
        break;
      case TabAlignment.Bottom:
        style = { ...style, 'flex-direction': 'column-reverse' };
        break;
      default:
        style = { ...style, 'flex-direction': 'column' };
        break;
    }

    return style;
  }

  protected createHeaderStyle(wrapper: TabbedWindowWrapper): any {
    return {
      'flex-direction': this.tabAlignment === TabAlignment.Left || this.tabAlignment === TabAlignment.Right ? 'column' : null
    };
  }

  protected createScrollerStyle(wrapper: TabbedWindowWrapper): any {
    if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
      return {
        'overflow-x': this.isMobile ? 'auto' : 'hidden',
        'overflow-y': 'hidden'
      };
    } else {
      return {
        'overflow-x': 'hidden',
        'overflow-y': this.isMobile ? 'auto' : 'hidden'
      };
    }
  }

  protected createTabsStyle(wrapper: TabbedWindowWrapper): any {
    switch (this.tabAlignment) {
      case TabAlignment.Left:
        return {
          'flex-direction': 'column',
          'align-items': 'flex-end'
        };
      case TabAlignment.Right:
        return {
          'flex-direction': 'column',
          'align-items': 'flex-start'
        };
      case TabAlignment.Bottom:
        return { 'align-items': 'flex-start' };
      default:
        return { 'align-items': 'flex-end' };
    }
  }

  protected createContentStyle(wrapper: TabbedWindowWrapper): any {
    let style: any = {
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
        wrapper.getBorderThicknessLeft())
    };

    const margin: number = StyleUtil.pixToRem(-1);

    switch (this.tabAlignment) {
      case TabAlignment.Left:
        style = { ...style, 'margin-left.rem': margin };
        break;
      case TabAlignment.Right:
        style = { ...style, 'margin-right.rem': margin };
        break;
      case TabAlignment.Bottom:
        style = { ...style, 'margin-bottom.rem': margin };
        break;
      default:
        style = { ...style, 'margin-top.rem': margin };
        break;
    }

    return style;
  }
}
