import { PropertyData } from './property-data';
import { PropertyLayer } from './property-layer';
import { HorizontalAlignment } from '../enums/horizontal-alignment';
import { VerticalAlignment } from '../enums/vertical-alignment';
import { HorizontalContentAlignment } from '../enums/horizontal-content-alignment';
import { VerticalContentAlignment } from '../enums/vertical-content-alignment';
import { ContentAlignment } from '../enums/content-alignment';
import { DataSourceType } from '../enums/datasource-type';
import { DockOrientation } from '../layout/dock-layout/dock-orientation';
import { TextFormat } from '../enums/text-format';
import { TextAlign } from '../enums/text-align';
import { ControlVisibility } from '../enums/control-visibility';
import { WrapArrangement } from '../layout/wrap-layout/wrap-arrangement';

export class PropertyStore {

  private store: Map<PropertyLayer, PropertyData>;

  constructor() {
    this.store = new Map<PropertyLayer, PropertyData>();
    this.store.set(PropertyLayer.ControlStyle, new PropertyData());
    this.store.set(PropertyLayer.Control, new PropertyData());
    this.store.set(PropertyLayer.Action, new PropertyData());
    this.store.set(PropertyLayer.CSC, new PropertyData());
  }

  private getValue<T>(getValueFunc: (data: PropertyData) => T): T {
    let value: T = getValueFunc(this.store.get(PropertyLayer.CSC));

    if (value === undefined) {
      value = getValueFunc(this.store.get(PropertyLayer.Action));
      if (value === undefined) {
        value = getValueFunc(this.store.get(PropertyLayer.Control));
        if (value === undefined) {
          value = getValueFunc(this.store.get(PropertyLayer.ControlStyle));
        }
      }
    }

    return value;
  }

  private getValueForLayer<T>(layer: PropertyLayer, getValueFunc: (data: PropertyData) => T): T {
    return getValueFunc(this.store.get(layer));
  }

  public setValue(layer: PropertyLayer, setValueFunc: (data: PropertyData) => void): void {
    setValueFunc(this.store.get(layer));
  }

  public setLayer(layer: PropertyLayer, data: PropertyData) {
    this.store.set(layer, data);
  }

  // MeasureText
  public getMeasureText(): string {
    return this.getValue<string>((data: PropertyData) => { return data.measureText });
  }

