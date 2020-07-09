import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';
import { IFieldLayoutSynchronized } from 'app/layout/field-layout/field-layout-synchronized.interface';

import { Visibility } from 'app/enums/visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';
import { LayoutContainerBase } from 'app/layout/layout-container-base';

import { isILayoutableContainer, isIFieldLayoutSynchronized } from 'app/util/interface-util';

export class LayoutableControlWrapper {

  private name: string;

  private minLayoutWidth: number;
  private minLayoutHeight: number;
  private maxLayoutWidth: number;
  private maxLayoutHeight: number;
  private marginLeft: number;
  private marginRight: number;
  private marginTop: number;
  private marginBottom: number;
  private dockItemSize: number;

  private visibility: Visibility;
  private isControlVisible: boolean;
  private isLayoutVisible: boolean;
  private isSynchronizedHidden: boolean;

  private hAlign: HorizontalAlignment;
  private vAlign: VerticalAlignment;

  private layoutableProperties: ILayoutableProperties;

  private resultWdith: number;
  private resultHeight: number;

  private layout: LayoutContainerBase;

  constructor(private control: ILayoutableControl) {
    this.name = control.getName();
    this.layoutableProperties = control.getLayoutableProperties();
    this.minLayoutWidth = control.getMinLayoutWidth();
    this.maxLayoutWidth = control.getMaxLayoutWidth();
    this.maxLayoutHeight = control.getMaxLayoutHeight();
    this.marginLeft = control.getMarginLeft();
    this.marginRight = control.getMarginRight();
    this.marginTop = control.getMarginTop();
    this.marginBottom = control.getMarginBottom();
    this.dockItemSize = control.getDockItemSize();
    this.hAlign = control.getHorizontalAlignment();
    this.vAlign = control.getVerticalAlignment();
    this.visibility = control.getCurrentVisibility();

    this.isControlVisible = this.visibility === Visibility.Visible;
    this.isLayoutVisible = this.visibility !== Visibility.Collapsed;

    if (isILayoutableContainer(control)) {
      this.layout = (control as ILayoutableContainer).getLayout();
    }

    if (isIFieldLayoutSynchronized(control)) {
      this.isSynchronizedHidden = (control as IFieldLayoutSynchronized).isSynchronizedHidden();
    }
  }

  public getName(): string {
    return this.name;
  }

  public getLayoutableProperties(): ILayoutableProperties {
    return this.layoutableProperties;
  }

  public getMinLayoutWidth(): number {
    return this.minLayoutWidth;
  }

  public getMinLayoutHeight(width: number): number {
    this.minLayoutHeight = this.control.getMinLayoutHeight(width);
    return this.minLayoutHeight;
  }

  public getMinLayoutHeightBuffered() {
    return Number.zeroIfNull(this.minLayoutHeight);
  }

  public getMaxLayoutWidth(): number {
    return this.maxLayoutWidth;
  }

  public getMaxLayoutHeight(): number {
    return this.maxLayoutHeight;
  }

  public getMarginLeft(): number {
    return this.marginLeft;
  }

  public getMarginRight(): number {
    return this.marginRight;
  }

  public getMarginTop(): number {
    return this.marginTop;
  }

  public getMarginBottom(): number {
    return this.marginBottom;
  }

  public getDockItemSize(): number {
    return this.dockItemSize;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return this.hAlign;
  }

  public getVerticalAlignment(): VerticalAlignment {
    return this.vAlign;
  }

  public getVisibility(): Visibility {
    return this.visibility;
  }

  public getIsControlVisible(): boolean {
    return this.isControlVisible;
  }

  public getIsLayoutVisible(): boolean {
    return this.isLayoutVisible;
  }

  public getIsSynchronizedVisible(): boolean {
    return !this.isSynchronizedHidden;
  }

  public getResultWidth(): number {
    return this.resultWdith;
  }

  public setResultWidth(measuredWidth: number): void {
    this.resultWdith = Number.zeroIfNull(measuredWidth);
  }

  public getResultHeight(): number {
    return this.resultHeight;
  }

  public setResultHeight(measuredHeight: number): void {
    this.resultHeight = Number.zeroIfNull(measuredHeight);
  }

  public arrangeContainer(): void {
    if (this.layout) {
      this.layout.arrange();
    }
  }
}
