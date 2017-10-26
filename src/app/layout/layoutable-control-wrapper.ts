import { ILayoutableControl } from './layoutable-control';
import { ILayoutableProperties } from './layoutable-properties';
import { ILayoutableControlLabel } from './layoutable-control-label';
import { ILayoutableControlLabelTemplate } from './layoutable-control-label-template';
import { ControlVisibility } from '../enums/control-visibility';
import { HorizontalAlignment } from '../enums/horizontal-alignment';
import { VerticalAlignment } from '../enums/vertical-alignment';

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

  private layoutableProperties: ILayoutableProperties;
  private controlLabel: ILayoutableControlLabel;
  private labelTemplate: ILayoutableControlLabelTemplate;

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

  public getFieldRowSize(): number {
    return this.fieldRowSize;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    return this.hAlign;
  }

  public getVerticalAlignment(): VerticalAlignment {
    return this.vAlign;
  }

  public getControlLabel(): ILayoutableControlLabel {
    return this.controlLabel;
  }

  public getLabelTemplate(): ILayoutableControlLabelTemplate {
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
