import { PropertyStore } from '@app/common/property-store';
import { FontService } from '@app/services/font.service';

export class TabPageTemplate {

  private readonly _propertyStore: PropertyStore;
  private readonly _fontService: FontService;

  public constructor(propertyStore: PropertyStore, fontService: FontService) {
    this._propertyStore = propertyStore;
    this._fontService = fontService;
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

  public getLineHeight(): number {
    return this._fontService.measureTextHeight(this.getFontFamily(), this.getFontSize());
  }

  public getBorderColor(): string {
    const borderColor: string | undefined = this._propertyStore.getBorderColor();
    return borderColor != null ? borderColor : '#808080';
  }

  public getBorderRadiusTopLeft(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderRadiusTopLeft());
  }

  public getBorderRadiusTopRight(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderRadiusTopRight());
  }

  public getBorderRadiusBottomLeft(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderRadiusBottomLeft());
  }

  public getBorderRadiusBottomRight(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderRadiusBottomRight());
  }

  public getBorderThicknessLeft(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderThicknessLeft());
  }

  public getBorderThicknessRight(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderThicknessRight());
  }

  public getBorderThicknessTop(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderThicknessTop());
  }

  public getBorderThicknessBottom(): number {
    return Number.zeroIfNull(this._propertyStore.getBorderThicknessBottom());
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
}
