import { LayoutableControl, LayoutableProperties, LayoutableControlLabelTemplate, LayoutableControlLabel } from '.';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';

export class LayoutableControlWrapper {

  private name: string;

  private isVisible: boolean;
  private minLayoutWidth: number;
  private minLayoutHeight: number;
  private maxLayoutWidth: number;
  private maxLayoutHeight: number;
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
    this.dockItemSize = control.getDockItemSize();
    this.fieldRowSize = control.getFieldRowSize();
    this.hAlign = control.getAlignmentHorizontal();
    this.vAlign = control.getAlignmentVertical();
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
    return this.minLayoutHeight;
  }

  public getMaxLayoutWidth(): number {
    return this.maxLayoutWidth;
  }

  public getMaxLayoutHeight(): number {
    return this.maxLayoutHeight;
  }

  public getDockItemSize(): number {
    return this.dockItemSize;
  }

  public getFieldRowSize(): number {
    return this.fieldRowSize;
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    return this.hAlign;
  }

  public getAlignmentVertical(): VerticalAlignment {
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
    this.resultWdith = measuredWidth ? measuredWidth : 0;
  }

  public getResultHeight(): number {
    return this.resultHeight;
  }

  public setResultHeight(measuredHeight: number): void {
    this.resultHeight = measuredHeight ? measuredHeight : 0;
  }

}
