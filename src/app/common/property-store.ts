import { PropertyLayer } from './property-layer';
import { PropertyLayerId } from './property-layer-id';
import { ControlVisibility } from '../enums';
import { DockOrientation } from '../layout/dock-layout';

export class PropertyStore {

  private store: Map<PropertyLayerId, PropertyLayer>;

  constructor() {
    this.store = new Map<PropertyLayerId, PropertyLayer>();
    this.store.set(PropertyLayerId.ControlStyle, new PropertyLayer());
    this.store.set(PropertyLayerId.Control, new PropertyLayer());
    this.store.set(PropertyLayerId.Action, new PropertyLayer());
    this.store.set(PropertyLayerId.CSC, new PropertyLayer());
  }

  public setLayer(layerId: PropertyLayerId, layer: PropertyLayer) {
    this.store.set(layerId, layer);
  }

  private getValue<T>(getValueFunc: (layer: PropertyLayer) => T): T {
    let value: T = getValueFunc(this.store.get(PropertyLayerId.CSC));

    if (value == null) {
      value = getValueFunc(this.store.get(PropertyLayerId.Action));
      if (value == null) {
        value = getValueFunc(this.store.get(PropertyLayerId.Control));
        if (value == null) {
          value = getValueFunc(this.store.get(PropertyLayerId.ControlStyle));
        }
      }
    }

    return value;
  }

  private getValueForLayer<T>(layerId: PropertyLayerId, getValueFunc: (layer: PropertyLayer) => T): T {
    return getValueFunc(this.store.get(layerId));
  }

  public setValue<T>(layerId: PropertyLayerId, setValueFunc: (layer: PropertyLayer) => void): void {
    setValueFunc(this.store.get(layerId));
  }

  // Id
  public getId(): string {
    return this.getValue<string>((layer: PropertyLayer) => { return layer.id });
  }

  public getIdForLayer(layerId: PropertyLayerId): string {
    return this.getValueForLayer<string>(layerId, (layer: PropertyLayer) => { return layer.id });
  }

  public setId(layerId: PropertyLayerId, value: string): void {
    this.setValue<string>(layerId, (layer: PropertyLayer) => { layer.id = value });
  }

  // Name
  public getName(): string {
    return this.getValue<string>((layer: PropertyLayer) => { return layer.name });
  }

  public getNameForLayer(layerId: PropertyLayerId): string {
    return this.getValueForLayer<string>(layerId, (layer: PropertyLayer) => { return layer.name });
  }

  public setName(layerId: PropertyLayerId, value: string): void {
    this.setValue<string>(layerId, (layer: PropertyLayer) => { layer.name = value });
  }

  // Name
  public getTitle(): string {
    return this.getValue<string>((layer: PropertyLayer) => { return layer.title });
  }

  public getTitleForLayer(layerId: PropertyLayerId): string {
    return this.getValueForLayer<string>(layerId, (layer: PropertyLayer) => { return layer.title });
  }

  public setTitle(layerId: PropertyLayerId, value: string): void {
    this.setValue<string>(layerId, (layer: PropertyLayer) => { layer.title = value });
  }

  // Visibility
  public getVisibility(): ControlVisibility {
    return this.getValue<ControlVisibility>((layer: PropertyLayer) => { return layer.visibility });
  }

  public getVisibilityForLayer(layerId: PropertyLayerId): ControlVisibility {
    return this.getValueForLayer<ControlVisibility>(layerId, (layer: PropertyLayer) => { return layer.visibility });
  }

  public setVisibility(layerId: PropertyLayerId, value: ControlVisibility): void {
    this.setValue<ControlVisibility>(layerId, (layer: PropertyLayer) => { layer.visibility = value });
  }

  // BackgroundColor
  public getBackgroundColor(): string {
    return this.getValue<string>((layer: PropertyLayer) => { return layer.backgroundColor });
  }

  publicgetBackgroundColorForLayer(layerId: PropertyLayerId): string {
    return this.getValueForLayer<string>(layerId, (layer: PropertyLayer) => { return layer.backgroundColor });
  }

  public setBackgroundColor(layerId: PropertyLayerId, value: string): void {
    this.setValue<string>(layerId, (layer: PropertyLayer) => { layer.backgroundColor = value });
  }

