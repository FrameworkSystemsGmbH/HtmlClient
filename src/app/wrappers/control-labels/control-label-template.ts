import { PropertyStore } from '@app/common/property-store';
import { TextAlign } from '@app/enums/text-align';
import { ILayoutableControlLabelTemplate } from '@app/layout/layoutable-control-label-template.interface';

export class ControlLabelTemplate implements ILayoutableControlLabelTemplate {

  private readonly _propertyStore: PropertyStore;

  public constructor(propertyStore: PropertyStore) {
    this._propertyStore = propertyStore;
  }

  public getIsVisible(): boolean {
    return Boolean.falseIfNull(this._propertyStore.getIsVisible());
  }

  public getForeColor(): string {
    const foreColor: string | undefined = this._propertyStore.getForeColor();
    return foreColor != null ? foreColor : '#000000';
  }

  public getBackColor(): string {
    const backColor: string | undefined = this._propertyStore.getBackColor();
    return backColor != null ? backColor : '#FFFFFF';
  }

  public getFontFamily(): string {
    const fontFamily: string | undefined = this._propertyStore.getFontFamily();
    return fontFamily != null ? fontFamily : 'Arial';
  }

  public getFontSize(): number {
    const fontSize: number | undefined = this._propertyStore.getFontSize();
    return fontSize != null ? fontSize : 14;
  }

  public getFontBold(): boolean {
    return Boolean.falseIfNull(this._propertyStore.getFontBold());
  }

  public getFontItalic(): boolean {
    return Boolean.falseIfNull(this._propertyStore.getFontItalic());
  }

  public getFontUnderline(): boolean {
    return Boolean.falseIfNull(this._propertyStore.getFontUnderline());
  }

  public getTextAlign(): TextAlign {
    const textAlign: TextAlign | undefined = this._propertyStore.getTextAlign();
    return textAlign != null ? textAlign : TextAlign.Left;
  }

  public getMarginLeft(): number {
    return Number.zeroIfNull(this._propertyStore.getMarginLeft());
  }

  public getMarginRight(): number {
    return Number.zeroIfNull(this._propertyStore.getMarginRight());
  }

  public getMarginTop(): number {
    return Number.zeroIfNull(this._propertyStore.getMarginTop());
  }

  public getMarginBottom(): number {
    return Number.zeroIfNull(this._propertyStore.getMarginBottom());
  }

  public getPaddingLeft(): number {
    return Number.zeroIfNull(this._propertyStore.getPaddingLeft());
  }

  public getPaddingRight(): number {
    return Number.zeroIfNull(this._propertyStore.getPaddingRight());
  }

  public getPaddingTop(): number {
    return Number.zeroIfNull(this._propertyStore.getPaddingTop());
  }

  public getPaddingBottom(): number {
    return Number.zeroIfNull(this._propertyStore.getPaddingBottom());
  }

  public getMinWidth(): number {
    return Number.zeroIfNull(this._propertyStore.getMinWidth());
  }

  public getMinHeight(): number {
    return Number.zeroIfNull(this._propertyStore.getMinHeight());
  }

  public getMaxWidth(): number {
    return Number.zeroIfNull(this._propertyStore.getMaxWidth());
  }

  public getMaxHeight(): number {
    return Number.zeroIfNull(this._propertyStore.getMaxHeight());
  }
}
