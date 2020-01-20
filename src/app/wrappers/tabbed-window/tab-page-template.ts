import { PropertyStore } from 'app/common/property-store';

export class TabPageTemplate {

  private propertyStore: PropertyStore;

  constructor(propertyStore: PropertyStore) {
    this.propertyStore = propertyStore;
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

  public getBorderRadiusTopLeft(): number {
    return this.propertyStore.getBorderRadiusTopLeft();
  }
  public getBorderRadiusTopRight(): number {
    return this.propertyStore.getBorderRadiusTopRight();
  }

  public getBorderRadiusBottomLeft(): number {
    return this.propertyStore.getBorderRadiusBottomLeft();
  }

  public getBorderRadiusBottomRight(): number {
    return this.propertyStore.getBorderRadiusBottomRight();
  }

  public getBorderThicknessLeft(): number {
    return this.propertyStore.getBorderThicknessLeft();
  }

  public getBorderThicknessRight(): number {
    return this.propertyStore.getBorderThicknessRight();
  }

  public getBorderThicknessTop(): number {
    return this.propertyStore.getBorderThicknessTop();
  }

  public getBorderThicknessBottom(): number {
    return this.propertyStore.getBorderThicknessBottom();
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
}
