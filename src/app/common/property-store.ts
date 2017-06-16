import { PropertyData } from './property-data';
import { PropertyLayer } from './property-layer';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment, HorizontalContentAlignment, VerticalContentAlignment } from '../enums';
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

  public setLayer(layer: PropertyLayer, data: PropertyData) {
    this.store.set(layer, data);
  }

  private getValue<T>(getValueFunc: (data: PropertyData) => T): T {
    let value: T = getValueFunc(this.store.get(PropertyLayer.CSC));

    if (value == null) {
      value = getValueFunc(this.store.get(PropertyLayer.Action));
      if (value == null) {
        value = getValueFunc(this.store.get(PropertyLayer.Control));
        if (value == null) {
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

  // Id
  public getId(): string {
    return this.getValue<string>((data: PropertyData) => { return data.id });
  }

  public getIdForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.id });
  }

  public setId(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.id = value });
  }

  // Name
  public getName(): string {
    return this.getValue<string>((data: PropertyData) => { return data.name });
  }

  public getNameForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.name });
  }

  public setName(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.name = value });
  }

  // Title
  public getTitle(): string {
    return this.getValue<string>((data: PropertyData) => { return data.title });
  }

  public getTitleForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.title });
  }

  public setTitle(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.title = value });
  }

  // Label
  public getLabel(): string {
    return this.getValue<string>((data: PropertyData) => { return data.label });
  }

  public getLabelForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.label });
  }

  public setLabel(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.label = value });
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

  // BackgroundColor
  public getBackgroundColor(): string {
    return this.getValue<string>((data: PropertyData) => { return data.backgroundColor });
  }

  public getBackgroundColorForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.backgroundColor });
  }

  public setBackgroundColor(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.backgroundColor = value });
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

  // HorizontalAlignment
  public getHorizontalAlignment(): HorizontalAlignment {
    return this.getValue<HorizontalAlignment>((data: PropertyData) => { return data.horizontalAlignment });
  }

  public getHorizontalAlignmentForLayer(layer: PropertyLayer): HorizontalAlignment {
    return this.getValueForLayer<HorizontalAlignment>(layer, (data: PropertyData) => { return data.horizontalAlignment });
  }

  public setHorizontalAlignment(layer: PropertyLayer, value: HorizontalAlignment): void {
    this.setValue<HorizontalAlignment>(layer, (data: PropertyData) => { data.horizontalAlignment = value });
  }

  // VerticalAlignment
  public getVerticalAlignment(): VerticalAlignment {
    return this.getValue<VerticalAlignment>((data: PropertyData) => { return data.verticalAlignment });
  }

  public getVerticalAlignmentForLayer(layer: PropertyLayer): VerticalAlignment {
    return this.getValueForLayer<VerticalAlignment>(layer, (data: PropertyData) => { return data.verticalAlignment });
  }

  public setVerticalAlignment(layer: PropertyLayer, value: VerticalAlignment): void {
    this.setValue<VerticalAlignment>(layer, (data: PropertyData) => { data.verticalAlignment = value });
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
    return this.getValue<number>((data: PropertyData) => { return data.horizontalSpacing });
  }

  public getHorizontalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.horizontalSpacing });
  }

  public setHorizontalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.horizontalSpacing = value });
  }

  // VerticalSpacing
  public getVerticalSpacing(): number {
    return this.getValue<number>((data: PropertyData) => { return data.verticalSpacing });
  }

  public getVerticalSpacingForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.verticalSpacing });
  }

  public setVerticalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.verticalSpacing = value });
  }

  // DockItemSize
  public getDockItemSize(): number {
    return this.getValue<number>((data: PropertyData) => { return data.dockItemSize });
  }

  public getDockItemSizeForLayer(layer: PropertyLayer): number {
    return this.getValueForLayer<number>(layer, (data: PropertyData) => { return data.dockItemSize });
  }

  public setDockItemSize(layer: PropertyLayer, value: number): void {
    this.setValue<number>(layer, (data: PropertyData) => { data.dockItemSize = value });
  }

  // DockOrientation
  public getDockOrientation(): DockOrientation {
    return this.getValue<DockOrientation>((data: PropertyData) => { return data.dockOrientation });
  }

  public getDockOrientationForLayer(layer: PropertyLayer): DockOrientation {
    return this.getValueForLayer<DockOrientation>(layer, (data: PropertyData) => { return data.dockOrientation });
  }

  public setDockOrientation(layer: PropertyLayer, value: DockOrientation): void {
    this.setValue<DockOrientation>(layer, (data: PropertyData) => { data.dockOrientation = value });
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

}
