import { PropertyStore } from '@app/common/property-store';
import { TextAlign } from '@app/enums/text-align';
import { ILayoutableControlLabelTemplate } from '@app/layout/layoutable-control-label-template.interface';

export class ControlLabelTemplate implements ILayoutableControlLabelTemplate {

  private readonly propertyStore: PropertyStore;

  public constructor(propertyStore: PropertyStore) {
    this.propertyStore = propertyStore;
  }

  public getIsVisible(): boolean {
    return this.propertyStore.getIsVisible();
  }

  public getForeColor(): string {
    return this.propertyStore.getForeColor();
  }

  public getBackColor(): string {
    return this.propertyStore.getBackColor();
  }

  public getFontFamily(): string {
    return this.propertyStore.getFontFamily();
  }

  public getFontSize(): number {
    return this.propertyStore.getFontSize();
  }

  public getFontBold(): boolean {
    return this.propertyStore.getFontBold();
  }

  public getFontItalic(): boolean {
    return this.propertyStore.getFontItalic();
  }

  public getFontUnderline(): boolean {
    return this.propertyStore.getFontUnderline();
  }

  public getTextAlign(): TextAlign {
    return this.propertyStore.getTextAlign();
  }

  public getMarginLeft(): number {
    return this.propertyStore.getMarginLeft();
  }

  public getMarginRight(): number {
    return this.propertyStore.getMarginRight();
  }

  public getMarginTop(): number {
    return this.propertyStore.getMarginTop();
  }

  public getMarginBottom(): number {
    return this.propertyStore.getMarginBottom();
  }

  public getPaddingLeft(): number {
    return this.propertyStore.getPaddingLeft();
  }

  public getPaddingRight(): number {
    return this.propertyStore.getPaddingRight();
  }

  public getPaddingTop(): number {
    return this.propertyStore.getPaddingTop();
  }

  public getPaddingBottom(): number {
    return this.propertyStore.getPaddingBottom();
  }

  public getMinWidth(): number {
    return this.propertyStore.getMinWidth();
  }

  public getMinHeight(): number {
    return this.propertyStore.getMinHeight();
  }

  public getMaxWidth(): number {
    return this.propertyStore.getMaxWidth();
  }

  public getMaxHeight(): number {
    return this.propertyStore.getMaxHeight();
  }
}
