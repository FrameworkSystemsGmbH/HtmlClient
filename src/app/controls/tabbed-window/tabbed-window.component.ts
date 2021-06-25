import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, NgZone, OnInit, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from '@app/controls/container.component';
import { TabAlignment } from '@app/enums/tab-alignment';
import { Visibility } from '@app/enums/visibility';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { ImageService } from '@app/services/image.service';
import { PlatformService } from '@app/services/platform.service';
import * as StyleUtil from '@app/util/style-util';
import { TabPageTemplate } from '@app/wrappers/tabbed-window/tab-page-template';
import { TabPageWrapper } from '@app/wrappers/tabbed-window/tab-page-wrapper';
import { TabbedWindowWrapper } from '@app/wrappers/tabbed-window/tabbed-window-wrapper';
import { faAngleDown, faAngleLeft, faAngleRight, faAngleUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

@Component({
  selector: 'hc-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss']
})
export class TabbedWindowComponent extends ContainerComponent implements OnInit, AfterViewInit {

  @Output()
  public tabClicked: EventEmitter<TabPageWrapper> = new EventEmitter<TabPageWrapper>();

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

  public iconAngleLeft: IconDefinition = faAngleLeft;
  public iconAngleRight: IconDefinition = faAngleRight;
  public iconAngleUp: IconDefinition = faAngleUp;
  public iconAngleDown: IconDefinition = faAngleDown;

  public tabPages: Array<TabPageWrapper>;
  public tabAlignment: TabAlignment;

  public wrapperStyle: any;
  public headerStyle: any;
  public tabsStyle: any;
  public contentStyle: any;
  public arrowHorizontalStyle: any;
  public arrowVerticalStyle: any;

  public scrollerOptions: any;

  private _zone: NgZone;
  private _renderer: Renderer2;
  private _imageService: ImageService;
  private _platformService: PlatformService;


  private _scrollLeftInterval: any;
  private _scrollRightInterval: any;

  private readonly _visibleClass: string = 'arrowVisible';

  private readonly _scrollDelta: number = 100;
  private readonly _scrollAnimationTime: number = 250;
  private readonly _scrollAutoHideDelay: number = 500;

  public constructor(injector: Injector) {
    super(injector);

    this.scrollerOptions = {
      className: 'os-thin',
      paddingAbsolute: true,
      overflowBehavior: {
        x: 'scroll',
        y: 'scroll'
      },
      scrollbars: {
        autoHide: 'scroll',
        autoHideDelay: this._scrollAutoHideDelay
      },
      callbacks: {
        onScroll: this.refreshScroller.bind(this),
        onOverflowChanged: this.refreshScroller.bind(this),
        onOverflowAmountChanged: this.refreshScroller.bind(this)
      }
    };
  }

