import { PropertyData } from 'app/common/property-data';
import { PropertyLayer } from 'app/common/property-layer';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { HorizontalContentAlignment } from 'app/enums/horizontal-content-alignment';
import { VerticalContentAlignment } from 'app/enums/vertical-content-alignment';
import { ContentAlignment } from 'app/enums/content-alignment';
import { DataSourceType } from 'app/enums/datasource-type';
import { DockOrientation } from 'app/layout/dock-layout/dock-orientation';
import { EditStyle } from 'app/enums/edit-style';
import { TextFormat } from 'app/enums/text-format';
import { TextAlign } from 'app/enums/text-align';
import { ScrollBars } from 'app/enums/scrollbars';
import { Visibility } from 'app/enums/visibility';
import { WrapArrangement } from 'app/layout/wrap-layout/wrap-arrangement';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { ListViewSelectionMode } from 'app/enums/listview-selection-mode';
import { ListViewItemArrangement } from 'app/enums/listview-item-arrangement';
import { JsonUtil } from 'app/util/json-util';

const DEFAULT_FONT: string = 'Roboto, Arial, Helvetica, Verdana';

export class PropertyStore {

  private store: Map<PropertyLayer, PropertyData>;

  constructor() {
    this.store = new Map<PropertyLayer, PropertyData>();
    this.store.set(PropertyLayer.ControlStyle, new PropertyData());
    this.store.set(PropertyLayer.Control, new PropertyData());
    this.store.set(PropertyLayer.Action, new PropertyData());
    this.store.set(PropertyLayer.CSC, new PropertyData());
  }

  // Layer
  public getLayer(layer: PropertyLayer): PropertyData {
    return this.store.get(layer);
  }

  public setLayer(layer: PropertyLayer, data: PropertyData) {
    this.store.set(layer, data);
  }

  // Get Property as new PropertyStore
  public getPropertyStore(getFromPropertyFunc: (data: PropertyData) => PropertyData): PropertyStore {
    const propertyLayerControlStyle: PropertyData = getFromPropertyFunc(this.store.get(PropertyLayer.ControlStyle));
    const propertyLayerControl: PropertyData = getFromPropertyFunc(this.store.get(PropertyLayer.Control));
    const propertyLayerAction: PropertyData = getFromPropertyFunc(this.store.get(PropertyLayer.Action));
    const propertyLayerCSC: PropertyData = getFromPropertyFunc(this.store.get(PropertyLayer.CSC));

    const propertyStore: PropertyStore = new PropertyStore();
    propertyStore.setLayer(PropertyLayer.ControlStyle, propertyLayerControlStyle ? propertyLayerControlStyle : new PropertyData());
    propertyStore.setLayer(PropertyLayer.Control, propertyLayerControl ? propertyLayerControl : new PropertyData());
    propertyStore.setLayer(PropertyLayer.Action, propertyLayerAction ? propertyLayerAction : new PropertyData());
    propertyStore.setLayer(PropertyLayer.CSC, propertyLayerCSC ? propertyLayerCSC : new PropertyData());

    return propertyStore;
  }

  // Get|Set Value
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

  // Serialization
  public getState(): any {
    const csc: any = this.getLayer(PropertyLayer.CSC);
    const action: any = this.getLayer(PropertyLayer.Action);
    const control: any = this.getLayer(PropertyLayer.Control);

    const json: any = {};

    if (!JsonUtil.isEmptyObject(csc)) {
      json.csc = csc;
    }

    if (!JsonUtil.isEmptyObject(action)) {
      json.action = action;
    }

    if (!JsonUtil.isEmptyObject(control)) {
      json.control = control;
    }

    return json;
  }

  public setState(json: any): void {
    if (!json) {
      return;
    }

    if (json.control) {
      this.setLayer(PropertyLayer.Control, json.control);
    }

    if (json.action) {
      this.setLayer(PropertyLayer.Action, json.action);
    }

    if (json.csc) {
      this.setLayer(PropertyLayer.CSC, json.csc);
    }
  }

  // MeasureText
  public getMeasureText(): string {
    return this.getValue<string>((data: PropertyData) => data.measureText);
  }

