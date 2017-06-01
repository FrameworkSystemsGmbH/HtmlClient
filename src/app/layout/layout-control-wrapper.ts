import { LayoutControl, LayoutProperties, LayoutControlLabelTemplate, LayoutControlLabel } from '.';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../enums';

export class LayoutControlWrapper {

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

  private layoutableProperties: LayoutProperties;
  private controlLabel: LayoutControlLabel;
  private labelTemplate: LayoutControlLabelTemplate;

  private resultWdith: number;
  private resultHeight: number;

  constructor(private control: LayoutControl) {
    this.name = control.getName();
    this.layoutableProperties = control.getLayoutableProperties();
    this.isVisible = control.getVisibility() !== ControlVisibility.Collapsed;
    this.minLayoutWidth = control.getLayoutableProperties().getMinLayoutWidth();
    this.maxLayoutWidth = control.getLayoutableProperties().getMaxLayoutWidth();
    this.maxLayoutHeight = control.getLayoutableProperties().getMaxLayoutHeight();
    this.dockItemSize = control.getDockItemSize();
    this.fieldRowSize = control.getFieldRowSize();
    this.hAlign = control.getAlignmentHorizontal();
    this.vAlign = control.getAlignmentVertical();
    this.controlLabel = control.getControlLabel();
    this.labelTemplate = control.getLabelTemplate();
  }

  public getName(): string {
    return this.name;
  }

  public getLayoutableProperties(): LayoutProperties {
    return this.layoutableProperties;
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public getMinLayoutWidth(): number {
    return this.minLayoutWidth;
  }

  public getMinLayoutHeight(width: number): number {
    this.minLayoutHeight = this.control.getLayoutableProperties().getMinLayoutHeight(width);
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

  public getControlLabel(): LayoutControlLabel {
    return this.controlLabel;
  }

  public getLabelTemplate(): LayoutControlLabelTemplate {
    return this.labelTemplate;
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
