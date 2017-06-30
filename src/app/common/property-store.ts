import { PropertyData } from './property-data';
import { PropertyLayer } from './property-layer';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment, HorizontalContentAlignment, VerticalContentAlignment, ContentAlignment, TextAlign } from '../enums';
import { DockOrientation } from '../layout/dock-layout';
import { WrapArrangement } from '../layout/wrap-layout';

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

  public setValue<T>(layer: PropertyLayer, setValueFunc: (data: PropertyData) => void): void {
    setValueFunc(this.store.get(layer));
  }

  public setLayer(layer: PropertyLayer, data: PropertyData) {
    this.store.set(layer, data);
  }

  // ForeColor
  public getForeColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.foreColor });
  }

  public getForeColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.foreColor });
  }

  public setForeColor(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.foreColor = value });
  }

  // BackColor
  public getBackColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.backColor });
  }

  public getBackColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.backColor });
  }

  public setBackColor(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.backColor = value });
  }

  // DisabledBackColor
  public getDisabledBackColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.disabledBackColor });
  }

  public getDisabledBackColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.disabledBackColor });
  }

  public setDisabledBackColor(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.disabledBackColor = value });
  }

  // BorderColor
  public getBorderColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.borderColor });
  }

  public getBorderColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.borderColor });
  }

  public setBorderColor(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.borderColor = value });
  }

  // MinWidth
  public getMinWidth(): number {
    return this.getValue<number>((data: PropertyData) => { return data.minWidth });
  }

  public getMinWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.minWidth });
  }

  public setMinWidth(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.minWidth = value });
  }

  // MinHeight
  public getMinHeight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.minHeight });
  }

  public getMinHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.minHeight });
  }

  public setMinHeight(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.minHeight = value });
  }

  // MaxWidth
  public getMaxWidth(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxWidth });
  }

  public getMaxWidthForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxWidth });
  }

  public setMaxWidth(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.maxWidth = value });
  }

  // MaxHeight
  public getMaxHeight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.maxHeight });
  }

  public getMaxHeightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.maxHeight });
  }

  public setMaxHeight(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.maxHeight = value });
  }

  // MarginLeft
  public getMarginLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginLeft });
  }

  public getMarginLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginLeft });
  }

  public setMarginLeft(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.marginLeft = value });
  }

  // MarginRight
  public getMarginRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginRight });
  }

  public getMarginRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginRight });
  }

  public setMarginRight(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.marginRight = value });
  }

  // MarginTop
  public getMarginTop(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginTop });
  }

  public getMarginTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginTop });
  }

  public setMarginTop(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.marginTop = value });
  }

  // MarginBottom
  public getMarginBottom(): number {
    return this.getValue<number>((data: PropertyData) => { return data.marginBottom });
  }

  public getMarginBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.marginBottom });
  }

  public setMarginBottom(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.marginBottom = value });
  }

  // BorderThicknessLeft
  public getBorderThicknessLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessLeft });
  }

  public getBorderThicknessLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessLeft });
  }

  public setBorderThicknessLeft(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.borderThicknessLeft = value });
  }

  // BorderThicknessRight
  public getBorderThicknessRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessRight });
  }

  public getBorderThicknessRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessRight });
  }

  public setBorderThicknessRight(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.borderThicknessRight = value });
  }

  // BorderThicknessTop
  public getBorderThicknessTop(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessTop });
  }

  public getBorderThicknessTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessTop });
  }

  public setBorderThicknessTop(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.borderThicknessTop = value });
  }

  // BorderThicknessBottom
  public getBorderThicknessBottom(): number {
    return this.getValue<number>((data: PropertyData) => { return data.borderThicknessBottom });
  }

  public getBorderThicknessBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.borderThicknessBottom });
  }

  public setBorderThicknessBottom(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.borderThicknessBottom = value });
  }

  // PaddingLeft
  public getPaddingLeft(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingLeft });
  }

  public getPaddingLeftForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingLeft });
  }

  public setPaddingLeft(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.paddingLeft = value });
  }

  // PaddingRight
  public getPaddingRight(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingRight });
  }

  public getPaddingRightForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingRight });
  }

  public setPaddingRight(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.paddingRight = value });
  }

  // PaddingTop
  public getPaddingTop(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingTop });
  }

  public getPaddingTopForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingTop });
  }

  public setPaddingTop(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.paddingTop = value });
  }

  // PaddingBottom
  public getPaddingBottom(): number {
    return this.getValue<number>((data: PropertyData) => { return data.paddingBottom });
  }

  public getPaddingBottomForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.paddingBottom });
  }

  public setPaddingBottom(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.paddingBottom = value });
  }

  // HorizontalAlignment
  public getHorizontalAlignment(): HorizontalAlignment {
    return this.getValue<HorizontalAlignment>((data: PropertyData) => { return data.alignmentHorizontal });
  }

  public getHorizontalAlignmentForLayer(layer: PropertyLayer): HorizontalAlignment {
    return this.getValueForLayer<HorizontalAlignment>(layer, (data: PropertyData) => { return data.alignmentHorizontal });
  }

  public setHorizontalAlignment(layer: PropertyLayer, value: HorizontalAlignment): void {
    this.setValue<HorizontalAlignment>(layer, (data: PropertyData) => { data.alignmentHorizontal = value });
  }

  // VerticalAlignment
  public getVerticalAlignment(): VerticalAlignment {
    return this.getValue<VerticalAlignment>((data: PropertyData) => { return data.alignmentVertical });
  }

  public getVerticalAlignmentForLayer(layer: PropertyLayer): VerticalAlignment {
    return this.getValueForLayer<VerticalAlignment>(layer, (data: PropertyData) => { return data.alignmentVertical });
  }

  public setVerticalAlignment(layer: PropertyLayer, value: VerticalAlignment): void {
    this.setValue<VerticalAlignment>(layer, (data: PropertyData) => { data.alignmentVertical = value });
  }

  // HorizontalContentAlignment
  public getHorizontalContentAlignment(): HorizontalContentAlignment {
    return this.getValue<HorizontalContentAlignment>((data: PropertyData) => { return data.horizontalContentAlignment });
  }

  public getHorizontalContentAlignmentForLayer(layer: PropertyLayer): HorizontalContentAlignment {
    return this.getValueForLayer<HorizontalContentAlignment>(layer, (data: PropertyData) => { return data.horizontalContentAlignment });
  }

  public setHorizontalContentAlignment(layer: PropertyLayer, value: HorizontalContentAlignment): void {
    this.setValue<HorizontalContentAlignment>(layer, (data: PropertyData) => { data.horizontalContentAlignment = value });
  }

  // VerticalContentAlignment
  public getVerticalContentAlignment(): VerticalContentAlignment {
    return this.getValue<VerticalContentAlignment>((data: PropertyData) => { return data.verticalContentAlignment });
  }

  public getVerticalContentAlignmentForLayer(layer: PropertyLayer): VerticalContentAlignment {
    return this.getValueForLayer<VerticalContentAlignment>(layer, (data: PropertyData) => { return data.verticalContentAlignment });
  }

  public setVerticalContentAlignment(layer: PropertyLayer, value: VerticalContentAlignment): void {
    this.setValue<VerticalContentAlignment>(layer, (data: PropertyData) => { data.verticalContentAlignment = value });
  }

  // HorizontalSpacing
  public getHorizontalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => { return data.spacingHorizontal });
  }

  public getHorizontalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.spacingHorizontal });
  }

  public setHorizontalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.spacingHorizontal = value });
  }

  // VerticalSpacing
  public getVerticalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => { return data.spacingVertical });
  }

  public getVerticalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.spacingVertical });
  }

  public setVerticalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.spacingVertical = value });
  }

  // FontBold
  public getFontBold(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.fontBold });
  }

  public getFontBoldForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.fontBold });
  }

  public setFontBold(layer: PropertyLayer, value: boolean): void {
    this.setValue<boolean>(layer, (data: PropertyData) => { data.fontBold = value });
  }

  // FontFamily
  public getFontFamily(): string {
    return this.getValue<string>((data: PropertyData) => { return data.fontFamily });
  }

  public getFontFamilyForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.fontFamily });
  }

  public setFontFamily(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.fontFamily = value });
  }

  // FontItalic
  public getFontItalic(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.fontItalic });
  }

  public getFontItalicForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.fontItalic });
  }

  public setFontItalic(layer: PropertyLayer, value: boolean): void {
    this.setValue<boolean>(layer, (data: PropertyData) => { data.fontItalic = value });
  }

  // FontSize
  public getFontSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.fontSize });
  }

  public getFontSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.fontSize });
  }

  public setFontSize(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.fontSize = value });
  }

  // FontUnderline
  public getFontUnderline(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.fontUnderline });
  }

  public getFontUnderlineForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.fontUnderline });
  }

  public setFontUnderline(layer: PropertyLayer, value: boolean): void {
    this.setValue<boolean>(layer, (data: PropertyData) => { data.fontUnderline = value });
  }

  // Caption
  public getCaption(): string {
    return this.getValue<string>((data: PropertyData) => { return data.caption });
  }

  public getCaptionForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.caption });
  }

  public setCaption(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.caption = value });
  }

  // CaptionAlign
  public getCaptionAlign(): ContentAlignment {
    return this.getValue<ContentAlignment>((data: PropertyData) => { return data.captionAlign });
  }

  public getCaptionAlignForLayer(layer: PropertyLayer): ContentAlignment {
    return this.getValueForLayer<ContentAlignment>(layer, (data: PropertyData) => { return data.captionAlign });
  }

  public setCaptionAlign(layer: PropertyLayer, value: ContentAlignment): void {
    this.setValue<ContentAlignment>(layer, (data: PropertyData) => { data.captionAlign = value });
  }

  // DockItemSize
  public getDockItemSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.dockPanel_ItemSize });
  }

  public getDockItemSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.dockPanel_ItemSize });
  }

  public setDockItemSize(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.dockPanel_ItemSize = value });
  }

   // DockOrientation
  public getDockOrientation(): DockOrientation {
    return this.getValue<DockOrientation>((data: PropertyData) => { return data.dockPanelOrientation });
  }

  public getDockOrientationForLayer(layer: PropertyLayer): DockOrientation {
    return this.getValueForLayer<DockOrientation>(layer, (data: PropertyData) => { return data.dockPanelOrientation });
  }

  public setDockOrientation(layer: PropertyLayer, value: DockOrientation): void {
    this.setValue<DockOrientation>(layer, (data: PropertyData) => { data.dockPanelOrientation = value });
  }

  // FieldRowSize
  public getFieldRowSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.fieldRowSize });
  }

  public getFieldRowSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.fieldRowSize });
  }

  public setFieldRowSize(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.fieldRowSize = value });
  }

  // InvertFlowDirection
  public getInvertFlowDirection(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.invertFlowDirection });
  }

  public getInvertFlowDirectionForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.invertFlowDirection });
  }

  public setInvertFlowDirection(layer: PropertyLayer, value: boolean): void {
    this.setValue<boolean>(layer, (data: PropertyData) => { data.invertFlowDirection = value });
  }

  // ShowCaption
  public getShowCaption(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.showCaption });
  }

  public getShowCaptionForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.showCaption });
  }

  public setShowCaption(layer: PropertyLayer, value: boolean): void {
    this.setValue<boolean>(layer, (data: PropertyData) => { data.showCaption = value });
  }

  // TabStop
  public getTabStop(): boolean {
    return this.getValue<boolean>((data: PropertyData) => { return data.tabStop });
  }

  public getTabStopForLayer(layer: PropertyLayer): boolean {
    return this.getValueForLayer<boolean>(layer, (data: PropertyData) => { return data.tabStop });
  }

  public setTabStop(layer: PropertyLayer, value: boolean): void {
    this.setValue<boolean>(layer, (data: PropertyData) => { data.tabStop = value });
  }

  // TextAlign
  public getTextAlign(): TextAlign {
    return this.getValue<TextAlign>((data: PropertyData) => { return data.textAlign });
  }

  public getTextAlignForLayer(layer: PropertyLayer): TextAlign {
    return this.getValueForLayer<TextAlign>(layer, (data: PropertyData) => { return data.textAlign });
  }

  public setTextAlign(layer: PropertyLayer, value: TextAlign): void {
    this.setValue<TextAlign>(layer, (data: PropertyData) => { data.textAlign = value });
  }

  // Visibility
  public getVisibility(): ControlVisibility {
    return this.getValue<ControlVisibility>((data: PropertyData) => { return data.visibility });
  }

  public getVisibilityForLayer(layer: PropertyLayer): ControlVisibility {
    return this.getValueForLayer<ControlVisibility>(layer, (data: PropertyData) => { return data.visibility });
  }

  public setVisibility(layer: PropertyLayer, value: ControlVisibility): void {
    this.setValue<ControlVisibility>(layer, (data: PropertyData) => { data.visibility = value });
  }

  // WrapArrangement
  public getWrapArrangement(): WrapArrangement {
    return this.getValue<WrapArrangement>((data: PropertyData) => { return data.wrapArrangement });
  }

  public getWrapArrangementForLayer(layer: PropertyLayer): WrapArrangement {
    return this.getValueForLayer<WrapArrangement>(layer, (data: PropertyData) => { return data.wrapArrangement });
  }

  public setWrapArrangement(layer: PropertyLayer, value: WrapArrangement): void {
    this.setValue<WrapArrangement>(layer, (data: PropertyData) => { data.wrapArrangement = value });
  }
}
