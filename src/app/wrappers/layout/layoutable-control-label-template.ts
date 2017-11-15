import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template.interface';

import { PropertyStore } from 'app/common/property-store';
import { TextAlign } from 'app/enums/text-align';

export class LayoutableControlLabelTemplate implements ILayoutableControlLabelTemplate {

  private propertyStore: PropertyStore;

  constructor(propertyStore: PropertyStore) {
    this.propertyStore = propertyStore;
  }

  public getIsVisible(): boolean {
    return Boolean.trueIfNull(this.propertyStore.getIsVisible());
  }

  public getForeColor(): string {
    const foreColor: string = this.propertyStore.getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    const backColor: string = this.propertyStore.getBackColor();
    return backColor != null ? backColor : '#FFFFFF';
  }

  public getFontFamily(): string {
    const fontFamily: string = this.propertyStore.getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontSize(): number {
    const fontSize: number = this.propertyStore.getFontSize();
    return fontSize != null ? fontSize : 14;
  }

  public getFontBold(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontBold());
  }

  public getFontItalic(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontItalic());
  }

  public getFontUnderline(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getFontUnderline());
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign = this.propertyStore.getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Center;
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
}
