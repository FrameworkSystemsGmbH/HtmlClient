import { Component, ViewChild, ViewContainerRef, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, NgZone, Renderer2 } from '@angular/core';
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
import { ImageService } from 'app/services/image.service';

@Component({
  selector: 'hc-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss']
})
export class TabbedWindowComponent extends ContainerComponent implements OnInit, AfterViewInit {

  @Output()
  public onTabClicked: EventEmitter<TabPageWrapper> = new EventEmitter<TabPageWrapper>();

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  @ViewChild('scroller', { static: true })
  public scroller: OverlayScrollbarsComponent;

  @ViewChild('arrowLeft', { static: true })
  public arrowLeft: ElementRef;

  @ViewChild('arrowRight', { static: true })
  public arrowRight: ElementRef;

  @ViewChild('arrowUp', { static: true })
  public arrowUp: ElementRef;

  @ViewChild('arrowDown', { static: true })
  public arrowDown: ElementRef;

  @ViewChild('tabs', { static: true })
  public tabs: ElementRef;

  public tabPages: Array<TabPageWrapper>;
  public tabAlignment: TabAlignment;

  public wrapperStyle: any;
  public headerStyle: any;
  public tabsStyle: any;
  public contentStyle: any;
  public arrowHorizontalStyle: any;
  public arrowVerticalStyle: any;

  private visibleClass: string = 'arrowVisible';

  private scrollLeftInterval: any;
  private scrollRightInterval: any;

  private scrollDelta: number = 100;
  private scrollAnimationTime: number = 250;
  private scrollAutoHideDelay: number = 500;

