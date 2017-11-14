import { ILayoutableControl } from 'app/layout/layoutable-control';
import { ILayoutableControlLabel } from 'app/layout/layoutable-control-label';
import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template';

import { LayoutBase } from 'app/layout/layout-base';
import { LayoutablePropertiesDefault } from 'app/wrappers/layout/layoutable-properties-default';
import { LayoutableControlLabelTemplate } from 'app/wrappers/layout/layoutable-control-label-template';
import { ControlLayout } from 'app/layout/control-layout/control-layout';
import { PropertyStore } from 'app/common/property-store';
import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { ILayoutableContainer } from 'app/layout/layoutable-container';

export abstract class LayoutableWrapper implements ILayoutableControl {

  protected propertyStore: PropertyStore;

  private name: string;
  private layout: LayoutBase;
  private layoutableProperties: LayoutablePropertiesDefault;
  private labelTemplate: LayoutableControlLabelTemplate;

  constructor() {
    this.propertyStore = new PropertyStore();
  }

  public getName(): string {
    return this.name;
  }

  protected setName(name: string): void {
    this.name = name;
  }

  public getVisibility(): ControlVisibility {
    const visibility: ControlVisibility = this.propertyStore.getVisibility();
    return visibility != null ? visibility : ControlVisibility.Visible;
  }

  protected getLayout(): LayoutBase {
    if (!this.layout) {
      this.layout = this.createLayout();
    }
    return this.layout;
  }

  protected createLayout(): LayoutBase {
    return new ControlLayout(this);
  }

  public getLayoutableProperties(): LayoutablePropertiesDefault {
    if (!this.layoutableProperties) {
      this.layoutableProperties = this.createLayoutableProperties();
    }
    return this.layoutableProperties;
  }

  protected createLayoutableProperties(): LayoutablePropertiesDefault {
    return new LayoutablePropertiesDefault(this);
  }

  public getMinLayoutWidth(): number {
    return this.getLayout().measureMinWidth();
  }

  public getMinLayoutHeight(width: number): number {
    return this.getLayout().measureMinHeight(width);
  }

  public getMaxLayoutWidth(): number {
    return Number.maxIfNull(this.getMaxWidth());
  }

  public getMaxLayoutHeight(): number {
    return Number.maxIfNull(this.getMaxHeight());
  }

  public getMinWidth(): number {
    return Number.zeroIfNull(this.propertyStore.getMinWidth());
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this.propertyStore.getMinHeight());
  }

  public getMaxWidth(): number {
    return Number.maxIfNull(this.propertyStore.getMaxWidth());
  }

  public getMaxHeight(): number {
    return Number.maxIfNull(this.propertyStore.getMaxHeight());
  }

  public getMarginLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginLeft());
  }

  public getMarginRight(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginRight());
  }

  public getMarginTop(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginTop());
  }

  public getMarginBottom(): number {
    return Number.zeroIfNull(this.propertyStore.getMarginBottom());
  }

  public getBorderThicknessLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessLeft());
  }

  public getBorderThicknessRight(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessRight());
  }

  public getBorderThicknessTop(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessTop());
  }

  public getBorderThicknessBottom(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderThicknessBottom());
  }

  public getPaddingLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingLeft());
  }

  public getPaddingRight(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingRight());
  }

  public getPaddingTop(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingTop());
  }

  public getPaddingBottom(): number {
    return Number.zeroIfNull(this.propertyStore.getPaddingBottom());
  }

  public getInsetsLeft(): number {
    return this.getPaddingLeft() + this.getBorderThicknessLeft() + this.getMarginLeft();
  }

  public getInsetsRight(): number {
    return this.getPaddingRight() + this.getBorderThicknessRight() + this.getMarginRight();
  }

  public getInsetsTop(): number {
    return this.getPaddingTop() + this.getBorderThicknessTop() + this.getMarginTop();
  }

  public getInsetsBottom(): number {
    return this.getPaddingBottom() + this.getBorderThicknessBottom() + this.getMarginBottom();
  }

  public getDockItemSize(): number {
    const dockItemSize: number = this.propertyStore.getDockItemSize();
    return dockItemSize != null ? dockItemSize : null;
  }

  public getFieldRowSize(): number {
    const fieldRowSize: number = this.propertyStore.getFieldRowSize();
    return fieldRowSize != null ? fieldRowSize : null;
  }

  public getHorizontalAlignment(): HorizontalAlignment {
    const hAlign: HorizontalAlignment = this.propertyStore.getHorizontalAlignment();
    return hAlign != null ? hAlign : HorizontalAlignment.Stretch;
  }

  public getVerticalAlignment(): VerticalAlignment {
    const vAlign: VerticalAlignment = this.propertyStore.getVerticalAlignment();
    return vAlign != null ? vAlign : VerticalAlignment.Stretch;
  }

  public getControlLabel(): ILayoutableControlLabel {
    return null;
  }

  public getLabelTemplate(): ILayoutableControlLabelTemplate {
    if (!this.labelTemplate) {
      this.labelTemplate = new LayoutableControlLabelTemplate(this.propertyStore.getPropertyStore(data => data.labelTemplate));
    }
    return this.labelTemplate;
  }

  public setParent(parent: ILayoutableContainer): void {

  }
}
