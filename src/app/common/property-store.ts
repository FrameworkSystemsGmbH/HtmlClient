import { PropertyData } from '@app/common/property-data';
import { PropertyLayer } from '@app/common/property-layer';
import { ContentAlignment } from '@app/enums/content-alignment';
import { DataSourceType } from '@app/enums/datasource-type';
import { DockPanelScrolling } from '@app/enums/dockpanel-scrolling';
import { EditStyle } from '@app/enums/edit-style';
import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { HorizontalContentAlignment } from '@app/enums/horizontal-content-alignment';
import { ListViewItemArrangement } from '@app/enums/listview-item-arrangement';
import { ListViewSelectionMode } from '@app/enums/listview-selection-mode';
import { ListViewSelectorPosition } from '@app/enums/listview-selector-position';
import { PictureScaleMode } from '@app/enums/picture-scale-mode';
import { ScrollBars } from '@app/enums/scrollbars';
import { TabAlignment } from '@app/enums/tab-alignment';
import { TextAlign } from '@app/enums/text-align';
import { TextFormat } from '@app/enums/text-format';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { VerticalContentAlignment } from '@app/enums/vertical-content-alignment';
import { Visibility } from '@app/enums/visibility';
import { DockOrientation } from '@app/layout/dock-layout/dock-orientation';
import { FieldRowLabelMode } from '@app/layout/field-layout/field-row-label-mode';
import { WrapArrangement } from '@app/layout/wrap-layout/wrap-arrangement';
import * as JsonUtil from '@app/util/json-util';


const DEFAULT_FONT: string | undefined = 'Roboto, Arial, Helvetica, Verdana';

export class PropertyStore {

  private readonly _store: Map<PropertyLayer, PropertyData>;

  public constructor() {
    this._store = new Map<PropertyLayer, PropertyData>();
    this._store.set(PropertyLayer.ControlStyle, new PropertyData());
    this._store.set(PropertyLayer.Control, new PropertyData());
    this._store.set(PropertyLayer.Action, new PropertyData());
    this._store.set(PropertyLayer.CSC, new PropertyData());
  }

  // Layer
  public getLayer(layer: PropertyLayer): PropertyData {
    const data: PropertyData | undefined = this._store.get(layer);

    if (data == null) {
      throw new Error(`Could not find property store layer '${PropertyLayer[layer]}'`);
    }

    return data;
  }

  public setLayer(layer: PropertyLayer, data: PropertyData): void {
    this._store.set(layer, data);
  }

  // Get Property as new PropertyStore
  public getPropertyStore(getFromPropertyFunc: (data: PropertyData) => PropertyData | undefined): PropertyStore {
    const propertyLayerControlStyle: PropertyData | undefined = getFromPropertyFunc(this.getLayer(PropertyLayer.ControlStyle));
    const propertyLayerControl: PropertyData | undefined = getFromPropertyFunc(this.getLayer(PropertyLayer.Control));
    const propertyLayerAction: PropertyData | undefined = getFromPropertyFunc(this.getLayer(PropertyLayer.Action));
    const propertyLayerCSC: PropertyData | undefined = getFromPropertyFunc(this.getLayer(PropertyLayer.CSC));

    const propertyStore: PropertyStore = new PropertyStore();
    propertyStore.setLayer(PropertyLayer.ControlStyle, propertyLayerControlStyle != null ? propertyLayerControlStyle : new PropertyData());
    propertyStore.setLayer(PropertyLayer.Control, propertyLayerControl != null ? propertyLayerControl : new PropertyData());
    propertyStore.setLayer(PropertyLayer.Action, propertyLayerAction != null ? propertyLayerAction : new PropertyData());
    propertyStore.setLayer(PropertyLayer.CSC, propertyLayerCSC != null ? propertyLayerCSC : new PropertyData());

    return propertyStore;
  }

  // Get|Set Value
  private getValue<T>(getValueFunc: (data: PropertyData) => T): T {
    let value: T = getValueFunc(this.getLayer(PropertyLayer.CSC));

    if (value === undefined) {
      value = getValueFunc(this.getLayer(PropertyLayer.Action));
      if (value === undefined) {
        value = getValueFunc(this.getLayer(PropertyLayer.Control));
        if (value === undefined) {
          value = getValueFunc(this.getLayer(PropertyLayer.ControlStyle));
        }
      }
    }

    return value;
  }

  private getValueForLayer<T>(layer: PropertyLayer, getValueFunc: (data: PropertyData) => T): T {
    return getValueFunc(this.getLayer(layer));
  }

