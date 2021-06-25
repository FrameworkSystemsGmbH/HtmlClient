import { PropertyStore } from '@app/common/property-store';
import { FontService } from '@app/services/font.service';

export class TabPageTemplate {

  private readonly propertyStore: PropertyStore;
  private readonly fontService: FontService;

  public constructor(propertyStore: PropertyStore, fontService: FontService) {
    this.propertyStore = propertyStore;
    this.fontService = fontService;
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

  public getLineHeight(): number {
    return this.fontService.measureTextHeight(this.getFontFamily(), this.getFontSize());
  }

  public getBorderColor(): string {
    const borderColor: string = this.propertyStore.getBorderColor();
    return borderColor != null ? borderColor : '#808080';
  }

  public getBorderRadiusTopLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusTopLeft());
  }

  public getBorderRadiusTopRight(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusTopRight());
  }

  public getBorderRadiusBottomLeft(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusBottomLeft());
  }

  public getBorderRadiusBottomRight(): number {
    return Number.zeroIfNull(this.propertyStore.getBorderRadiusBottomRight());
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
}
