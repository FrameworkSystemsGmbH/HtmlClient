import { LayoutableControl } from './layoutable-control';
import { LayoutableProperties } from './layoutable-properties';
import { LayoutableControlLabel } from './layoutable-control-label';
import { LayoutableControlLabelTemplate } from './layoutable-control-label-template';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';

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
  private fieldRowSize: number;

  private hAlign: HorizontalAlignment;
  private vAlign: VerticalAlignment;

  private layoutableProperties: LayoutableProperties;
  private controlLabel: LayoutableControlLabel;
  private labelTemplate: LayoutableControlLabelTemplate;

  private resultWdith: number;
  private resultHeight: number;

  constructor(private control: LayoutableControl) {
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
    this.fieldRowSize = control.getFieldRowSize();
    this.hAlign = control.getHorizontalAlignment();
    this.vAlign = control.getVerticalAlignment();
    this.controlLabel = control.getControlLabel();
    this.labelTemplate = control.getLabelTemplate();
    this.isVisible = control.getVisibility() !== ControlVisibility.Collapsed;
  }

  public getName(): string {
    return this.name;
  }

  public getLayoutableProperties(): LayoutableProperties {
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

  public getFieldRowSize(): number {
    return this.fieldRowSize;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return this.hAlign;
  }

  public getVerticalAlignment(): VerticalAlignment {
    return this.vAlign;
  }

  public getControlLabel(): LayoutableControlLabel {
    return this.controlLabel;
  }

  public getLabelTemplate(): LayoutableControlLabelTemplate {
    return this.labelTemplate;
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