  public getMeasureTextForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.measureText });
  }

  public setMeasureText(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.measureText = value });
  }

  // MinWidthRaster
  public getMinWidthRaster(): number {
    return this.getValue<number>((data: PropertyData) => { return data.minWidthRaster });
  }

  public getMinWidthRasterForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.minWidthRaster });
  }

  public setMinWidthRaster(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.minWidthRaster = value });
  }

  // MaxWidthRaster
  public getMaxWidthRaster(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxWidthRaster });
  }

  public getMaxWidthRasterForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxWidthRaster });
  }

  public setMaxWidthRaster(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxWidthRaster = value });
  }

  // ForeColor
  public getForeColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.foreColor });
  }

  public getForeColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.foreColor });
  }

  public setForeColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.foreColor = value });
  }

  // BackColor
  public getBackColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.backColor });
  }

  public getBackColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.backColor });
  }

  public setBackColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.backColor = value });
  }

  // DisabledBackColor
  public getDisabledBackColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.disabledBackColor });
  }

  public getDisabledBackColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.disabledBackColor });
  }

  public setDisabledBackColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.disabledBackColor = value });
  }

  // BorderColor
  public getBorderColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.borderColor });
  }

  public getBorderColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.borderColor });
  }

  public setBorderColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.borderColor = value });
  }

  // MinWidth
  public getMinWidth(): number {
    return this.getValue<number>((data: PropertyData) => { return data.minWidth });
  }

  public getMinWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.minWidth });
  }

  public setMinWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.minWidth = value });
  }

  // MinHeight
  public getMinHeight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.minHeight });
  }

  public getMinHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.minHeight });
  }

  public setMinHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.minHeight = value });
  }

  // MaxWidth
  public getMaxWidth(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxWidth });
  }

  public getMaxWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxWidth });
  }

  public setMaxWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxWidth = value });
  }

  // MaxHeight
  public getMaxHeight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxHeight });
  }

  public getMaxHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxHeight });
  }

  public setMaxHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxHeight = value });
  }

  // DisplayMinLines
  public getDisplayMinLines(): number {
    return this.getValue<number>((data: PropertyData) => { return data.displayMinLines });
  }

  public getDisplayMinLinesForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.displayMinLines });
  }

  public setDisplayMinLines(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMinLines = value });
  }

  // DisplayMaxLines
  public getDisplayMaxLines(): number {
    return this.getValue<number>((data: PropertyData) => { return data.displayMaxLines });
  }

  public getDisplayMaxLinesForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.displayMaxLines });
  }

  public setDisplayMaxLines(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMaxLines = value });
  }

  // DisplayMinLength
  public getDisplayMinLength(): number {
    return this.getValue<number>((data: PropertyData) => { return data.displayMinLength });
  }

  public getDisplayMinLengthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.displayMinLength });
  }

  public setDisplayMinLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMinLength = value });
  }

  // DisplayMaxLength
  public getDisplayMaxLength(): number {
    return this.getValue<number>((data: PropertyData) => { return data.displayMaxLength });
  }

  public getDisplayMaxLengthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.displayMaxLength });
  }

  public setDisplayMaxLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMaxLength = value });
  }

  // MarginLeft
  public getMarginLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginLeft });
  }

  public getMarginLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginLeft });
  }

  public setMarginLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginLeft = value });
  }

  // MarginRight
  public getMarginRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginRight });
  }

  public getMarginRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginRight });
  }

  public setMarginRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginRight = value });
  }

  // MarginTop
  public getMarginTop(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginTop });
  }

  public getMarginTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginTop });
  }

  public setMarginTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginTop = value });
  }

  // MarginBottom
  public getMarginBottom(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginBottom });
  }

  public getMarginBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginBottom });
  }

  public setMarginBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginBottom = value });
  }

  // BorderRadiusTopLeft
  public getBorderRadiusTopLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderRadiusTopLeft });
  }

  public getBorderRadiusTopLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderRadiusTopLeft });
  }

  public setBorderRadiusTopLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusTopLeft = value });
  }

  // BorderRadiusTopRight
  public getBorderRadiusTopRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderRadiusTopRight });
  }

  public getBorderRadiusTopRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderRadiusTopRight });
  }

  public setBorderRadiusTopRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusTopRight = value });
  }

  // BorderRadiusBottomLeft
  public getBorderRadiusBottomLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderRadiusBottomLeft });
  }

  public getBorderRadiusBottomLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderRadiusBottomLeft });
  }

  public setBorderRadiusBottomLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusBottomLeft = value });
  }

  // BorderRadiusBottomRight
  public getBorderRadiusBottomRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderRadiusBottomRight });
  }

  public getBorderRadiusBottomRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderRadiusBottomRight });
  }

  public setBorderRadiusBottomRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusBottomRight = value });
  }

  // BorderThicknessLeft
  public getBorderThicknessLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessLeft });
  }

  public getBorderThicknessLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessLeft });
  }

  public setBorderThicknessLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessLeft = value });
  }

  // BorderThicknessRight
  public getBorderThicknessRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessRight });
  }

  public getBorderThicknessRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessRight });
  }

  public setBorderThicknessRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessRight = value });
  }

  // BorderThicknessTop
  public getBorderThicknessTop(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessTop });
  }

  public getBorderThicknessTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessTop });
  }

  public setBorderThicknessTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessTop = value });
  }

  // BorderThicknessBottom
  public getBorderThicknessBottom(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessBottom });
  }

  public getBorderThicknessBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessBottom });
  }

  public setBorderThicknessBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessBottom = value });
  }

  // PaddingLeft
  public getPaddingLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingLeft });
  }

  public getPaddingLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingLeft });
  }

  public setPaddingLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingLeft = value });
  }

  // PaddingRight
  public getPaddingRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingRight });
  }

  public getPaddingRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingRight });
  }

  public setPaddingRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingRight = value });
  }

  // PaddingTop
  public getPaddingTop(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingTop });
  }

  public getPaddingTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingTop });
  }

  public setPaddingTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingTop = value });
  }

  // PaddingBottom
  public getPaddingBottom(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingBottom });
  }

  public getPaddingBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingBottom });
  }

  public setPaddingBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingBottom = value });
  }

  // HorizontalAlignment
  public getHorizontalAlignment(): HorizontalAlignment {
    return this.getValue<HorizontalAlignment>((data: PropertyData) => { return data.alignmentHorizontal });
  }

  public getHorizontalAlignmentForLayer(layer: PropertyLayer): HorizontalAlignment {
    return this.getValueForLayer<HorizontalAlignment>(layer, (data: PropertyData) => { return data.alignmentHorizontal });
  }

  public setHorizontalAlignment(layer: PropertyLayer, value: HorizontalAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.alignmentHorizontal = value });
  }

  // VerticalAlignment
  public getVerticalAlignment(): VerticalAlignment {
    return this.getValue<VerticalAlignment>((data: PropertyData) => { return data.alignmentVertical });
  }

  public getVerticalAlignmentForLayer(layer: PropertyLayer): VerticalAlignment {
    return this.getValueForLayer<VerticalAlignment>(layer, (data: PropertyData) => { return data.alignmentVertical });
  }

  public setVerticalAlignment(layer: PropertyLayer, value: VerticalAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.alignmentVertical = value });
  }

  // HorizontalContentAlignment
  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    return this.getValue<HorizontalContentAlignment>((data: PropertyData) => { return data.horizontalContentAlignment });
  }

  public getHorizontalContentAlignmentForLayer(layer: PropertyLayer): HorizontalContentAlignment {
    return this.getValueForLayer<HorizontalContentAlignment>(layer, (data: PropertyData) => { return data.horizontalContentAlignment });
  }

  public setHorizontalContentAlignment(layer: PropertyLayer, value: HorizontalContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.horizontalContentAlignment = value });
  }

  // VerticalContentAlignment
  public getVerticalContentAlignment(): VerticalContentAlignment {
    return this.getValue<VerticalContentAlignment>((data: PropertyData) => { return data.verticalContentAlignment });
  }

  public getVerticalContentAlignmentForLayer(layer: PropertyLayer): VerticalContentAlignment {
    return this.getValueForLayer<VerticalContentAlignment>(layer, (data: PropertyData) => { return data.verticalContentAlignment });
  }

  public setVerticalContentAlignment(layer: PropertyLayer, value: VerticalContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.verticalContentAlignment = value });
  }

  // HorizontalSpacing
  public getHorizontalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => { return data.spacingHorizontal });
  }

  public getHorizontalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.spacingHorizontal });
  }

  public setHorizontalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.spacingHorizontal = value });
  }

  // VerticalSpacing
  public getVerticalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => { return data.spacingVertical });
  }

  public getVerticalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.spacingVertical });
  }

  public setVerticalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.spacingVertical = value });
  }

  // FontBold
  public getFontBold(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.fontBold });
  }

  public getFontBoldForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.fontBold });
  }

  public setFontBold(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.fontBold = value });
  }

  // FontFamily
  public getFontFamily(): string {
    return this.getValue<string>((data: PropertyData) => { return data.fontFamily });
  }

  public getFontFamilyForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.fontFamily });
  }

  public setFontFamily(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.fontFamily = value });
  }

  // FontItalic
  public getFontItalic(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.fontItalic });
  }

  public getFontItalicForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.fontItalic });
  }

  public setFontItalic(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.fontItalic = value });
  }

  // FontSize
  public getFontSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.fontSize });
  }

  public getFontSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.fontSize });
  }

  public setFontSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.fontSize = value });
  }

  // FontUnderline
  public getFontUnderline(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.fontUnderline });
  }

  public getFontUnderlineForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.fontUnderline });
  }

  public setFontUnderline(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.fontUnderline = value });
  }

  // Image
  public getImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.image });
  }

  public getImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.image });
  }

  public setImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.image = value });
  }

  // ImageBack
  public getImageBack(): string {
    return this.getValue<string>((data: PropertyData) => { return data.imageBack });
  }

  public getImageBackForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.imageBack });
  }

  public setImageBack(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.imageBack = value });
  }

  // ImageForward
  public getImageForward(): string {
    return this.getValue<string>((data: PropertyData) => { return data.imageForward });
  }

  public getImageForwardForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.imageForward });
  }

  public setImageForward(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.imageForward = value });
  }

  // InactiveImage
  public getInactiveImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.inactiveImage });
  }

  public getInactiveImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.inactiveImage });
  }

  public setInactiveImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.inactiveImage = value });
  }

  // ActiveImage
  public getActiveImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.activeImage });
  }

  public getActiveImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.activeImage });
  }

  public setActiveImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.activeImage = value });
  }

  // DisabledImage
  public getDisabledImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.disabledImage });
  }

  public getDisabledImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.disabledImage });
  }

  public setDisabledImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.disabledImage = value });
  }

  // HighlightImage
  public getHighlightImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.highlightImage });
  }

  public getHighlightImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.highlightImage });
  }

  public setHighlightImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.highlightImage = value });
  }

  // MouseOverImage
  public getMouseOverImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.mouseOverImage });
  }

  public getMouseOverImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.mouseOverImage });
  }

  public setMouseOverImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.mouseOverImage = value });
  }

  // PressedImage
  public getPressedImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.pressedImage });
  }

  public getPressedImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.pressedImage });
  }

  public setPressedImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.pressedImage = value });
  }

  // BackgroundImage
  public getBackgroundImage(): string {
    return this.getValue<string>((data: PropertyData) => { return data.backgroundImage });
  }

  public getBackgroundImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.backgroundImage });
  }

  public setBackgroundImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.backgroundImage = value });
  }

  // Caption
  public getCaption(): string {
    return this.getValue<string>((data: PropertyData) => { return data.caption });
  }

  public getCaptionForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.caption });
  }

  public setCaption(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.caption = value });
  }

  // CaptionAlign
  public getCaptionAlign(): ContentAlignment {
    return this.getValue<ContentAlignment>((data: PropertyData) => { return data.captionAlign });
  }

  public getCaptionAlignForLayer(layer: PropertyLayer): ContentAlignment {
    return this.getValueForLayer<ContentAlignment>(layer, (data: PropertyData) => { return data.captionAlign });
  }

  public setCaptionAlign(layer: PropertyLayer, value: ContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.captionAlign = value });
  }

  // DataSourceType
  public getDataSourceType(): DataSourceType {
    return this.getValue<DataSourceType>((data: PropertyData) => { return data.dataSourceTypeID });
  }

  public getDataSourceTypeForLayer(layer: PropertyLayer): DataSourceType {
    return this.getValueForLayer<DataSourceType>(layer, (data: PropertyData) => { return data.dataSourceTypeID });
  }

  public setDataSourceType(layer: PropertyLayer, value: DataSourceType): void {
    this.setValue(layer, (data: PropertyData) => { data.dataSourceTypeID = value });
  }

  // DockItemSize
  public getDockItemSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.dockPanel_ItemSize });
  }

  public getDockItemSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.dockPanel_ItemSize });
  }

  public setDockItemSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.dockPanel_ItemSize = value });
  }

  // DockOrientation
  public getDockOrientation(): DockOrientation {
    return this.getValue<DockOrientation>((data: PropertyData) => { return data.dockPanelOrientation });
  }

  public getDockOrientationForLayer(layer: PropertyLayer): DockOrientation {
    return this.getValueForLayer<DockOrientation>(layer, (data: PropertyData) => { return data.dockPanelOrientation });
  }

  public setDockOrientation(layer: PropertyLayer, value: DockOrientation): void {
    this.setValue(layer, (data: PropertyData) => { data.dockPanelOrientation = value });
  }

  // FieldRowSize
  public getFieldRowSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.fieldRowSize });
  }

  public getFieldRowSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.fieldRowSize });
  }

  public setFieldRowSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.fieldRowSize = value });
  }

  // Format
  public getFormat(): TextFormat {
    return this.getValue<TextFormat>((data: PropertyData) => { return data.format });
  }

  public getFormatForLayer(layer: PropertyLayer): TextFormat {
    return this.getValueForLayer<TextFormat>(layer, (data: PropertyData) => { return data.format });
  }

  public setFormat(layer: PropertyLayer, value: TextFormat): void {
    this.setValue(layer, (data: PropertyData) => { data.format = value });
  }

  // FormatPattern
  public getFormatPattern(): string {
    return this.getValue<string>((data: PropertyData) => { return data.formatPattern });
  }

  public getFormatPatternForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.formatPattern });
  }

  public setFormatPattern(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.formatPattern = value });
  }

  // InvertFlowDirection
  public getInvertFlowDirection(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.invertFlowDirection });
  }

  public getInvertFlowDirectionForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.invertFlowDirection });
  }

  public setInvertFlowDirection(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.invertFlowDirection = value });
  }

  // IsCloseIconVisible
  public getIsCloseIconVisible(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.isCloseIconVisible });
  }

  public getIsCloseIconVisibleForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.isCloseIconVisible });
  }

  public setIsCloseIconVisible(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isCloseIconVisible = value });
  }

  // IsEditable
  public getIsEditable(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.isEditable });
  }

  public getIsEditableForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.isEditable });
  }

  public setIsEditable(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isEditable = value });
  }

  // IsEnabled
  public getIsEnabled(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.isEnabled });
  }

  public getIsEnabledForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.isEnabled });
  }

  public setIsEnabled(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isEnabled = value });
  }

  // MaxSize
  public getMaxSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxSize });
  }

  public getMaxSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxSize });
  }

  public setMaxSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxSize = value });
  }

  // MaxScale
  public getMaxScale(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxScale });
  }

  public getMaxScaleForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxScale });
  }

  public setMaxScale(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxScale = value });
  }

  // IsMultiline
  public getIsMultiline(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.multiline });
  }

  public getIsMultilineForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.multiline });
  }

  public setIsMultiline(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.multiline = value });
  }

  // MaxPrec
  public getMaxPrec(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxPrec });
  }

  public getMaxPrecForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxPrec });
  }

  public setMaxPrec(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxPrec = value });
  }

  // ShowCaption
  public getShowCaption(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.showCaption });
  }

  public getShowCaptionForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.showCaption });
  }

  public setShowCaption(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.showCaption = value });
  }

  // TabStop
  public getTabStop(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.tabStop });
  }

  public getTabStopForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.tabStop });
  }

  public setTabStop(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.tabStop = value });
  }

  // TextAlign
  public getTextAlign(): TextAlign {
    return this.getValue<TextAlign>((data: PropertyData) => { return data.textAlign });
  }

  public getTextAlignForLayer(layer: PropertyLayer): TextAlign {
    return this.getValueForLayer<TextAlign>(layer, (data: PropertyData) => { return data.textAlign });
  }

  public setTextAlign(layer: PropertyLayer, value: TextAlign): void {
    this.setValue(layer, (data: PropertyData) => { data.textAlign = value });
  }

  // Title
  public getTitle(): string {
    return this.getValue<string>((data: PropertyData) => { return data.title });
  }

  public getTitleForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.title });
  }

  public setTitle(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.title = value });
  }

  // Visibility
  public getVisibility(): ControlVisibility {
    return this.getValue<ControlVisibility>((data: PropertyData) => { return data.visibility });
  }

  public getVisibilityForLayer(layer: PropertyLayer): ControlVisibility {
    return this.getValueForLayer<ControlVisibility>(layer, (data: PropertyData) => { return data.visibility });
  }

  public setVisibility(layer: PropertyLayer, value: ControlVisibility): void {
    this.setValue(layer, (data: PropertyData) => { data.visibility = value });
  }

  // WrapArrangement
  public getWrapArrangement(): WrapArrangement {
    return this.getValue<WrapArrangement>((data: PropertyData) => { return data.wrapArrangement });
  }

  public getWrapArrangementForLayer(layer: PropertyLayer): WrapArrangement {
    return this.getValueForLayer<WrapArrangement>(layer, (data: PropertyData) => { return data.wrapArrangement });
  }

  public setWrapArrangement(layer: PropertyLayer, value: WrapArrangement): void {
    this.setValue(layer, (data: PropertyData) => { data.wrapArrangement = value });
  }
}