  public scrollerOptions: any = {
    className: 'os-theme-thin-dark',
    paddingAbsolute: true,
    overflowBehavior: {
      x: 'scroll',
      y: 'scroll'
    },
    scrollbars: {
      autoHide: 'scroll',
      autoHideDelay: this.scrollAutoHideDelay
    },
    callbacks: {
      onScroll: this.refreshScroller.bind(this),
      onOverflowChanged: this.refreshScroller.bind(this),
      onOverflowAmountChanged: this.refreshScroller.bind(this)
    }
  };

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
    private imageService: ImageService,
    private platformService: PlatformService
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    this.getWrapper().validateSelectedTabIndex();
    this.refreshScroller();
  }

  public callOnTabClicked(tabPage: TabPageWrapper): void {
    if (tabPage.getIsEditable() && tabPage.getVisibility() === Visibility.Visible) {
      this.onTabClicked.emit(tabPage);
    }
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getWrapper(): TabbedWindowWrapper {
    return super.getWrapper() as TabbedWindowWrapper;
  }

  protected updateData(wrapper: TabbedWindowWrapper): void {
    super.updateData(wrapper);
    this.tabPages = wrapper.getTabPages().filter(t => t.getVisibility() === Visibility.Visible);
    this.tabAlignment = wrapper.getTabAlignment();
  }

  protected updateStyles(wrapper: TabbedWindowWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.headerStyle = this.createHeaderStyle();
    this.tabsStyle = this.createTabsStyle();
    this.contentStyle = this.createContentStyle(wrapper);
    this.arrowHorizontalStyle = this.createArrowHorizontalStyle(wrapper);
    this.arrowVerticalStyle = this.createArrowVerticalStyle();
    this.scrollerOptions = this.createScrollerOptions();
  }

  public scrollIntoView(): void {
    setTimeout(() => {
      if (this.scroller != null && this.scroller.osInstance() != null && this.tabs != null) {
        const selectedTab: HTMLLIElement = this.tabs.nativeElement.querySelector('div.selected');
        if (selectedTab) {
          this.scroller.osInstance().scroll({ el: selectedTab, scroll: 'ifneeded', block: 'center' }, this.scrollAnimationTime);
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
    const wrapper: TabbedWindowWrapper = this.getWrapper();
    const template: TabPageTemplate = wrapper.getCurrentTabPageTemplate(tabPage);

    let tabStyle: any = {
      'color': template.getForeColor(),
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

    const activeImageWrapper: string = wrapper.getActiveImage();
    const activeImageTabPage: string = tabPage.getActiveImage();

    const inactiveImageWrapper: string = wrapper.getInactiveImage();
    const inactiveImageTabPage: string = tabPage.getInactiveImage();

    const activeImage: string = !String.isNullOrWhiteSpace(activeImageTabPage) ? activeImageTabPage : activeImageWrapper;
    const inactiveImage: string = !String.isNullOrWhiteSpace(inactiveImageTabPage) ? inactiveImageTabPage : inactiveImageWrapper;

    if (tabPage.isTabSelected() && !String.isNullOrWhiteSpace(activeImage)) {
      const activeImageUrl: string = this.imageService.getImageUrl(activeImage);

      tabStyle = {
        ...tabStyle,
        'background-image': `url(${activeImageUrl})`,
        'background-size': 'cover'
      };
    }

    if (!tabPage.isTabSelected() && !String.isNullOrWhiteSpace(inactiveImage)) {
      const inactiveImageUrl: string = this.imageService.getImageUrl(inactiveImage);

      tabStyle = {
        ...tabStyle,
        'background-image': `url(${inactiveImageUrl})`,
        'background-size': 'cover'
      };
    }

    return tabStyle;
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

  protected createArrowHorizontalStyle(wrapper: TabbedWindowWrapper): any {
    if (this.tabAlignment === TabAlignment.Bottom) {
      return {
        'top.rem': StyleUtil.pixToRem(Math.roundDec(wrapper.getInactiveTabTemplateHeight() / 2, 0)),
        'transform': 'translateY(-50%)'
      };
    } else {
      return {
        'bottom.rem': StyleUtil.pixToRem(Math.roundDec(wrapper.getInactiveTabTemplateHeight() / 2, 0)),
        'transform': 'translateY(50%)'
      };
    }
  }

  protected createArrowVerticalStyle(): any {
    if (this.tabAlignment === TabAlignment.Right) {
      return {
        'left.%': 50,
        'transform': 'translateX(-50%)'
      };
    } else {
      return {
        'right.%': 50,
        'transform': 'translateX(50%)'
      };
    }
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
          autoHideDelay: this.scrollAutoHideDelay
        }
      };
    } else {
      newOptions = {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: this.scrollAutoHideDelay
        }
      };
    }

    return newOptions;
  }

  public startScrollingUpOrLeft(event: any): void {
    if (event.button === 0) {
      const value: string = `-= ${this.scrollDelta}px`;
      if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
        this.scrollHorizontal(value);
        this.scrollLeftInterval = setInterval(() => { this.scrollHorizontal(value); }, this.scrollAnimationTime);
      } else {
        this.scrollVertical(value);
        this.scrollLeftInterval = setInterval(() => { this.scrollVertical(value); }, this.scrollAnimationTime);
      }
    }
  }

  public stopScrollingUpOrLeft(): void {
    clearInterval(this.scrollLeftInterval);
  }

  public startScrollingDownOrRight(event: any): void {
    if (event.button === 0) {
      const value: string = `+= ${this.scrollDelta}px`;
      if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
        this.scrollHorizontal(value);
        this.scrollRightInterval = setInterval(() => { this.scrollHorizontal(value); }, this.scrollAnimationTime);
      } else {
        this.scrollVertical(value);
        this.scrollRightInterval = setInterval(() => { this.scrollVertical(value); }, this.scrollAnimationTime);
      }
    }
  }

  public stopScrollingDownOrRight(): void {
    clearInterval(this.scrollRightInterval);
  }

  protected scrollHorizontal(value: string): void {
    this.scroller.osInstance().scroll({ x: value }, this.scrollAnimationTime);
  }

  protected scrollVertical(value: string): void {
    this.scroller.osInstance().scroll({ y: value }, this.scrollAnimationTime);
  }

  public refreshScroller(): void {
    this.zone.runOutsideAngular(() => {
      if (this.scroller != null && this.scroller.osInstance() != null) {
        if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
          this.renderer.removeClass(this.arrowUp.nativeElement, this.visibleClass);
          this.renderer.removeClass(this.arrowDown.nativeElement, this.visibleClass);

          const overflow: number = this.scroller.osInstance().getState().overflowAmount.x;

          if (overflow > 0) {
            const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollLeft;

            if (scrollPos === 0) {
              this.stopScrollingUpOrLeft();
              this.renderer.removeClass(this.arrowLeft.nativeElement, this.visibleClass);
              this.renderer.addClass(this.arrowRight.nativeElement, this.visibleClass);
            } else if (scrollPos >= overflow) {
              this.stopScrollingDownOrRight();
              this.renderer.addClass(this.arrowLeft.nativeElement, this.visibleClass);
              this.renderer.removeClass(this.arrowRight.nativeElement, this.visibleClass);
            } else {
              this.renderer.addClass(this.arrowLeft.nativeElement, this.visibleClass);
              this.renderer.addClass(this.arrowRight.nativeElement, this.visibleClass);
            }
          } else {
            this.stopScrollingUpOrLeft();
            this.stopScrollingDownOrRight();
            this.renderer.removeClass(this.arrowLeft.nativeElement, this.visibleClass);
            this.renderer.removeClass(this.arrowRight.nativeElement, this.visibleClass);
          }
        } else {
          this.renderer.removeClass(this.arrowLeft.nativeElement, this.visibleClass);
          this.renderer.removeClass(this.arrowRight.nativeElement, this.visibleClass);

          const overflow: number = this.scroller.osInstance().getState().overflowAmount.y;

          if (overflow > 0) {
            const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollTop;

            if (scrollPos === 0) {
              this.stopScrollingUpOrLeft();
              this.renderer.removeClass(this.arrowUp.nativeElement, this.visibleClass);
              this.renderer.addClass(this.arrowDown.nativeElement, this.visibleClass);
            } else if (scrollPos >= overflow) {
              this.stopScrollingDownOrRight();
              this.renderer.addClass(this.arrowUp.nativeElement, this.visibleClass);
              this.renderer.removeClass(this.arrowDown.nativeElement, this.visibleClass);
            } else {
              this.renderer.addClass(this.arrowUp.nativeElement, this.visibleClass);
              this.renderer.addClass(this.arrowDown.nativeElement, this.visibleClass);
            }
          } else {
            this.stopScrollingUpOrLeft();
            this.stopScrollingDownOrRight();
            this.renderer.removeClass(this.arrowUp.nativeElement, this.visibleClass);
            this.renderer.removeClass(this.arrowDown.nativeElement, this.visibleClass);
          }
        }
      }
    });
  }
}
