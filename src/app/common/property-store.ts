import { PropertyData } from './property-data';
import { PropertyLayer } from './property-layer';
import { ControlVisibility } from '../enums';
import { DockOrientation } from '../layout/dock-layout';

export class PropertyStore {

  private store: Map<PropertyLayer, PropertyData>;

  constructor() {
    this.store = new Map<PropertyLayer, PropertyData>();
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
    let data: PropertyData = this.store.get(layer);

    if (!data) {
      data = new PropertyData();
      this.store.set(layer, data);
    }

    setValueFunc(data);
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

  // Name
  public getTitle(): string {
    return this.getValue<string>((data: PropertyData) => { return data.title });
  }

  public getTitleForLayer(layer: PropertyLayer): string {
    return this.getValueForLayer<string>(layer, (data: PropertyData) => { return data.title });
  }

  public setTitle(layer: PropertyLayer, value: string): void {
    this.setValue<string>(layer, (data: PropertyData) => { data.title = value });
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

  publicgetBackgroundColorForLayer(layer: PropertyLayer): string {
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
  public geBorderThicknessRight(): number {
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

}