  public setValue(layer: PropertyLayer, setValueFunc: (data: PropertyData) => void): void {
    setValueFunc(this.getLayer(layer));
  }

  // Serialization
  public saveState(): any {
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

  public loadState(json: any): void {
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

  // ListVIewItemCssGlobal
  public getListViewItemCssGlobal(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.listViewItemCssGlobal);
  }

  public getListViewItemCssGlobalForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.listViewItemCssGlobal);
  }

  public setListViewItemCssGlobal(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.listViewItemCssGlobal = value;
    });
  }

  // TemplateControlCssGlobal
  public getTemplateControlCssGlobal(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.templateControlCssGlobal);
  }

  public getTemplateControlCssGlobalForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.templateControlCssGlobal);
  }

  public setTemplateControlCssGlobal(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.templateControlCssGlobal = value;
    });
  }

  // MeasureText
  public getMeasureText(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.measureText);
  }

  public getMeasureTextForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.measureText);
  }

  public setMeasureText(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.measureText = value;
    });
  }

  // MinWidthRaster
  public getMinWidthRaster(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.minWidthRaster);
  }

  public getMinWidthRasterForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.minWidthRaster);
  }

  public setMinWidthRaster(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.minWidthRaster = value;
    });
  }

  // MaxWidthRaster
  public getMaxWidthRaster(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxWidthRaster);
  }

  public getMaxWidthRasterForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxWidthRaster);
  }

  public setMaxWidthRaster(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxWidthRaster = value;
    });
  }

  // ForeColor
  public getForeColor(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.foreColor);
  }

  public getForeColorForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.foreColor);
  }

  public setForeColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.foreColor = value;
    });
  }

  // BackColor
  public getBackColor(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.backColor);
  }

  public getBackColorForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.backColor);
  }

  public setBackColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.backColor = value;
    });
  }

  // DisabledBackColor
  public getDisabledBackColor(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.disabledBackColor);
  }

  public getDisabledBackColorForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.disabledBackColor);
  }

  public setDisabledBackColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.disabledBackColor = value;
    });
  }

  // BorderColor
  public getBorderColor(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.borderColor);
  }

  public getBorderColorForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.borderColor);
  }

  public setBorderColor(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderColor = value;
    });
  }

  // MinWidth
  public getMinWidth(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.minWidth);
  }

  public getMinWidthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.minWidth);
  }

  public setMinWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.minWidth = value;
    });
  }

  // MinHeight
  public getMinHeight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.minHeight);
  }

  public getMinHeightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.minHeight);
  }

  public setMinHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.minHeight = value;
    });
  }

  // MaxWidth
  public getMaxWidth(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxWidth);
  }

  public getMaxWidthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxWidth);
  }

  public setMaxWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxWidth = value;
    });
  }

  // MaxHeight
  public getMaxHeight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxHeight);
  }

  public getMaxHeightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxHeight);
  }

  public setMaxHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxHeight = value;
    });
  }

  // DisplayMinLines
  public getDisplayMinLines(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.displayMinLines);
  }

  public getDisplayMinLinesForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.displayMinLines);
  }

  public setDisplayMinLines(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.displayMinLines = value;
    });
  }

  // DisplayMaxLines
  public getDisplayMaxLines(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.displayMaxLines);
  }

  public getDisplayMaxLinesForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.displayMaxLines);
  }

  public setDisplayMaxLines(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.displayMaxLines = value;
    });
  }

  // DisplayMinLength
  public getDisplayMinLength(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.displayMinLength);
  }

  public getDisplayMinLengthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.displayMinLength);
  }

  public setDisplayMinLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.displayMinLength = value;
    });
  }

  // DisplayMaxLength
  public getDisplayMaxLength(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.displayMaxLength);
  }

  public getDisplayMaxLengthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.displayMaxLength);
  }

  public setDisplayMaxLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.displayMaxLength = value;
    });
  }

  // MarginLeft
  public getMarginLeft(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.marginLeft);
  }

  public getMarginLeftForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.marginLeft);
  }

  public setMarginLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.marginLeft = value;
    });
  }

  // MarginRight
  public getMarginRight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.marginRight);
  }

  public getMarginRightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.marginRight);
  }

  public setMarginRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.marginRight = value;
    });
  }

  // MarginTop
  public getMarginTop(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.marginTop);
  }

  public getMarginTopForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.marginTop);
  }

  public setMarginTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.marginTop = value;
    });
  }

  // MarginBottom
  public getMarginBottom(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.marginBottom);
  }

  public getMarginBottomForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.marginBottom);
  }

  public setMarginBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.marginBottom = value;
    });
  }

  // BorderRadiusTopLeft
  public getBorderRadiusTopLeft(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderRadiusTopLeft);
  }

  public getBorderRadiusTopLeftForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderRadiusTopLeft);
  }

  public setBorderRadiusTopLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderRadiusTopLeft = value;
    });
  }

  // BorderRadiusTopRight
  public getBorderRadiusTopRight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderRadiusTopRight);
  }

  public getBorderRadiusTopRightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderRadiusTopRight);
  }

  public setBorderRadiusTopRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderRadiusTopRight = value;
    });
  }

  // BorderRadiusBottomLeft
  public getBorderRadiusBottomLeft(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderRadiusBottomLeft);
  }

  public getBorderRadiusBottomLeftForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderRadiusBottomLeft);
  }

  public setBorderRadiusBottomLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderRadiusBottomLeft = value;
    });
  }

  // BorderRadiusBottomRight
  public getBorderRadiusBottomRight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderRadiusBottomRight);
  }

  public getBorderRadiusBottomRightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderRadiusBottomRight);
  }

  public setBorderRadiusBottomRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderRadiusBottomRight = value;
    });
  }

  // BorderThicknessLeft
  public getBorderThicknessLeft(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderThicknessLeft);
  }

  public getBorderThicknessLeftForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderThicknessLeft);
  }

  public setBorderThicknessLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderThicknessLeft = value;
    });
  }

  // BorderThicknessRight
  public getBorderThicknessRight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderThicknessRight);
  }

  public getBorderThicknessRightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderThicknessRight);
  }

  public setBorderThicknessRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderThicknessRight = value;
    });
  }

  // BorderThicknessTop
  public getBorderThicknessTop(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderThicknessTop);
  }

  public getBorderThicknessTopForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderThicknessTop);
  }

  public setBorderThicknessTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderThicknessTop = value;
    });
  }

  // BorderThicknessBottom
  public getBorderThicknessBottom(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.borderThicknessBottom);
  }

  public getBorderThicknessBottomForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.borderThicknessBottom);
  }

  public setBorderThicknessBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.borderThicknessBottom = value;
    });
  }

  // PaddingLeft
  public getPaddingLeft(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.paddingLeft);
  }

  public getPaddingLeftForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.paddingLeft);
  }

  public setPaddingLeft(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.paddingLeft = value;
    });
  }

  // PaddingRight
  public getPaddingRight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.paddingRight);
  }

  public getPaddingRightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.paddingRight);
  }

  public setPaddingRight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.paddingRight = value;
    });
  }

  // PaddingTop
  public getPaddingTop(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.paddingTop);
  }

  public getPaddingTopForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.paddingTop);
  }

  public setPaddingTop(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.paddingTop = value;
    });
  }

  // PaddingBottom
  public getPaddingBottom(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.paddingBottom);
  }

  public getPaddingBottomForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.paddingBottom);
  }

  public setPaddingBottom(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.paddingBottom = value;
    });
  }

  // HorizontalAlignment
  public getHorizontalAlignment(): HorizontalAlignment | undefined {
    return this.getValue<HorizontalAlignment | undefined>((data: PropertyData) => data.alignmentHorizontal);
  }

  public getHorizontalAlignmentForLayer(layer: PropertyLayer): HorizontalAlignment | undefined {
    return this.getValueForLayer<HorizontalAlignment | undefined>(layer, (data: PropertyData) => data.alignmentHorizontal);
  }

  public setHorizontalAlignment(layer: PropertyLayer, value: HorizontalAlignment): void {
    this.setValue(layer, (data: PropertyData) => {
      data.alignmentHorizontal = value;
    });
  }

  // VerticalAlignment
  public getVerticalAlignment(): VerticalAlignment | undefined {
    return this.getValue<VerticalAlignment | undefined>((data: PropertyData) => data.alignmentVertical);
  }

  public getVerticalAlignmentForLayer(layer: PropertyLayer): VerticalAlignment | undefined {
    return this.getValueForLayer<VerticalAlignment | undefined>(layer, (data: PropertyData) => data.alignmentVertical);
  }

  public setVerticalAlignment(layer: PropertyLayer, value: VerticalAlignment): void {
    this.setValue(layer, (data: PropertyData) => {
      data.alignmentVertical = value;
    });
  }

  // HorizontalContentAlignment
  public getHorizontalContentAlignment(): HorizontalContentAlignment | undefined {
    return this.getValue<HorizontalContentAlignment | undefined>((data: PropertyData) => data.horizontalContentAlignment);
  }

  public getHorizontalContentAlignmentForLayer(layer: PropertyLayer): HorizontalContentAlignment | undefined {
    return this.getValueForLayer<HorizontalContentAlignment | undefined>(layer, (data: PropertyData) => data.horizontalContentAlignment);
  }

  public setHorizontalContentAlignment(layer: PropertyLayer, value: HorizontalContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => {
      data.horizontalContentAlignment = value;
    });
  }

  // VerticalContentAlignment
  public getVerticalContentAlignment(): VerticalContentAlignment | undefined {
    return this.getValue<VerticalContentAlignment | undefined>((data: PropertyData) => data.verticalContentAlignment);
  }

  public getVerticalContentAlignmentForLayer(layer: PropertyLayer): VerticalContentAlignment | undefined {
    return this.getValueForLayer<VerticalContentAlignment | undefined>(layer, (data: PropertyData) => data.verticalContentAlignment);
  }

  public setVerticalContentAlignment(layer: PropertyLayer, value: VerticalContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => {
      data.verticalContentAlignment = value;
    });
  }

  // HorizontalSpacing
  public getHorizontalSpacing(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.spacingHorizontal);
  }

  public getHorizontalSpacingForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.spacingHorizontal);
  }

  public setHorizontalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.spacingHorizontal = value;
    });
  }

  // VerticalSpacing
  public getVerticalSpacing(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.spacingVertical);
  }

  public getVerticalSpacingForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.spacingVertical);
  }

  public setVerticalSpacing(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.spacingVertical = value;
    });
  }

  // FontBold
  public getFontBold(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.fontBold);
  }

  public getFontBoldForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.fontBold);
  }

  public setFontBold(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.fontBold = value;
    });
  }

  // FontFamily
  public getFontFamily(): string | undefined {
    return DEFAULT_FONT;
  }

  public getFontFamilyForLayer(layer: PropertyLayer): string | undefined {
    return DEFAULT_FONT;
  }

  public setFontFamily(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.fontFamily = value;
    });
  }

  // FontItalic
  public getFontItalic(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.fontItalic);
  }

  public getFontItalicForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.fontItalic);
  }

  public setFontItalic(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.fontItalic = value;
    });
  }

  // FontSize
  public getFontSize(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.fontSize);
  }

  public getFontSizeForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.fontSize);
  }

  public setFontSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.fontSize = value;
    });
  }

  // FontUnderline
  public getFontUnderline(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.fontUnderline);
  }

  public getFontUnderlineForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.fontUnderline);
  }

  public setFontUnderline(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.fontUnderline = value;
    });
  }

  // Image
  public getImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.image);
  }

  public getImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.image);
  }

  public setImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.image = value;
    });
  }

  // ImageBack
  public getImageBack(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.imageBack);
  }

  public getImageBackForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.imageBack);
  }

  public setImageBack(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.imageBack = value;
    });
  }

  // ImageForward
  public getImageForward(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.imageForward);
  }

  public getImageForwardForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.imageForward);
  }

  public setImageForward(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.imageForward = value;
    });
  }

  // InactiveImage
  public getInactiveImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.inactiveImage);
  }

  public getInactiveImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.inactiveImage);
  }

  public setInactiveImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.inactiveImage = value;
    });
  }

  // ActiveImage
  public getActiveImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.activeImage);
  }

  public getActiveImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.activeImage);
  }

  public setActiveImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.activeImage = value;
    });
  }

  // DisabledImage
  public getDisabledImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.disabledImage);
  }

  public getDisabledImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.disabledImage);
  }

  public setDisabledImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.disabledImage = value;
    });
  }

  // HighlightImage
  public getHighlightImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.highlightImage);
  }

  public getHighlightImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.highlightImage);
  }

  public setHighlightImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.highlightImage = value;
    });
  }

  // MouseOverImage
  public getMouseOverImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.mouseOverImage);
  }

  public getMouseOverImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.mouseOverImage);
  }

  public setMouseOverImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.mouseOverImage = value;
    });
  }

  // PressedImage
  public getPressedImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.pressedImage);
  }

  public getPressedImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.pressedImage);
  }

  public setPressedImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.pressedImage = value;
    });
  }

  // BackgroundImage
  public getBackgroundImage(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.backgroundImage);
  }

  public getBackgroundImageForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.backgroundImage);
  }

  public setBackgroundImage(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.backgroundImage = value;
    });
  }

  // Caption
  public getCaption(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.caption);
  }

  public getCaptionForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.caption);
  }

  public setCaption(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.caption = value;
    });
  }

  // Caption
  public getCaptionAsPlaceholder(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.captionAsPlaceholder);
  }

  public getCaptionAsPlaceholderForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.captionAsPlaceholder);
  }

  public setCaptionAsPlaceholder(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.captionAsPlaceholder = value;
    });
  }

  // CaptionAlign
  public getCaptionAlign(): ContentAlignment | undefined {
    return this.getValue<ContentAlignment | undefined>((data: PropertyData) => data.captionAlign);
  }

  public getCaptionAlignForLayer(layer: PropertyLayer): ContentAlignment | undefined {
    return this.getValueForLayer<ContentAlignment | undefined>(layer, (data: PropertyData) => data.captionAlign);
  }

  public setCaptionAlign(layer: PropertyLayer, value: ContentAlignment): void {
    this.setValue(layer, (data: PropertyData) => {
      data.captionAlign = value;
    });
  }

  // DatasourceOnValue
  public getDatasourceOnValue(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.datasourceOnValue);
  }

  public getDatasourceOnValueForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.datasourceOnValue);
  }

  public setDatasourceOnValue(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.datasourceOnValue = value;
    });
  }

  // DataSourceType
  public getDataSourceType(): DataSourceType | undefined {
    return this.getValue<DataSourceType | undefined>((data: PropertyData) => data.dataSourceTypeID);
  }

  public getDataSourceTypeForLayer(layer: PropertyLayer): DataSourceType | undefined {
    return this.getValueForLayer<DataSourceType | undefined>(layer, (data: PropertyData) => data.dataSourceTypeID);
  }

  public setDataSourceType(layer: PropertyLayer, value: DataSourceType): void {
    this.setValue(layer, (data: PropertyData) => {
      data.dataSourceTypeID = value;
    });
  }

  // DockItemSize
  public getDockItemSize(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.dockPanel_ItemSize);
  }

  public getDockItemSizeForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.dockPanel_ItemSize);
  }

  public setDockItemSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.dockPanel_ItemSize = value;
    });
  }

  // DockOrientation
  public getDockOrientation(): DockOrientation | undefined {
    return this.getValue<DockOrientation | undefined>((data: PropertyData) => data.dockPanelOrientation);
  }

  public getDockOrientationForLayer(layer: PropertyLayer): DockOrientation | undefined {
    return this.getValueForLayer<DockOrientation | undefined>(layer, (data: PropertyData) => data.dockPanelOrientation);
  }

  public setDockOrientation(layer: PropertyLayer, value: DockOrientation): void {
    this.setValue(layer, (data: PropertyData) => {
      data.dockPanelOrientation = value;
    });
  }

  // DockPanelScrolling
  public getDockPanelScrolling(): DockPanelScrolling | undefined {
    return this.getValue<DockPanelScrolling | undefined>((data: PropertyData) => data.dockPanelScrolling);
  }

  public getDockPanelScrollingForLayer(layer: PropertyLayer): DockPanelScrolling | undefined {
    return this.getValueForLayer<DockPanelScrolling | undefined>(layer, (data: PropertyData) => data.dockPanelScrolling);
  }

  public setDockPanelScrolling(layer: PropertyLayer, value: DockPanelScrolling): void {
    this.setValue(layer, (data: PropertyData) => {
      data.dockPanelScrolling = value;
    });
  }

  // EditStyle
  public getEditStyle(): EditStyle | undefined {
    return this.getValue<EditStyle | undefined>((data: PropertyData) => data.editStyle);
  }

  public getEditStyleForLayer(layer: PropertyLayer): EditStyle | undefined {
    return this.getValueForLayer<EditStyle | undefined>(layer, (data: PropertyData) => data.editStyle);
  }

  public setEditStyle(layer: PropertyLayer, value: EditStyle): void {
    this.setValue(layer, (data: PropertyData) => {
      data.editStyle = value;
    });
  }

  // FieldRowSize
  public getFieldRowSize(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.fieldRowSize);
  }

  public getFieldRowSizeForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.fieldRowSize);
  }

  public setFieldRowSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.fieldRowSize = value;
    });
  }

  // Format
  public getFormat(): TextFormat | undefined {
    return this.getValue<TextFormat | undefined>((data: PropertyData) => data.format);
  }

  public getFormatForLayer(layer: PropertyLayer): TextFormat | undefined {
    return this.getValueForLayer<TextFormat | undefined>(layer, (data: PropertyData) => data.format);
  }

  public setFormat(layer: PropertyLayer, value: TextFormat): void {
    this.setValue(layer, (data: PropertyData) => {
      data.format = value;
    });
  }

  // FormatPattern
  public getFormatPattern(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.formatPattern);
  }

  public getFormatPatternForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.formatPattern);
  }

  public setFormatPattern(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.formatPattern = value;
    });
  }

  // InvertFlowDirection
  public getInvertFlowDirection(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.invertFlowDirection);
  }

  public getInvertFlowDirectionForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.invertFlowDirection);
  }

  public setInvertFlowDirection(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.invertFlowDirection = value;
    });
  }

  // ItemArrangement
  public getItemArrangement(): ListViewItemArrangement | undefined {
    return this.getValue<ListViewItemArrangement | undefined>((data: PropertyData) => data.itemArrangement);
  }

  public getListViewItemArrangementForLayer(layer: PropertyLayer): ListViewItemArrangement | undefined {
    return this.getValueForLayer<ListViewItemArrangement | undefined>(layer, (data: PropertyData) => data.itemArrangement);
  }

  public setListViewItemArrangement(layer: PropertyLayer, value: ListViewItemArrangement): void {
    this.setValue(layer, (data: PropertyData) => {
      data.itemArrangement = value;
    });
  }

  // ItemMinWidth
  public getItemWidth(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.itemWidth);
  }

  public getItemWidthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.itemWidth);
  }

  public setItemWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.itemWidth = value;
    });
  }

  // ItemMinHeight
  public getItemHeight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.itemHeight);
  }

  public getItemHeightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.itemHeight);
  }

  public setItemHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.itemHeight = value;
    });
  }

  // IsCloseIconVisible
  public getIsCloseIconVisible(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.isCloseIconVisible);
  }

  public getIsCloseIconVisibleForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.isCloseIconVisible);
  }

  public setIsCloseIconVisible(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.isCloseIconVisible = value;
    });
  }

  // HideModalHeader
  public getHideModalHeader(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.hideModalHeader);
  }

  public getHideModalHeaderForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.hideModalHeader);
  }

  public setHideModalHeader(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.hideModalHeader = value;
    });
  }

  // IsEditable
  public getIsEditable(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.isEditable);
  }

  public getIsEditableForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.isEditable);
  }

  public setIsEditable(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.isEditable = value;
    });
  }

  // IsEnabled
  public getIsEnabled(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.isEnabled);
  }

  public getIsEnabledForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.isEnabled);
  }

  public setIsEnabled(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.isEnabled = value;
    });
  }

  // LabelMode
  public getLabelMode(): FieldRowLabelMode | undefined {
    return this.getValue<FieldRowLabelMode | undefined>((data: PropertyData) => data.labelMode);
  }

  public getLabelModeForLayer(layer: PropertyLayer): FieldRowLabelMode | undefined {
    return this.getValueForLayer<FieldRowLabelMode | undefined>(layer, (data: PropertyData) => data.labelMode);
  }

  public setLabelMode(layer: PropertyLayer, value: FieldRowLabelMode): void {
    this.setValue(layer, (data: PropertyData) => {
      data.labelMode = value;
    });
  }

  // ListDisplayMinLength
  public getListDisplayMinLength(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.listDisplayMinLength);
  }

  public getListDisplayMinLengthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.listDisplayMinLength);
  }

  public setListDisplayMinLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.listDisplayMinLength = value;
    });
  }

  // ListDisplayMaxLength
  public getListDisplayMaxLength(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.listDisplayMaxLength);
  }

  public ListDisplayMaxLengthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.listDisplayMaxLength);
  }

  public setListDisplayMaxLength(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.listDisplayMaxLength = value;
    });
  }

  // ListType
  public getListType(): DataSourceType | undefined {
    return this.getValue<DataSourceType | undefined>((data: PropertyData) => data.listType);
  }

  public getListTypeForLayer(layer: PropertyLayer): DataSourceType | undefined {
    return this.getValueForLayer<DataSourceType | undefined>(layer, (data: PropertyData) => data.listType);
  }

  public setListType(layer: PropertyLayer, value: DataSourceType): void {
    this.setValue(layer, (data: PropertyData) => {
      data.listType = value;
    });
  }

  // MapEnterToTab
  public getMapEnterToTab(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.mapEnterToTab);
  }

  public getMapEnterToTabForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.mapEnterToTab);
  }

  public setMapEnterToTab(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.mapEnterToTab = value;
    });
  }

  // MaxDropDownWidth
  public getMaxDropDownWidth(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxDropDownWidth);
  }

  public getMaxDropDownWidthForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxDropDownWidth);
  }

  public setMaxDropDownWidth(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxDropDownWidth = value;
    });
  }

  // MaxDropDownHeight
  public getMaxDropDownHeight(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxDropDownHeight);
  }

  public getMaxDropDownHeightForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxDropDownHeight);
  }

  public setMaxDropDownHeight(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxDropDownHeight = value;
    });
  }

  // MaxSize
  public getMaxSize(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxSize);
  }

  public getMaxSizeForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxSize);
  }

  public setMaxSize(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxSize = value;
    });
  }

  // MaxScale
  public getMaxScale(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxScale);
  }

  public getMaxScaleForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxScale);
  }

  public setMaxScale(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxScale = value;
    });
  }

  // IsMultiline
  public getIsMultiline(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.multiline);
  }

  public getIsMultilineForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.multiline);
  }

  public setIsMultiline(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.multiline = value;
    });
  }

  // MaxPrec
  public getMaxPrec(): number | undefined {
    return this.getValue<number | undefined>((data: PropertyData) => data.maxPrec);
  }

  public getMaxPrecForLayer(layer: PropertyLayer): number | undefined {
    return this.getValueForLayer<number | undefined>(layer, (data: PropertyData) => data.maxPrec);
  }

  public setMaxPrec(layer: PropertyLayer, value: number): void {
    this.setValue(layer, (data: PropertyData) => {
      data.maxPrec = value;
    });
  }

  // PasswordChar
  public getPasswordChar(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.passwordChar);
  }

  public getPasswordCharForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.passwordChar);
  }

  public setPasswordChar(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.passwordChar = value;
    });
  }

  // OptimizeGeneratedLabels
  public getOptimizeGeneratedLabels(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.optimizeGeneratedLabels);
  }

  public getOptimizeGeneratedLabelsForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.optimizeGeneratedLabels);
  }

  public setOptimizeGeneratedLabels(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.optimizeGeneratedLabels = value;
    });
  }

  // ScaleMode
  public getScaleMode(): PictureScaleMode | undefined {
    return this.getValue<PictureScaleMode | undefined>((data: PropertyData) => data.scaleMode);
  }

  public getScaleModeForLayer(layer: PropertyLayer): PictureScaleMode | undefined {
    return this.getValueForLayer<PictureScaleMode | undefined>(layer, (data: PropertyData) => data.scaleMode);
  }

  public setScaleMode(layer: PropertyLayer, value: PictureScaleMode): void {
    this.setValue(layer, (data: PropertyData) => {
      data.scaleMode = value;
    });
  }

  // ScrollBars
  public getScrollBars(): ScrollBars | undefined {
    return this.getValue<ScrollBars | undefined>((data: PropertyData) => data.scrollBars);
  }

  public getScrollBarsForLayer(layer: PropertyLayer): ScrollBars | undefined {
    return this.getValueForLayer<ScrollBars | undefined>(layer, (data: PropertyData) => data.scrollBars);
  }

  public setScrollBars(layer: PropertyLayer, value: ScrollBars): void {
    this.setValue(layer, (data: PropertyData) => {
      data.scrollBars = value;
    });
  }

  // SelectionMode
  public getSelectionMode(): ListViewSelectionMode | undefined {
    return this.getValue<ListViewSelectionMode | undefined>((data: PropertyData) => data.selectionMode);
  }

  public getSelectionModeForLayer(layer: PropertyLayer): ListViewSelectionMode | undefined {
    return this.getValueForLayer<ListViewSelectionMode | undefined>(layer, (data: PropertyData) => data.selectionMode);
  }

  public setSelectionMode(layer: PropertyLayer, value: ListViewSelectionMode): void {
    this.setValue(layer, (data: PropertyData) => {
      data.selectionMode = value;
    });
  }

  // SelectorPosition
  public getSelectorPosition(): ListViewSelectorPosition | undefined {
    return this.getValue<ListViewSelectorPosition | undefined>((data: PropertyData) => data.selectorPosition);
  }

  public getSelectorPositionForLayer(layer: PropertyLayer): ListViewSelectorPosition | undefined {
    return this.getValueForLayer<ListViewSelectorPosition | undefined>(layer, (data: PropertyData) => data.selectorPosition);
  }

  public setSelectorPosition(layer: PropertyLayer, value: ListViewSelectionMode): void {
    this.setValue(layer, (data: PropertyData) => {
      data.selectionMode = value;
    });
  }

  // ShowCaption
  public getShowCaption(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.showCaption);
  }

  public getShowCaptionForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.showCaption);
  }

  public setShowCaption(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.showCaption = value;
    });
  }

  // SynchronizeColumns
  public getSynchronizeColumns(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.synchronizeColumns);
  }

  public getSynchronizeColumnsForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.synchronizeColumns);
  }

  public setSynchronizeColumns(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.synchronizeColumns = value;
    });
  }

  // TabAlignment
  public getTabAlignment(): TabAlignment | undefined {
    return this.getValue<TabAlignment | undefined>((data: PropertyData) => data.tabAlignment);
  }

  public getTabAlignmentForLayer(layer: PropertyLayer): TabAlignment | undefined {
    return this.getValueForLayer<TabAlignment | undefined>(layer, (data: PropertyData) => data.tabAlignment);
  }

  public setTabAlignment(layer: PropertyLayer, value: TabAlignment): void {
    this.setValue(layer, (data: PropertyData) => {
      data.tabAlignment = value;
    });
  }

  // TabStop
  public getTabStop(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.tabStop);
  }

  public getTabStopForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.tabStop);
  }

  public setTabStop(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.tabStop = value;
    });
  }

  // TemplateCss
  public getTemplateCss(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.templateCss);
  }

  public getTemplateCssForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.templateCss);
  }

  public setTemplateCss(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.templateCss = value;
    });
  }

  // TemplateHtml
  public getTemplateHtml(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.templateHtml);
  }

  public getTemplateHtmlForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.templateHtml);
  }

  public setTemplateHtml(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.templateHtml = value;
    });
  }

  // TextAlign
  public getTextAlign(): TextAlign | undefined {
    return this.getValue<TextAlign | undefined>((data: PropertyData) => data.textAlign);
  }

  public getTextAlignForLayer(layer: PropertyLayer): TextAlign | undefined {
    return this.getValueForLayer<TextAlign | undefined>(layer, (data: PropertyData) => data.textAlign);
  }

  public setTextAlign(layer: PropertyLayer, value: TextAlign): void {
    this.setValue(layer, (data: PropertyData) => {
      data.textAlign = value;
    });
  }

  // Title
  public getTitle(): string | undefined {
    return this.getValue<string | undefined>((data: PropertyData) => data.title);
  }

  public getTitleForLayer(layer: PropertyLayer): string | undefined {
    return this.getValueForLayer<string | undefined>(layer, (data: PropertyData) => data.title);
  }

  public setTitle(layer: PropertyLayer, value: string): void {
    this.setValue(layer, (data: PropertyData) => {
      data.title = value;
    });
  }

  // Visibility
  public getVisibility(): Visibility | undefined {
    return this.getValue<Visibility | undefined>((data: PropertyData) => data.visibility);
  }

  public getVisibilityForLayer(layer: PropertyLayer): Visibility | undefined {
    return this.getValueForLayer<Visibility | undefined>(layer, (data: PropertyData) => data.visibility);
  }

  public setVisibility(layer: PropertyLayer, value: Visibility): void {
    this.setValue(layer, (data: PropertyData) => {
      data.visibility = value;
    });
  }

  // IsVisible
  public getIsVisible(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.isVisible);
  }

  public getIsVisibleForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.isVisible);
  }

  public setIsVisible(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.isVisible = value;
    });
  }

  // WordWrap
  public getWordWrap(): boolean | undefined {
    return this.getValue<boolean | undefined>((data: PropertyData) => data.wordWrap);
  }

  public getWordWrapForLayer(layer: PropertyLayer): boolean | undefined {
    return this.getValueForLayer<boolean | undefined>(layer, (data: PropertyData) => data.wordWrap);
  }

  public setWordWrap(layer: PropertyLayer, value: boolean): void {
    this.setValue(layer, (data: PropertyData) => {
      data.wordWrap = value;
    });
  }

  // WrapArrangement
  public getWrapArrangement(): WrapArrangement | undefined {
    return this.getValue<WrapArrangement | undefined>((data: PropertyData) => data.wrapArrangement);
  }

  public getWrapArrangementForLayer(layer: PropertyLayer): WrapArrangement | undefined {
    return this.getValueForLayer<WrapArrangement | undefined>(layer, (data: PropertyData) => data.wrapArrangement);
  }

  public setWrapArrangement(layer: PropertyLayer, value: WrapArrangement): void {
    this.setValue(layer, (data: PropertyData) => {
      data.wrapArrangement = value;
    });
  }
}
