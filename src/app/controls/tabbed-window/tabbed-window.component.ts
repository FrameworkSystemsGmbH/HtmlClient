import { Component, ViewChild, ViewContainerRef, OnInit, Output, EventEmitter, Renderer2, NgZone, ElementRef, ChangeDetectorRef } from '@angular/core';
import { animate, transition, trigger, style } from '@angular/animations';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { StyleUtil } from 'app/util/style-util';
import { ContainerComponent } from 'app/controls/container.component';
import { TabbedWindowWrapper } from 'app/wrappers/tabbed-window/tabbed-window-wrapper';
import { TabPageWrapper } from 'app/wrappers/tabbed-window/tab-page-wrapper';
import { TabPageTemplate } from 'app/wrappers/tabbed-window/tab-page-template';
import { TabAlignment } from 'app/enums/tab-alignment';
import { Visibility } from 'app/enums/visibility';
import { PlatformService } from 'app/services/platform/platform.service';

@Component({
  selector: 'hc-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss'],
  animations: [
    trigger('arrow', [
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate('0.25s', style({
          opacity: 1
        }))
      ]),
      transition('* => void', [
        style({
          opacity: 1
        }),
        animate('0.25s', style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class TabbedWindowComponent extends ContainerComponent implements OnInit {

  @Output()
  public onTabClicked: EventEmitter<{ tabPage: TabPageWrapper; event: any }>;

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  @ViewChild('scroller', { static: true })
  public scroller: OverlayScrollbarsComponent;

  @ViewChild('tabs', { static: true })
  public tabs: ElementRef;

  public tabPages: Array<TabPageWrapper>;
  public tabAlignment: TabAlignment;

  public wrapperStyle: any;
  public headerStyle: any;
  public tabsStyle: any;
  public contentStyle: any;
  public arrowStyle: any;

  public arrowLeftVisible: boolean;
  public arrowRightVisible: boolean;

  private scrollLeftInterval: any;
  private scrollRightInterval: any;

  private scrollDelta: number = 100;

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
    private platformService: PlatformService,
    private cdr: ChangeDetectorRef
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
    this.arrowStyle = this.createArrowStyle(wrapper);
    this.scrollerOptions = this.createScrollerOptions();
  }

  public scrollIntoView(): void {
    setTimeout(() => {
      if (this.scroller != null && this.scroller.osInstance() != null && this.tabs != null) {
        const selectedTab: HTMLLIElement = this.tabs.nativeElement.querySelector('div.selected');
        if (selectedTab) {
          this.scroller.osInstance().scroll({ el: selectedTab, scroll: 'ifneeded', block: 'center' }, 250);
        }
      }
    });
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

    let wrapperStyle: any = {
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
        wrapperStyle = { ...wrapperStyle, 'flex-direction': 'row' };
        break;
      case TabAlignment.Right:
        wrapperStyle = { ...wrapperStyle, 'flex-direction': 'row-reverse' };
        break;
      case TabAlignment.Bottom:
        wrapperStyle = { ...wrapperStyle, 'flex-direction': 'column-reverse' };
        break;
      default:
        wrapperStyle = { ...wrapperStyle, 'flex-direction': 'column' };
        break;
    }

    return wrapperStyle;
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
    let contentStyle: any = {
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
        contentStyle = { ...contentStyle, 'margin-left.rem': margin };
        break;
      case TabAlignment.Right:
        contentStyle = { ...contentStyle, 'margin-right.rem': margin };
        break;
      case TabAlignment.Bottom:
        contentStyle = { ...contentStyle, 'margin-bottom.rem': margin };
        break;
      default:
        contentStyle = { ...contentStyle, 'margin-top.rem': margin };
        break;
    }

    return contentStyle;
  }

  protected createArrowStyle(wrapper: TabbedWindowWrapper): any {

  }

  protected createScrollerOptions(): any {
    let newOptions: any = this.scrollerOptions;

    if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
      newOptions = {
        ...this.scrollerOptions,
        overflowBehavior: {
          x: 'scroll',
          y: 'hidden'
        }
      };
    } else {
      newOptions = {
        ...this.scrollerOptions,
        overflowBehavior: {
          x: 'hidden',
          y: 'scroll'
        }
      };
    }

    if (this.platformService.isMobile()) {
      newOptions = {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: 250
        }
      };
    } else {
      newOptions = {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'move',
          autoHideDelay: 250
        }
      };
    }

    return newOptions;
  }

  public startScrollingLeft(event: any): void {
    if (event.button === 0) {
      const value: string = `-= ${this.scrollDelta}px`;
      this.scrollHorizontal(value);
      this.scrollLeftInterval = setInterval(() => { this.scrollHorizontal(value); }, 100);
    }
  }

  public stopScrollingLeft(): void {
    clearInterval(this.scrollLeftInterval);
  }

  public startScrollingRight(event: any): void {
    if (event.button === 0) {
      const value: string = `+= ${this.scrollDelta}px`;
      this.scrollHorizontal(value);
      this.scrollRightInterval = setInterval(() => { this.scrollHorizontal(value); }, 100);
    }
  }

  public stopScrollingRight(): void {
    clearInterval(this.scrollRightInterval);
  }

  protected scrollHorizontal(value: string): void {
    this.scroller.osInstance().scroll({ x: value }, 100);
  }

  public refreshScroller(): void {
    if (this.scroller != null && this.scroller.osInstance() != null) {
      const overflow: number = this.scroller.osInstance().getState().overflowAmount.x;
      if (overflow > 0) {
        const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollLeft;
        if (scrollPos === 0) {
          this.stopScrollingLeft();
          this.arrowLeftVisible = false;
          this.arrowRightVisible = true;
        } else if (scrollPos >= overflow) {
          this.stopScrollingRight();
          this.arrowLeftVisible = true;
          this.arrowRightVisible = false;
        } else {
          this.arrowLeftVisible = true;
          this.arrowRightVisible = true;
        }
      } else {
        this.stopScrollingLeft();
        this.stopScrollingRight();
        this.arrowLeftVisible = false;
        this.arrowRightVisible = false;
      }

      this.cdr.detectChanges();
    }
  }
}