  @HostListener('window:resize')
  public refreshScroller(): void {
    this._zone.runOutsideAngular(() => {
      if (this.scroller != null && this.scroller.osInstance() != null) {
        if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
          this._renderer.removeClass(this.arrowUp.nativeElement, this._visibleClass);
          this._renderer.removeClass(this.arrowDown.nativeElement, this._visibleClass);

          const overflow: number = this.scroller.osInstance().getState().overflowAmount.x;

          if (overflow > 0) {
            const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollLeft;

            if (scrollPos === 0) {
              this.stopScrollingUpOrLeft();
              this._renderer.removeClass(this.arrowLeft.nativeElement, this._visibleClass);
              this._renderer.addClass(this.arrowRight.nativeElement, this._visibleClass);
            } else if (scrollPos >= overflow) {
              this.stopScrollingDownOrRight();
              this._renderer.addClass(this.arrowLeft.nativeElement, this._visibleClass);
              this._renderer.removeClass(this.arrowRight.nativeElement, this._visibleClass);
            } else {
              this._renderer.addClass(this.arrowLeft.nativeElement, this._visibleClass);
              this._renderer.addClass(this.arrowRight.nativeElement, this._visibleClass);
            }
          } else {
            this.stopScrollingUpOrLeft();
            this.stopScrollingDownOrRight();
            this._renderer.removeClass(this.arrowLeft.nativeElement, this._visibleClass);
            this._renderer.removeClass(this.arrowRight.nativeElement, this._visibleClass);
          }
        } else {
          this._renderer.removeClass(this.arrowLeft.nativeElement, this._visibleClass);
          this._renderer.removeClass(this.arrowRight.nativeElement, this._visibleClass);

          const overflow: number = this.scroller.osInstance().getState().overflowAmount.y;

          if (overflow > 0) {
            const scrollPos: number = this.scroller.osInstance().getElements().viewport.scrollTop;

            if (scrollPos === 0) {
              this.stopScrollingUpOrLeft();
              this._renderer.removeClass(this.arrowUp.nativeElement, this._visibleClass);
              this._renderer.addClass(this.arrowDown.nativeElement, this._visibleClass);
            } else if (scrollPos >= overflow) {
              this.stopScrollingDownOrRight();
              this._renderer.addClass(this.arrowUp.nativeElement, this._visibleClass);
              this._renderer.removeClass(this.arrowDown.nativeElement, this._visibleClass);
            } else {
              this._renderer.addClass(this.arrowUp.nativeElement, this._visibleClass);
              this._renderer.addClass(this.arrowDown.nativeElement, this._visibleClass);
            }
          } else {
            this.stopScrollingUpOrLeft();
            this.stopScrollingDownOrRight();
            this._renderer.removeClass(this.arrowUp.nativeElement, this._visibleClass);
            this._renderer.removeClass(this.arrowDown.nativeElement, this._visibleClass);
          }
        }
      }
    });
  }

  protected init(): void {
    super.init();
    const injector: Injector = this.getInjector();
    this._zone = injector.get(NgZone);
    this._renderer = injector.get(Renderer2);
    this._imageService = injector.get(ImageService);
    this._platformService = injector.get(PlatformService);
  }

  public ngAfterViewInit(): void {
    this.getWrapper().validateSelectedTabIndex();
    this.refreshScroller();
  }

  public callTabClicked(tabPage: TabPageWrapper): void {
    if (tabPage.getIsEditable() && tabPage.getVisibility() === Visibility.Visible) {
      this.tabClicked.emit(tabPage);
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
          this.scroller.osInstance().scroll({ el: selectedTab, scroll: 'ifneeded', block: 'center' }, this._scrollAnimationTime);
        }
      }
    });
  }

  public getTabClasses(tabPage: TabPageWrapper): any {
    return {
      'selected': tabPage.isTabSelected(),
      'disabled': !tabPage.getIsEditable()
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
      const activeImageUrl: string = this._imageService.getImageUrl(activeImage);

      tabStyle = {
        ...tabStyle,
        'background-image': `url(${activeImageUrl})`,
        'background-size': 'cover'
      };
    }

    if (!tabPage.isTabSelected() && !String.isNullOrWhiteSpace(inactiveImage)) {
      const inactiveImageUrl: string = this._imageService.getImageUrl(inactiveImage);

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

    if (this._platformService.isNative()) {
      newOptions = {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: this._scrollAutoHideDelay
        }
      };
    } else {
      newOptions = {
        ...this.scrollerOptions,
        scrollbars: {
          autoHide: 'move',
          autoHideDelay: this._scrollAutoHideDelay
        }
      };
    }

    return newOptions;
  }

  public startScrollingUpOrLeft(event: any): void {
    if (event.button === 0) {
      const value: string = `-= ${this._scrollDelta}px`;
      if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
        this.scrollHorizontal(value);
        this._scrollLeftInterval = setInterval(() => {
          this.scrollHorizontal(value);
        }, this._scrollAnimationTime);
      } else {
        this.scrollVertical(value);
        this._scrollLeftInterval = setInterval(() => {
          this.scrollVertical(value);
        }, this._scrollAnimationTime);
      }
    }
  }

  public stopScrollingUpOrLeft(): void {
    clearInterval(this._scrollLeftInterval);
  }

  public startScrollingDownOrRight(event: any): void {
    if (event.button === 0) {
      const value: string = `+= ${this._scrollDelta}px`;
      if (this.tabAlignment === TabAlignment.Top || this.tabAlignment === TabAlignment.Bottom) {
        this.scrollHorizontal(value);
        this._scrollRightInterval = setInterval(() => {
          this.scrollHorizontal(value);
        }, this._scrollAnimationTime);
      } else {
        this.scrollVertical(value);
        this._scrollRightInterval = setInterval(() => {
          this.scrollVertical(value);
        }, this._scrollAnimationTime);
      }
    }
  }

  public stopScrollingDownOrRight(): void {
    clearInterval(this._scrollRightInterval);
  }

  protected scrollHorizontal(value: string): void {
    this.scroller.osInstance().scroll({ x: value }, this._scrollAnimationTime);
  }

  protected scrollVertical(value: string): void {
    this.scroller.osInstance().scroll({ y: value }, this._scrollAnimationTime);
  }
}