  // MinWidth
  public getMinWidth(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.minWidth });
  }

  public getMinWidthForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.minWidth });
  }

  public setMinWidth(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.minWidth = value });
  }

  // MinHeight
  public getMinHeight(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.minHeight });
  }

  public getMinHeightForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.minHeight });
  }

  public setMinHeight(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.minHeight = value });
  }

  // MaxWidth
  public getMaxWidth(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.maxWidth });
  }

  public getMaxWidthForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.maxWidth });
  }

  public setMaxWidth(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.maxWidth = value });
  }

  // MaxHeight
  public getMaxHeight(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.maxHeight });
  }

  public getMaxHeightForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.maxHeight });
  }

  public setMaxHeight(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.maxHeight = value });
  }

  // MarginLeft
  public getMarginLeft(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.marginLeft });
  }

  public getMarginLeftForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.marginLeft });
  }

  public setMarginLeft(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.marginLeft = value });
  }

  // MarginRight
  public getMarginRight(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.marginRight });
  }

  public getMarginRightForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.marginRight });
  }

  public setMarginRight(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.marginRight = value });
  }

  // MarginTop
  public getMarginTop(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.marginTop });
  }

  public getMarginTopForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.marginTop });
  }

  public setMarginTop(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.marginTop = value });
  }

  // MarginBottom
  public getMarginBottom(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.marginBottom });
  }

  public getMarginBottomForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.marginBottom });
  }

  public setMarginBottom(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.marginBottom = value });
  }

  // PaddingLeft
  public getPaddingLeft(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.paddingLeft });
  }

  public getPaddingLeftForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.paddingLeft });
  }

  public setPaddingLeft(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.paddingLeft = value });
  }

  // PaddingRight
  public getPaddingRight(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.paddingRight });
  }

  public getPaddingRightForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.paddingRight });
  }

  public setPaddingRight(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.paddingRight = value });
  }

  // PaddingTop
  public getPaddingTop(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.paddingTop });
  }

  public getPaddingTopForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.paddingTop });
  }

  public setPaddingTop(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.paddingTop = value });
  }

  // PaddingBottom
  public getPaddingBottom(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.paddingBottom });
  }

  public getPaddingBottomForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.paddingBottom });
  }

  public setPaddingBottom(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.paddingBottom = value });
  }

  // BorderColor
  public getBorderColor(): string {
    return this.getValue<string>((layer: PropertyLayer) => { return layer.borderColor });
  }

  public getBorderColorForLayer(layerId: PropertyLayerId): string {
    return this.getValueForLayer<string>(layerId, (layer: PropertyLayer) => { return layer.borderColor });
  }

  public setBorderColor(layerId: PropertyLayerId, value: string): void {
    this.setValue<string>(layerId, (layer: PropertyLayer) => { layer.borderColor = value });
  }

  // BorderThicknessLeft
  public getBorderThicknessLeft(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.borderThicknessLeft });
  }

  public getBorderThicknessLeftForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.borderThicknessLeft });
  }

  public setBorderThicknessLeft(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.borderThicknessLeft = value });
  }

  // BorderThicknessRight
  public geBorderThicknessRight(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.borderThicknessRight });
  }

  public getBorderThicknessRightForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.borderThicknessRight });
  }

  public setBorderThicknessRight(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.borderThicknessRight = value });
  }

  // BorderThicknessTop
  public getBorderThicknessTop(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.borderThicknessTop });
  }

  public getBorderThicknessTopForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.borderThicknessTop });
  }

  public setBorderThicknessTop(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.borderThicknessTop = value });
  }

  // BorderThicknessBottom
  public getBorderThicknessBottom(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.borderThicknessBottom });
  }

  public getBorderThicknessBottomForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.borderThicknessBottom });
  }

  public setBorderThicknessBottom(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.borderThicknessBottom = value });
  }

  // DockItemSize
  public getDockItemSize(): number {
    return this.getValue<number>((layer: PropertyLayer) => { return layer.dockItemSize });
  }

  public getDockItemSizeForLayer(layerId: PropertyLayerId): number {
    return this.getValueForLayer<number>(layerId, (layer: PropertyLayer) => { return layer.dockItemSize });
  }

  public setDockItemSize(layerId: PropertyLayerId, value: number): void {
    this.setValue<number>(layerId, (layer: PropertyLayer) => { layer.dockItemSize = value });
  }

  // DockOrientation
  public getDockOrientation(): DockOrientation {
    return this.getValue<DockOrientation>((layer: PropertyLayer) => { return layer.dockOrientation });
  }

  public getDockOrientationForLayer(layerId: PropertyLayerId): DockOrientation {
    return this.getValueForLayer<DockOrientation>(layerId, (layer: PropertyLayer) => { return layer.dockOrientation });
  }

  public setDockOrientation(layerId: PropertyLayerId, value: DockOrientation): void {
    this.setValue<DockOrientation>(layerId, (layer: PropertyLayer) => { layer.dockOrientation = value });
  }

}
