import { Component, ViewChild, ViewContainerRef, OnInit, Output, EventEmitter, Renderer2, NgZone } from '@angular/core';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { StyleUtil } from 'app/util/style-util';
import { ContainerComponent } from 'app/controls/container.component';
import { TabbedWindowWrapper } from 'app/wrappers/tabbed-window/tabbed-window-wrapper';
import { TabPageWrapper } from 'app/wrappers/tabbed-window/tab-page-wrapper';
import { TabPageTemplate } from 'app/wrappers/tabbed-window/tab-page-template';
import { TabAlignment } from 'app/enums/tab-alignment';
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

  @ViewChild('scroller', { static: true })
  public scroller: OverlayScrollbarsComponent;

  public tabPages: Array<TabPageWrapper>;
  public tabAlignment: TabAlignment;

  public wrapperStyle: any;
  public headerStyle: any;
  public tabsStyle: any;
  public contentStyle: any;

  public scrollerOptions: any = {
    className: 'os-theme-thin-dark',
    paddingAbsolute: true,
    overflowBehavior: {
      x: 'scroll',
      y: 'scroll'
    },
    scrollbars: {
      autoHide: 'leave',
      autoHideDelay: 0
    },
    callbacks: {
      onScroll: this.refreshScroller.bind(this),
      onOverflowChanged: this.refreshScroller.bind(this),
      onOverflowAmountChanged: this.refreshScroller.bind(this)
    }
  };

  constructor(
    private zone: NgZone,
    private renderer: Renderer2
  ) {
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
    this.tabPages = wrapper.getTabPages();
    this.tabAlignment = wrapper.getTabAlignment();
  }

  protected updateStyles(wrapper: TabbedWindowWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.headerStyle = this.createHeaderStyle();
    this.tabsStyle = this.createTabsStyle();
    this.contentStyle = this.createContentStyle(wrapper);
    this.scrollerOptions = this.createScrollerOptions();
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

  protected createHeaderStyle(): any {
    return {
      'flex-direction': this.tabAlignment === TabAlignment.Left || this.tabAlignment === TabAlignment.Right ? 'column' : null
    };
  }

  protected createTabsStyle(): any {
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

  protected createScrollerOptions(): any {
    if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
      return {
        ...this.scrollerOptions,
        overflowBehavior: {
          x: 'scroll',
          y: 'hidden'
        }
      };
    } else {
      return {
        ...this.scrollerOptions,
        overflowBehavior: {
          x: 'hidden',
          y: 'scroll'
        }
      };
    }
  }

  public refreshScroller(): void {
    this.zone.runOutsideAngular(() => {
      if (this.scroller != null && this.scroller.osInstance() != null) {
        const overflow: number = this.scroller.osInstance().getState().overflowAmount.x;
        if (overflow > 0) {
          const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollLeft;
          if (scrollPos === 0) {
            this.renderer.addClass(this.scroller.osTarget(), 'arrowRight');
            this.renderer.removeClass(this.scroller.osTarget(), 'arrowLeft');
          } else if (scrollPos >= overflow) {
            this.renderer.addClass(this.scroller.osTarget(), 'arrowLeft');
            this.renderer.removeClass(this.scroller.osTarget(), 'arrowRight');
          } else {
            this.renderer.addClass(this.scroller.osTarget(), 'arrowLeft');
            this.renderer.addClass(this.scroller.osTarget(), 'arrowRight');
          }
        } else {
          this.renderer.removeClass(this.scroller.osTarget(), 'arrowLeft');
          this.renderer.removeClass(this.scroller.osTarget(), 'arrowRight');
        }
      }
    });
  }

  // this.scroller.osInstance().scroll({ el: this.tab.nativeElement, scroll: 'ifneeded' }, 250);
}
