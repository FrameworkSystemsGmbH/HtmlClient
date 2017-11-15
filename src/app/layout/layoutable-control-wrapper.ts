import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export class LayoutableControlWrapper {

  private name: string;

  private isVisible: boolean;
  private minLayoutWidth: number;
  private minLayoutHeight: number;
  private maxLayoutWidth: number;
  private maxLayoutHeight: number;
  private marginLeft: number;
  private marginRight: number;
  private marginTop: number;
  private marginBottom: number;
  private dockItemSize: number;

  private hAlign: HorizontalAlignment;
  private vAlign: VerticalAlignment;

  private layoutableProperties: ILayoutableProperties;

  private resultWdith: number;
  private resultHeight: number;

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
    this.isVisible = control.getVisibility() !== ControlVisibility.Collapsed;
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

  public getIsVisible(): boolean {
    return this.isVisible;
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
}
