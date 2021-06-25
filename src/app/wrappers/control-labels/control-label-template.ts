import { PropertyStore } from '@app/common/property-store';
import { TextAlign } from '@app/enums/text-align';
import { ILayoutableControlLabelTemplate } from '@app/layout/layoutable-control-label-template.interface';

export class ControlLabelTemplate implements ILayoutableControlLabelTemplate {

  private readonly _propertyStore: PropertyStore;

  public constructor(propertyStore: PropertyStore) {
    this._propertyStore = propertyStore;
  }

  public getIsVisible(): boolean {
    return this._propertyStore.getIsVisible();
  }

  public getForeColor(): string {
    return this._propertyStore.getForeColor();
  }

  public getBackColor(): string {
    return this._propertyStore.getBackColor();
  }

  public getFontFamily(): string {
    return this._propertyStore.getFontFamily();
  }

  public getFontSize(): number {
    return this._propertyStore.getFontSize();
  }

  public getFontBold(): boolean {
    return this._propertyStore.getFontBold();
  }

  public getFontItalic(): boolean {
    return this._propertyStore.getFontItalic();
  }

  public getFontUnderline(): boolean {
    return this._propertyStore.getFontUnderline();
  }

  public getTextAlign(): TextAlign {
    return this._propertyStore.getTextAlign();
  }

  public getMarginLeft(): number {
    return this._propertyStore.getMarginLeft();
  }

  public getMarginRight(): number {
    return this._propertyStore.getMarginRight();
  }

  public getMarginTop(): number {
    return this._propertyStore.getMarginTop();
  }

  public getMarginBottom(): number {
    return this._propertyStore.getMarginBottom();
  }

  public getPaddingLeft(): number {
    return this._propertyStore.getPaddingLeft();
  }

  public getPaddingRight(): number {
    return this._propertyStore.getPaddingRight();
  }

  public getPaddingTop(): number {
    return this._propertyStore.getPaddingTop();
  }

  public getPaddingBottom(): number {
    return this._propertyStore.getPaddingBottom();
  }

  public getMinWidth(): number {
    return this._propertyStore.getMinWidth();
  }

  public getMinHeight(): number {
    return this._propertyStore.getMinHeight();
  }

  public getMaxWidth(): number {
    return this._propertyStore.getMaxWidth();
  }

  public getMaxHeight(): number {
    return this._propertyStore.getMaxHeight();
  }
}