  public getMeasureTextForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.measureText);
  }

  public setMeasureText(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.measureText = value; });
  }

  // MinWidthRaster
  public getMinWidthRaster(): number {
    return this.getValue<number>((data: PropertyData) => data.minWidthRaster);
  }

  public getMinWidthRasterForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.minWidthRaster);
  }

  public setMinWidthRaster(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.minWidthRaster = value; });
  }

  // MaxWidthRaster
  public getMaxWidthRaster(): number {
    return this.getValue<number>((data: PropertyData) => data.maxWidthRaster);
  }

  public getMaxWidthRasterForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxWidthRaster);
  }

  public setMaxWidthRaster(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxWidthRaster = value; });
  }

  // ForeColor
  public getForeColor(): string {
    return this.getValue<string>((data: PropertyData) => data.foreColor);
  }

  public getForeColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.foreColor);
  }

  public setForeColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.foreColor = value; });
  }

  // BackColor
  public getBackColor(): string {
    return this.getValue<string>((data: PropertyData) => data.backColor);
  }

  public getBackColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.backColor);
  }

  public setBackColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.backColor = value; });
  }

  // DisabledBackColor
  public getDisabledBackColor(): string {
    return this.getValue<string>((data: PropertyData) => data.disabledBackColor);
  }

  public getDisabledBackColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.disabledBackColor);
  }

  public setDisabledBackColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.disabledBackColor = value; });
  }

  // BorderColor
  public getBorderColor(): string {
    return this.getValue<string>((data: PropertyData) => data.borderColor);
  }

  public getBorderColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.borderColor);
  }

  public setBorderColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.borderColor = value; });
  }

  // MinWidth
  public getMinWidth(): number {
    return this.getValue<number>((data: PropertyData) => data.minWidth);
  }

  public getMinWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.minWidth);
  }

  public setMinWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.minWidth = value; });
  }

  // MinHeight
  public getMinHeight(): number {
    return this.getValue<number>((data: PropertyData) => data.minHeight);
  }

  public getMinHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.minHeight);
  }

  public setMinHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.minHeight = value; });
  }

  // MaxWidth
  public getMaxWidth(): number {
    return this.getValue<number>((data: PropertyData) => data.maxWidth);
  }

  public getMaxWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxWidth);
  }

  public setMaxWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxWidth = value; });
  }

  // MaxHeight
  public getMaxHeight(): number {
    return this.getValue<number>((data: PropertyData) => data.maxHeight);
  }

  public getMaxHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxHeight);
  }

  public setMaxHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxHeight = value; });
  }

  // DisplayMinLines
  public getDisplayMinLines(): number {
    return this.getValue<number>((data: PropertyData) => data.displayMinLines);
  }

  public getDisplayMinLinesForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.displayMinLines);
  }

  public setDisplayMinLines(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMinLines = value; });
  }

  // DisplayMaxLines
  public getDisplayMaxLines(): number {
    return this.getValue<number>((data: PropertyData) => data.displayMaxLines);
  }

  public getDisplayMaxLinesForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.displayMaxLines);
  }

  public setDisplayMaxLines(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMaxLines = value; });
  }

  // DisplayMinLength
  public getDisplayMinLength(): number {
    return this.getValue<number>((data: PropertyData) => data.displayMinLength);
  }

  public getDisplayMinLengthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.displayMinLength);
  }

  public setDisplayMinLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMinLength = value; });
  }

  // DisplayMaxLength
  public getDisplayMaxLength(): number {
    return this.getValue<number>((data: PropertyData) => data.displayMaxLength);
  }

  public getDisplayMaxLengthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.displayMaxLength);
  }

  public setDisplayMaxLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.displayMaxLength = value; });
  }

  // MarginLeft
  public getMarginLeft(): number {
    return this.getValue<number>((data: PropertyData) => data.marginLeft);
  }

  public getMarginLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.marginLeft);
  }

  public setMarginLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginLeft = value; });
  }

  // MarginRight
  public getMarginRight(): number {
    return this.getValue<number>((data: PropertyData) => data.marginRight);
  }

  public getMarginRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.marginRight);
  }

  public setMarginRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginRight = value; });
  }

  // MarginTop
  public getMarginTop(): number {
    return this.getValue<number>((data: PropertyData) => data.marginTop);
  }

  public getMarginTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.marginTop);
  }

  public setMarginTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginTop = value; });
  }

  // MarginBottom
  public getMarginBottom(): number {
    return this.getValue<number>((data: PropertyData) => data.marginBottom);
  }

  public getMarginBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.marginBottom);
  }

  public setMarginBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.marginBottom = value; });
  }

  // BorderRadiusTopLeft
  public getBorderRadiusTopLeft(): number {
    return this.getValue<number>((data: PropertyData) => data.borderRadiusTopLeft);
  }

  public getBorderRadiusTopLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderRadiusTopLeft);
  }

  public setBorderRadiusTopLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusTopLeft = value; });
  }

  // BorderRadiusTopRight
  public getBorderRadiusTopRight(): number {
    return this.getValue<number>((data: PropertyData) => data.borderRadiusTopRight);
  }

  public getBorderRadiusTopRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderRadiusTopRight);
  }

  public setBorderRadiusTopRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusTopRight = value; });
  }

  // BorderRadiusBottomLeft
  public getBorderRadiusBottomLeft(): number {
    return this.getValue<number>((data: PropertyData) => data.borderRadiusBottomLeft);
  }

  public getBorderRadiusBottomLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderRadiusBottomLeft);
  }

  public setBorderRadiusBottomLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusBottomLeft = value; });
  }

  // BorderRadiusBottomRight
  public getBorderRadiusBottomRight(): number {
    return this.getValue<number>((data: PropertyData) => data.borderRadiusBottomRight);
  }

  public getBorderRadiusBottomRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderRadiusBottomRight);
  }

  public setBorderRadiusBottomRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderRadiusBottomRight = value; });
  }

  // BorderThicknessLeft
  public getBorderThicknessLeft(): number {
    return this.getValue<number>((data: PropertyData) => data.borderThicknessLeft);
  }

  public getBorderThicknessLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderThicknessLeft);
  }

  public setBorderThicknessLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessLeft = value; });
  }

  // BorderThicknessRight
  public getBorderThicknessRight(): number {
    return this.getValue<number>((data: PropertyData) => data.borderThicknessRight);
  }

  public getBorderThicknessRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderThicknessRight);
  }

  public setBorderThicknessRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessRight = value; });
  }

  // BorderThicknessTop
  public getBorderThicknessTop(): number {
    return this.getValue<number>((data: PropertyData) => data.borderThicknessTop);
  }

  public getBorderThicknessTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderThicknessTop);
  }

  public setBorderThicknessTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessTop = value; });
  }

  // BorderThicknessBottom
  public getBorderThicknessBottom(): number {
    return this.getValue<number>((data: PropertyData) => data.borderThicknessBottom);
  }

  public getBorderThicknessBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.borderThicknessBottom);
  }

  public setBorderThicknessBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.borderThicknessBottom = value; });
  }

  // PaddingLeft
  public getPaddingLeft(): number {
    return this.getValue<number>((data: PropertyData) => data.paddingLeft);
  }

  public getPaddingLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.paddingLeft);
  }

  public setPaddingLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingLeft = value; });
  }

  // PaddingRight
  public getPaddingRight(): number {
    return this.getValue<number>((data: PropertyData) => data.paddingRight);
  }

  public getPaddingRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.paddingRight);
  }

  public setPaddingRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingRight = value; });
  }

  // PaddingTop
  public getPaddingTop(): number {
    return this.getValue<number>((data: PropertyData) => data.paddingTop);
  }

  public getPaddingTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.paddingTop);
  }

  public setPaddingTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingTop = value; });
  }

  // PaddingBottom
  public getPaddingBottom(): number {
    return this.getValue<number>((data: PropertyData) => data.paddingBottom);
  }

  public getPaddingBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.paddingBottom);
  }

  public setPaddingBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.paddingBottom = value; });
  }

  // HorizontalAlignment
  public getHorizontalAlignment(): HorizontalAlignment {
    return this.getValue<HorizontalAlignment>((data: PropertyData) => data.alignmentHorizontal);
  }

  public getHorizontalAlignmentForLayer(layer: PropertyLayer): HorizontalAlignment {
    return this.getValueForLayer<HorizontalAlignment>(layer, (data: PropertyData) => data.alignmentHorizontal);
  }

  public setHorizontalAlignment(layer: PropertyLayer, value: HorizontalAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.alignmentHorizontal = value; });
  }

  // VerticalAlignment
  public getVerticalAlignment(): VerticalAlignment {
    return this.getValue<VerticalAlignment>((data: PropertyData) => data.alignmentVertical);
  }

  public getVerticalAlignmentForLayer(layer: PropertyLayer): VerticalAlignment {
    return this.getValueForLayer<VerticalAlignment>(layer, (data: PropertyData) => data.alignmentVertical);
  }

  public setVerticalAlignment(layer: PropertyLayer, value: VerticalAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.alignmentVertical = value; });
  }

  // HorizontalContentAlignment
  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    return this.getValue<HorizontalContentAlignment>((data: PropertyData) => data.horizontalContentAlignment);
  }

  public getHorizontalContentAlignmentForLayer(layer: PropertyLayer): HorizontalContentAlignment {
    return this.getValueForLayer<HorizontalContentAlignment>(layer, (data: PropertyData) => data.horizontalContentAlignment);
  }

  public setHorizontalContentAlignment(layer: PropertyLayer, value: HorizontalContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.horizontalContentAlignment = value; });
  }

  // VerticalContentAlignment
  public getVerticalContentAlignment(): VerticalContentAlignment {
    return this.getValue<VerticalContentAlignment>((data: PropertyData) => data.verticalContentAlignment);
  }

  public getVerticalContentAlignmentForLayer(layer: PropertyLayer): VerticalContentAlignment {
    return this.getValueForLayer<VerticalContentAlignment>(layer, (data: PropertyData) => data.verticalContentAlignment);
  }

  public setVerticalContentAlignment(layer: PropertyLayer, value: VerticalContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.verticalContentAlignment = value; });
  }

  // HorizontalSpacing
  public getHorizontalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => data.spacingHorizontal);
  }

  public getHorizontalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.spacingHorizontal);
  }

  public setHorizontalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.spacingHorizontal = value; });
  }

  // VerticalSpacing
  public getVerticalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => data.spacingVertical);
  }

  public getVerticalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.spacingVertical);
  }

  public setVerticalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.spacingVertical = value; });
  }

  // FontBold
  public getFontBold(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.fontBold);
  }

  public getFontBoldForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.fontBold);
  }

  public setFontBold(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.fontBold = value; });
  }

  // FontFamily
  public getFontFamily(): string {
    return this.getValue<string>((data: PropertyData) => DEFAULT_FONT);
  }

  public getFontFamilyForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => DEFAULT_FONT);
  }

  public setFontFamily(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.fontFamily = value; });
  }

  // FontItalic
  public getFontItalic(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.fontItalic);
  }

  public getFontItalicForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.fontItalic);
  }

  public setFontItalic(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.fontItalic = value; });
  }

  // FontSize
  public getFontSize(): number {
    return this.getValue<number>((data: PropertyData) => data.fontSize);
  }

  public getFontSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.fontSize);
  }

  public setFontSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.fontSize = value; });
  }

  // FontUnderline
  public getFontUnderline(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.fontUnderline);
  }

  public getFontUnderlineForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.fontUnderline);
  }

  public setFontUnderline(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.fontUnderline = value; });
  }

  // Image
  public getImage(): string {
    return this.getValue<string>((data: PropertyData) => data.image);
  }

  public getImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.image);
  }

  public setImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.image = value; });
  }

  // ImageBack
  public getImageBack(): string {
    return this.getValue<string>((data: PropertyData) => data.imageBack);
  }

  public getImageBackForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.imageBack);
  }

  public setImageBack(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.imageBack = value; });
  }

  // ImageForward
  public getImageForward(): string {
    return this.getValue<string>((data: PropertyData) => data.imageForward);
  }

  public getImageForwardForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.imageForward);
  }

  public setImageForward(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.imageForward = value; });
  }

  // InactiveImage
  public getInactiveImage(): string {
    return this.getValue<string>((data: PropertyData) => data.inactiveImage);
  }

  public getInactiveImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.inactiveImage);
  }

  public setInactiveImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.inactiveImage = value; });
  }

  // ActiveImage
  public getActiveImage(): string {
    return this.getValue<string>((data: PropertyData) => data.activeImage);
  }

  public getActiveImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.activeImage);
  }

  public setActiveImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.activeImage = value; });
  }

  // DisabledImage
  public getDisabledImage(): string {
    return this.getValue<string>((data: PropertyData) => data.disabledImage);
  }

  public getDisabledImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.disabledImage);
  }

  public setDisabledImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.disabledImage = value; });
  }

  // HighlightImage
  public getHighlightImage(): string {
    return this.getValue<string>((data: PropertyData) => data.highlightImage);
  }

  public getHighlightImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.highlightImage);
  }

  public setHighlightImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.highlightImage = value; });
  }

  // MouseOverImage
  public getMouseOverImage(): string {
    return this.getValue<string>((data: PropertyData) => data.mouseOverImage);
  }

  public getMouseOverImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.mouseOverImage);
  }

  public setMouseOverImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.mouseOverImage = value; });
  }

  // PressedImage
  public getPressedImage(): string {
    return this.getValue<string>((data: PropertyData) => data.pressedImage);
  }

  public getPressedImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.pressedImage);
  }

  public setPressedImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.pressedImage = value; });
  }

  // BackgroundImage
  public getBackgroundImage(): string {
    return this.getValue<string>((data: PropertyData) => data.backgroundImage);
  }

  public getBackgroundImageForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.backgroundImage);
  }

  public setBackgroundImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.backgroundImage = value; });
  }

  // Caption
  public getCaption(): string {
    return this.getValue<string>((data: PropertyData) => data.caption);
  }

  public getCaptionForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.caption);
  }

  public setCaption(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.caption = value; });
  }

  // CaptionAlign
  public getCaptionAlign(): ContentAlignment {
    return this.getValue<ContentAlignment>((data: PropertyData) => data.captionAlign);
  }

  public getCaptionAlignForLayer(layer: PropertyLayer): ContentAlignment {
    return this.getValueForLayer<ContentAlignment>(layer, (data: PropertyData) => data.captionAlign);
  }

  public setCaptionAlign(layer: PropertyLayer, value: ContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => { data.captionAlign = value; });
  }

  // DatasourceOnValue
  public getDatasourceOnValue(): string {
    return this.getValue<string>((data: PropertyData) => data.datasourceOnValue);
  }

  public getDatasourceOnValueForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.datasourceOnValue);
  }

  public setDatasourceOnValue(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.datasourceOnValue = value; });
  }

  // DataSourceType
  public getDataSourceType(): DataSourceType {
    return this.getValue<DataSourceType>((data: PropertyData) => data.dataSourceTypeID);
  }

  public getDataSourceTypeForLayer(layer: PropertyLayer): DataSourceType {
    return this.getValueForLayer<DataSourceType>(layer, (data: PropertyData) => data.dataSourceTypeID);
  }

  public setDataSourceType(layer: PropertyLayer, value: DataSourceType): void {
    this.setValue(layer, (data: PropertyData) => { data.dataSourceTypeID = value; });
  }

  // DockItemSize
  public getDockItemSize(): number {
    return this.getValue<number>((data: PropertyData) => data.dockPanel_ItemSize);
  }

  public getDockItemSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.dockPanel_ItemSize);
  }

  public setDockItemSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.dockPanel_ItemSize = value; });
  }

  // DockOrientation
  public getDockOrientation(): DockOrientation {
    return this.getValue<DockOrientation>((data: PropertyData) => data.dockPanelOrientation);
  }

  public getDockOrientationForLayer(layer: PropertyLayer): DockOrientation {
    return this.getValueForLayer<DockOrientation>(layer, (data: PropertyData) => data.dockPanelOrientation);
  }

  public setDockOrientation(layer: PropertyLayer, value: DockOrientation): void {
    this.setValue(layer, (data: PropertyData) => { data.dockPanelOrientation = value; });
  }

  // EditStyle
  public getEditStyle(): EditStyle {
    return this.getValue<EditStyle>((data: PropertyData) => data.editStyle);
  }

  public getEditStyleForLayer(layer: PropertyLayer): EditStyle {
    return this.getValueForLayer<EditStyle>(layer, (data: PropertyData) => data.editStyle);
  }

  public setEditStyle(layer: PropertyLayer, value: EditStyle): void {
    this.setValue(layer, (data: PropertyData) => { data.editStyle = value; });
  }

  // FieldRowSize
  public getFieldRowSize(): number {
    return this.getValue<number>((data: PropertyData) => data.fieldRowSize);
  }

  public getFieldRowSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.fieldRowSize);
  }

  public setFieldRowSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.fieldRowSize = value; });
  }

  // Format
  public getFormat(): TextFormat {
    return this.getValue<TextFormat>((data: PropertyData) => data.format);
  }

  public getFormatForLayer(layer: PropertyLayer): TextFormat {
    return this.getValueForLayer<TextFormat>(layer, (data: PropertyData) => data.format);
  }

  public setFormat(layer: PropertyLayer, value: TextFormat): void {
    this.setValue(layer, (data: PropertyData) => { data.format = value; });
  }

  // FormatPattern
  public getFormatPattern(): string {
    return this.getValue<string>((data: PropertyData) => data.formatPattern);
  }

  public getFormatPatternForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.formatPattern);
  }

  public setFormatPattern(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.formatPattern = value; });
  }

  // InvertFlowDirection
  public getInvertFlowDirection(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.invertFlowDirection);
  }

  public getInvertFlowDirectionForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.invertFlowDirection);
  }

  public setInvertFlowDirection(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.invertFlowDirection = value; });
  }

  // ItemArrangement
  public getItemArrangement(): ListViewItemArrangement {
    return this.getValue<ListViewItemArrangement>((data: PropertyData) => data.itemArrangement);
  }

  public getListViewItemArrangementForLayer(layer: PropertyLayer): ListViewItemArrangement {
    return this.getValueForLayer<ListViewItemArrangement>(layer, (data: PropertyData) => data.itemArrangement);
  }

  public setListViewItemArrangement(layer: PropertyLayer, value: ListViewItemArrangement): void {
    this.setValue(layer, (data: PropertyData) => { data.itemArrangement = value; });
  }

  // ItemMinWidth
  public getItemMinWidth(): number {
    return this.getValue<number>((data: PropertyData) => data.itemMinWidth);
  }

  public getItemMinWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.itemMinWidth);
  }

  public setItemMinWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.itemMinWidth = value; });
  }

  // ItemMinHeight
  public getItemMinHeight(): number {
    return this.getValue<number>((data: PropertyData) => data.itemMinHeight);
  }

  public getItemMinHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.itemMinHeight);
  }

  public setItemMinHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.itemMinHeight = value; });
  }

  // IsCloseIconVisible
  public getIsCloseIconVisible(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.isCloseIconVisible);
  }

  public getIsCloseIconVisibleForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.isCloseIconVisible);
  }

  public setIsCloseIconVisible(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isCloseIconVisible = value; });
  }

  // IsEditable
  public getIsEditable(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.isEditable);
  }

  public getIsEditableForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.isEditable);
  }

  public setIsEditable(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isEditable = value; });
  }

  // IsEnabled
  public getIsEnabled(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.isEnabled);
  }

  public getIsEnabledForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.isEnabled);
  }

  public setIsEnabled(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isEnabled = value; });
  }

  // LabelMode
  public getLabelMode(): FieldRowLabelMode {
    return this.getValue<FieldRowLabelMode>((data: PropertyData) => data.labelMode);
  }

  public getLabelModeForLayer(layer: PropertyLayer): FieldRowLabelMode {
    return this.getValueForLayer<FieldRowLabelMode>(layer, (data: PropertyData) => data.labelMode);
  }

  public setLabelMode(layer: PropertyLayer, value: FieldRowLabelMode): void {
    this.setValue(layer, (data: PropertyData) => { data.labelMode = value; });
  }

  // ListDisplayMinLength
  public getListDisplayMinLength(): number {
    return this.getValue<number>((data: PropertyData) => data.listDisplayMinLength);
  }

  public getListDisplayMinLengthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.listDisplayMinLength);
  }

  public setListDisplayMinLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.listDisplayMinLength = value; });
  }

  // ListDisplayMaxLength
  public getListDisplayMaxLength(): number {
    return this.getValue<number>((data: PropertyData) => data.listDisplayMaxLength);
  }

  public ListDisplayMaxLengthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.listDisplayMaxLength);
  }

  public setListDisplayMaxLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.listDisplayMaxLength = value; });
  }

  // ListType
  public getListType(): DataSourceType {
    return this.getValue<DataSourceType>((data: PropertyData) => data.listType);
  }

  public getListTypeForLayer(layer: PropertyLayer): DataSourceType {
    return this.getValueForLayer<DataSourceType>(layer, (data: PropertyData) => data.listType);
  }

  public setListType(layer: PropertyLayer, value: DataSourceType): void {
    this.setValue(layer, (data: PropertyData) => { data.listType = value; });
  }

  // MapEnterToTab
  public getMapEnterToTab(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.mapEnterToTab);
  }

  public getMapEnterToTabForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.mapEnterToTab);
  }

  public setMapEnterToTab(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.mapEnterToTab = value; });
  }

  // MaxDropDownWidth
  public getMaxDropDownWidth(): number {
    return this.getValue<number>((data: PropertyData) => data.maxDropDownWidth);
  }

  public getMaxDropDownWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxDropDownWidth);
  }

  public setMaxDropDownWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxDropDownWidth = value; });
  }

  // MaxDropDownHeight
  public getMaxDropDownHeight(): number {
    return this.getValue<number>((data: PropertyData) => data.maxDropDownHeight);
  }

  public getMaxDropDownHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxDropDownHeight);
  }

  public setMaxDropDownHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxDropDownHeight = value; });
  }

  // MaxSize
  public getMaxSize(): number {
    return this.getValue<number>((data: PropertyData) => data.maxSize);
  }

  public getMaxSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxSize);
  }

  public setMaxSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxSize = value; });
  }

  // MaxScale
  public getMaxScale(): number {
    return this.getValue<number>((data: PropertyData) => data.maxScale);
  }

  public getMaxScaleForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxScale);
  }

  public setMaxScale(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxScale = value; });
  }

  // IsMultiline
  public getIsMultiline(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.multiline);
  }

  public getIsMultilineForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.multiline);
  }

  public setIsMultiline(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.multiline = value; });
  }

  // MaxPrec
  public getMaxPrec(): number {
    return this.getValue<number>((data: PropertyData) => data.maxPrec);
  }

  public getMaxPrecForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => data.maxPrec);
  }

  public setMaxPrec(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => { data.maxPrec = value; });
  }

  // PasswordChar
  public getPasswordChar(): string {
    return this.getValue<string>((data: PropertyData) => data.passwordChar);
  }

  public getPasswordCharForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.passwordChar);
  }

  public setPasswordChar(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.passwordChar = value; });
  }

  // OptimizeGeneratedLabels
  public getOptimizeGeneratedLabels(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.optimizeGeneratedLabels);
  }

  public getOptimizeGeneratedLabelsForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.optimizeGeneratedLabels);
  }

  public setOptimizeGeneratedLabels(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.optimizeGeneratedLabels = value; });
  }

  // ScrollBars
  public getScrollBars(): ScrollBars {
    return this.getValue<ScrollBars>((data: PropertyData) => data.scrollBars);
  }

  public getScrollBarsForLayer(layer: PropertyLayer): ScrollBars {
    return this.getValueForLayer<ScrollBars>(layer, (data: PropertyData) => data.scrollBars);
  }

  public setScrollBars(layer: PropertyLayer, value: ScrollBars): void {
    this.setValue(layer, (data: PropertyData) => { data.scrollBars = value; });
  }

  // SelectionMode
  public getSelectionMode(): ListViewSelectionMode {
    return this.getValue<ListViewSelectionMode>((data: PropertyData) => data.selectionMode);
  }

  public getListViewSelectionModeForLayer(layer: PropertyLayer): ListViewSelectionMode {
    return this.getValueForLayer<ListViewSelectionMode>(layer, (data: PropertyData) => data.selectionMode);
  }

  public setListViewSelectionMode(layer: PropertyLayer, value: ListViewSelectionMode): void {
    this.setValue(layer, (data: PropertyData) => { data.selectionMode = value; });
  }

  // ShowCaption
  public getShowCaption(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.showCaption);
  }

  public getShowCaptionForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.showCaption);
  }

  public setShowCaption(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.showCaption = value; });
  }

  // SynchronizeColumns
  public getSynchronizeColumns(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.synchronizeColumns);
  }

  public getSynchronizeColumnsForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.synchronizeColumns);
  }

  public setSynchronizeColumns(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.synchronizeColumns = value; });
  }

  // TabStop
  public getTabStop(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.tabStop);
  }

  public getTabStopForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.tabStop);
  }

  public setTabStop(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.tabStop = value; });
  }

  // TemplateCss
  public getTemplateCss(): string {
    return this.getValue<string>((data: PropertyData) => data.templateCss);
  }

  public getTemplateCssForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.templateCss);
  }

  public setTemplateCss(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.templateCss = value; });
  }

  // TemplateHtml
  public getTemplateHtml(): string {
    return this.getValue<string>((data: PropertyData) => data.templateHtml);
  }

  public getTemplateHtmlForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.templateHtml);
  }

  public setTemplateHtml(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.templateHtml = value; });
  }

  // TextAlign
  public getTextAlign(): TextAlign {
    return this.getValue<TextAlign>((data: PropertyData) => data.textAlign);
  }

  public getTextAlignForLayer(layer: PropertyLayer): TextAlign {
    return this.getValueForLayer<TextAlign>(layer, (data: PropertyData) => data.textAlign);
  }

  public setTextAlign(layer: PropertyLayer, value: TextAlign): void {
    this.setValue(layer, (data: PropertyData) => { data.textAlign = value; });
  }

  // Title
  public getTitle(): string {
    return this.getValue<string>((data: PropertyData) => data.title);
  }

  public getTitleForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => data.title);
  }

  public setTitle(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => { data.title = value; });
  }

  // Visibility
  public getVisibility(): Visibility {
    return this.getValue<Visibility>((data: PropertyData) => data.visibility);
  }

  public getVisibilityForLayer(layer: PropertyLayer): Visibility {
    return this.getValueForLayer<Visibility>(layer, (data: PropertyData) => data.visibility);
  }

  public setVisibility(layer: PropertyLayer, value: Visibility): void {
    this.setValue(layer, (data: PropertyData) => { data.visibility = value; });
  }

  // IsVisible
  public getIsVisible(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.isVisible);
  }

  public getIsVisibleForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.isVisible);
  }

  public setIsVisible(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.isVisible = value; });
  }

  // WordWrap
  public getWordWrap(): boolean {
    return this.getValue<boolean>((data: PropertyData) => data.wordWrap);
  }

  public getWordWrapForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => data.wordWrap);
  }

  public setWordWrap(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => { data.wordWrap = value; });
  }

  // WrapArrangement
  public getWrapArrangement(): WrapArrangement {
    return this.getValue<WrapArrangement>((data: PropertyData) => data.wrapArrangement);
  }

  public getWrapArrangementForLayer(layer: PropertyLayer): WrapArrangement {
    return this.getValueForLayer<WrapArrangement>(layer, (data: PropertyData) => data.wrapArrangement);
  }

  public setWrapArrangement(layer: PropertyLayer, value: WrapArrangement): void {
    this.setValue(layer, (data: PropertyData) => { data.wrapArrangement = value; });
  }
}
