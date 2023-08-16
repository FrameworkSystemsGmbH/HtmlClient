import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerComponent } from '@app/controls/container.component';
import { TabAlignment } from '@app/enums/tab-alignment';
import { Visibility } from '@app/enums/visibility';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { FocusService } from '@app/services/focus.service';
import { ImageService } from '@app/services/image.service';
import { PlatformService } from '@app/services/platform.service';
import * as StyleUtil from '@app/util/style-util';
import { TabPageTemplate } from '@app/wrappers/tabbed-window/tab-page-template';
import { TabPageWrapper } from '@app/wrappers/tabbed-window/tab-page-wrapper';
import { TabbedWindowWrapper } from '@app/wrappers/tabbed-window/tabbed-window-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@Component({
  standalone: true,
  selector: 'hc-tabbed-window',
  templateUrl: './tabbed-window.component.html',
  styleUrls: ['./tabbed-window.component.scss'],
  imports: [
    CommonModule,
    FontAwesomeModule,
    OverlayscrollbarsModule
  ]
})
export class TabbedWindowComponent extends ContainerComponent implements OnInit, AfterViewInit {

  @Output()
  public readonly tabClicked: EventEmitter<TabPageWrapper> = new EventEmitter<TabPageWrapper>();

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef | null = null;

  @ViewChild('tabs', { static: true })
  public tabs: ElementRef<HTMLDivElement> | null = null;

  public tabPages: Array<TabPageWrapper> = new Array<TabPageWrapper>();
  public tabAlignment: TabAlignment = TabAlignment.Top;

  public wrapperStyle: any;
  public headerStyle: any;
  public tabsStyle: any;
  public contentStyle: any;
  public arrowHorizontalStyle: any;
  public arrowVerticalStyle: any;

  public scrollerOptions: any;

  private readonly _imageService: ImageService;
  private readonly _platformService: PlatformService;

  private readonly _scrollAutoHideDelay: number = 500;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    imageService: ImageService,
    platformService: PlatformService
  ) {
    super(cdr, focusService);

    this._imageService = imageService;
    this._platformService = platformService;

    this.scrollerOptions = {
      paddingAbsolute: true,
      overflowBehavior: {
        x: 'scroll',
        y: 'scroll'
      },
      scrollbars: {
        autoHide: 'scroll',
        autoHideDelay: this._scrollAutoHideDelay
      }
    };
  }

  public ngAfterViewInit(): void {
    this.getWrapper().validateSelectedTabIndex();
  }

  public callTabClicked(tabPage: TabPageWrapper): void {
    if (tabPage.getIsEditable() && tabPage.getVisibility() === Visibility.Visible) {
      this.tabClicked.emit(tabPage);
    }
  }

  public getViewContainerRef(): ViewContainerRef {
    if (this.anchor == null) {
      throw new Error('Tried to access uninitialized ViewContainerRef of \'TabbedWindowComponent\'');
    }

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
      if (this.tabs != null) {
        const selectedTab: HTMLLIElement | null = this.tabs.nativeElement.querySelector('div.selected');
        if (selectedTab) {
          selectedTab.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
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

    const activeImageWrapper: string | null = wrapper.getActiveImage();
    const activeImageTabPage: string | null = tabPage.getActiveImage();

    const inactiveImageWrapper: string | null = wrapper.getInactiveImage();
    const inactiveImageTabPage: string | null = tabPage.getInactiveImage();

    const activeImage: string | null = activeImageTabPage != null && activeImageTabPage.trim().length > 0 ? activeImageTabPage : activeImageWrapper;
    const inactiveImage: string | null = inactiveImageTabPage != null && inactiveImageTabPage.trim().length > 0 ? inactiveImageTabPage : inactiveImageWrapper;

    if (tabPage.isTabSelected() && activeImage != null && activeImage.trim().length > 0) {
      const activeImageUrl: string | null = this._imageService.getImageUrl(activeImage);

      if (activeImageUrl != null && activeImageUrl.trim().length > 0) {
        tabStyle = {
          ...tabStyle,
          'background-image': `url(${activeImageUrl})`,
          'background-size': 'cover'
        };
      }
    }

    if (!tabPage.isTabSelected() && inactiveImage != null && inactiveImage.trim().length > 0) {
      const inactiveImageUrl: string | null = this._imageService.getImageUrl(inactiveImage);

      if (inactiveImageUrl != null && inactiveImageUrl.trim().length > 0) {
        tabStyle = {
          ...tabStyle,
          'background-image': `url(${inactiveImageUrl})`,
          'background-size': 'cover'
        };
      }
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
}
