import { Component, ViewChild, ViewContainerRef, OnInit, ElementRef, Injector } from '@angular/core';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, style, animate } from '@angular/animations';

import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';

import { ControlComponent } from '@app/controls/control.component';
import { ListViewWrapper, IHeaderOptions } from '@app/wrappers/listview-wrapper';
import { ListViewItemArrangement } from '@app/enums/listview-item-arrangement';
import { ListViewItemWrapper } from '@app/wrappers/listview-item-wrapper';
import { PlatformService } from '@app/services/platform.service';
import { ListViewSelectionMode } from '@app/enums/listview-selection-mode';

import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';

@Component({
  selector: 'hc-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss'],
  animations: [
    trigger('listwrapper', [
      transition(':enter', [])
    ]),
    trigger('listheader', [
      transition('void => *', [
        style({
          transform: 'translateY(-100%)'
        }),
        animate(100, style({
          transform: 'translateY(0)'
        }))]),
      transition('* => void', [
        style({
          transform: 'translateY(0)'
        }),
        animate(100, style({
          transform: 'translateY(-100%)'
        }))])
    ])
  ]
})
export class ListViewComponent extends ControlComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  @ViewChild('wrapper', { static: true })
  public wrapperEl: ElementRef;

  public iconTimes: IconDefinition = faTimes;

  public wrapperStyle: any;
  public headerStyle: any;
  public buttonStyle: any;
  public buttonCloseStyle: any;
  public itemContainerStyle: any;

  private platformService: PlatformService;

  constructor(injector: Injector) {
    super(injector);
  }

  protected init(): void {
    // tslint:disable-next-line: deprecation
    this.platformService = this.getInjector().get(PlatformService);
  }

  public onFocusOut(event: FocusEvent): void {
    if (this.platformService.isNative()) {
      setTimeout(() => {
        const targetIsDescentant: boolean = DomUtil.isDescentantOrSelf(this.wrapperEl.nativeElement, event.target as HTMLElement);
        const activeIsOutside: boolean = !DomUtil.isDescentantOrSelf(this.wrapperEl.nativeElement, document.activeElement as HTMLElement);

        if (targetIsDescentant && activeIsOutside) {
          this.getWrapper().setMobileSelectionModeEnabled(false);
        }
      });
    }
  }

  public closeSelectionMode(): void {
    this.getWrapper().setMobileSelectionModeEnabled(false);
  }

  public selectAll(): void {
    this.getWrapper().selectAll();
  }

  public selectNone(): void {
    this.getWrapper().selectNone();
  }

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

      if (itemWrapper.isNew() || !itemWrapper.isAttached()) {
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
    this.headerStyle = this.createHeaderStyle(wrapper);
    this.buttonStyle = this.createButtonStyle(wrapper);
    this.buttonCloseStyle = this.createButtonCloseStyle(wrapper);
    this.itemContainerStyle = this.createItemContainerStyle(wrapper);
  }

  public isHeaderVisible(): boolean {
    const wrapper: ListViewWrapper = this.getWrapper();
    return wrapper.getSelectionMode() === ListViewSelectionMode.Multiple && (!this.platformService.isNative() || this.getWrapper().getMobileSelectionModeEnabled());
  }

  protected createWrapperStyle(wrapper: ListViewWrapper): any {
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

  protected createHeaderStyle(wrapper: ListViewWrapper): any {
    return {
      'height.rem': StyleUtil.pixToRem(wrapper.getHeaderOptions().height)
    };
  }

  protected createButtonStyle(wrapper: ListViewWrapper): any {
    const headerOptions: IHeaderOptions = wrapper.getHeaderOptions();

    return {
      'width.rem': StyleUtil.pixToRem(headerOptions.buttonWidth),
      'font-size.rem': StyleUtil.pixToRem(headerOptions.fontSize)
    };
  }

  protected createButtonCloseStyle(wrapper: ListViewWrapper): any {
    let buttonCloseStyle: any = this.createButtonStyle(wrapper);

    buttonCloseStyle = {
      ...buttonCloseStyle,
      'display': this.platformService.isNative() ? 'inline' : 'none'
    };

    return buttonCloseStyle;
  }

  protected createItemContainerStyle(wrapper: ListViewWrapper): any {
    const itemArrangement: ListViewItemArrangement = wrapper.getItemArrangement();
    const itemWidth: number = wrapper.getItemWidth();
    const spacingHorizontal: number = wrapper.getSpacingHorizontal();
    const spacingVertical: number = wrapper.getSpacingVertical();

    let itemContainerStyle: any = {
      'display': 'grid',
      'column-gap': StyleUtil.pixToRemValueStr(spacingHorizontal),
      'row-gap': StyleUtil.pixToRemValueStr(spacingVertical),
      'align-content': 'flex-start',
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft())
    };

    if (itemArrangement === ListViewItemArrangement.List) {
      itemContainerStyle = {
        ...itemContainerStyle,
        'grid-template-columns': '1fr'
      };
    } else {
      itemContainerStyle = {
        ...itemContainerStyle,
        'grid-template-columns': `repeat(auto-fit, minmax(${StyleUtil.pixToRemValueStr(itemWidth)}, 1fr)`
      };
    }

    return itemContainerStyle;
  }
}
