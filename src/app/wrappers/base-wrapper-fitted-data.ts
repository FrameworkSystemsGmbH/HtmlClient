import { BaseWrapperFitted } from './base-wrapper-fitted';
import { DataSourceType } from '../enums/datasource-type';

export abstract class BaseWrapperFittedData extends BaseWrapperFitted {

  protected minWidth: number;
  protected maxWidth: number;
  protected minHeight: number;
  protected maxHeight: number;

  protected abstract getDataMinWidth(): number;

  protected abstract getDataMaxWidth(): number;

  protected abstract getDataMinHeight(): number;

  protected abstract getDataMaxHeight(): number;

  public getDisplayMinLines(): number {
    return Number.zeroIfNull(this.propertyStore.getDisplayMinLines());
  }

  public getDisplayMaxLines(): number {
    return Number.zeroIfNull(this.propertyStore.getDisplayMaxLines());
  }

  public getDisplayMinLength(): number {
    return Number.zeroIfNull(this.propertyStore.getDisplayMinLength());
  }

  public getDisplayMaxLength(): number {
    return Number.zeroIfNull(this.propertyStore.getDisplayMaxLength());
  }

  public getDataSourceType(): DataSourceType {
    let dataSourceType: DataSourceType = this.propertyStore.getDataSourceType();
    return dataSourceType != null ? dataSourceType : DataSourceType.None;
  }

  public getIsMultiline(): boolean {
    return Boolean.falseIfNull(this.propertyStore.getIsMultiline());
  }

  protected getShouldMeasureMinWidth(specifiedWidth: number): boolean {
    return specifiedWidth == null || specifiedWidth <= 0;
  }

  protected getShouldMeasureMaxWidth(specifiedWidth: number): boolean {
    if (specifiedWidth == null || specifiedWidth <= 0) {
      return this.getDataSourceType() === DataSourceType.DateTime ? true : this.getDisplayMaxLength() > 0;
    } else {
      return false;
    }
  }

  protected getShouldMeasureMinHeight(specifiedHeight: number): boolean {
    return (specifiedHeight == null || specifiedHeight <= 0) && this.getIsMultiline();
  }
  protected getShouldMeasureMaxHeight(specifiedHeight: number): boolean {
    return (specifiedHeight == null || specifiedHeight <= 0) && this.getDisplayMaxLines() > 0;
  }

  public getMinWidth(): number {
    if (this.minWidth == null) {
      let specifiedMinWidth: number = super.getMinWidth();

      if (this.getShouldMeasureMinWidth(specifiedMinWidth)) {
        let dataMinWidth: number = this.getDataMinWidth();
        if (!dataMinWidth || dataMinWidth <= 0) {
          this.minWidth = null;
        } else {
          this.minWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + dataMinWidth + this.getPaddingRight() + this.getBorderThicknessRight()
        }
      } else {
        this.minWidth = specifiedMinWidth;
      }
    }
    return this.minWidth;
  }

  public getMaxWidth(): number {
    if (this.maxWidth == null) {
      let specifiedMaxWidth: number = super.getMaxWidth();

      if (this.getShouldMeasureMaxWidth(specifiedMaxWidth)) {
        let dataMaxWidth: number = this.getDataMaxWidth();
        if (!dataMaxWidth || dataMaxWidth <= 0) {
          this.maxWidth = null;
        } else {
          this.maxWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + dataMaxWidth + this.getPaddingRight() + this.getBorderThicknessRight()
        }
      } else {
        this.maxWidth = specifiedMaxWidth;
      }
    }
    return this.maxWidth;
  }

  public getMinHeight(): number {
    if (this.minHeight == null) {
      let specifiedMinHeight: number = super.getMinHeight();

      if (this.getShouldMeasureMinHeight(specifiedMinHeight)) {
        let dataMinHeight: number = this.getDataMinHeight();
        if (!dataMinHeight || dataMinHeight <= 0) {
          this.minHeight = null;
        } else {
          this.minHeight = this.getBorderThicknessTop() + this.getPaddingTop() + dataMinHeight + this.getPaddingBottom() + this.getBorderThicknessBottom()
        }
      } else {
        this.minHeight = specifiedMinHeight;
      }
    }
    return this.minHeight;
  }

  public getMaxHeight(): number {
    if (this.maxHeight == null) {
      let specifiedMaxHeight: number = super.getMaxHeight();

      if (this.getShouldMeasureMaxHeight(specifiedMaxHeight)) {
        let dataMaxHeight: number = this.getDataMaxHeight();
        if (!dataMaxHeight || dataMaxHeight <= 0) {
          this.maxHeight = null;
        } else {
          this.maxHeight = this.getBorderThicknessTop() + this.getPaddingTop() + dataMaxHeight + this.getPaddingBottom() + this.getBorderThicknessBottom()
        }
      } else {
        this.maxHeight = specifiedMaxHeight;
      }
    }
    return this.maxHeight;
  }
}
