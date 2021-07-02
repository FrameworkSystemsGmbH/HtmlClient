import { DataSourceType } from '@app/enums/datasource-type';
import { FittedWrapper } from '@app/wrappers/fitted-wrapper';

export abstract class FittedDataWrapper extends FittedWrapper {

  protected minWidth: number | null = null;
  protected maxWidth: number | null = null;
  protected minHeight: number | null = null;
  protected maxHeight: number | null = null;

  public getDisplayMinLines(): number {
    return Number.zeroIfNull(this.getPropertyStore().getDisplayMinLines());
  }

  public getDisplayMaxLines(): number {
    return Number.zeroIfNull(this.getPropertyStore().getDisplayMaxLines());
  }

  public getDisplayMinLength(): number {
    return Number.zeroIfNull(this.getPropertyStore().getDisplayMinLength());
  }

  public getDisplayMaxLength(): number {
    return Number.zeroIfNull(this.getPropertyStore().getDisplayMaxLength());
  }

  public getDataSourceType(): DataSourceType {
    const dataSourceType: DataSourceType | undefined = this.getPropertyStore().getDataSourceType();
    return dataSourceType != null ? dataSourceType : DataSourceType.None;
  }

  public getIsMultiline(): boolean {
    return Boolean.falseIfNull(this.getPropertyStore().getIsMultiline());
  }

  protected getShouldMeasureMinWidth(specifiedWidth: number): boolean {
    return specifiedWidth <= 0;
  }

  protected getShouldMeasureMaxWidth(specifiedWidth: number): boolean {
    if (specifiedWidth <= 0) {
      return this.getDataSourceType() === DataSourceType.DateTime ? true : this.getDisplayMaxLength() > 0;
    } else {
      return false;
    }
  }

  protected getShouldMeasureMinHeight(specifiedHeight: number): boolean {
    return specifiedHeight <= 0 && this.getIsMultiline();
  }
  protected getShouldMeasureMaxHeight(specifiedHeight: number): boolean {
    return specifiedHeight <= 0 && this.getDisplayMaxLines() > 0;
  }

  public getMinWidth(): number {
    if (this.minWidth == null) {
      const specifiedMinWidth: number = super.getMinWidth();

      if (this.getShouldMeasureMinWidth(specifiedMinWidth)) {
        const dataMinWidth: number = this.getDataMinWidth();
        if (dataMinWidth <= 0) {
          this.minWidth = 0;
        } else {
          this.minWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + dataMinWidth + this.getPaddingRight() + this.getBorderThicknessRight();
        }
      } else {
        this.minWidth = specifiedMinWidth;
      }
    }
    return this.minWidth;
  }

  public getMaxWidth(): number {
    if (this.maxWidth == null) {
      const specifiedMaxWidth: number = super.getMaxWidth();

      if (this.getShouldMeasureMaxWidth(specifiedMaxWidth)) {
        const dataMaxWidth: number = this.getDataMaxWidth();
        if (dataMaxWidth <= 0) {
          this.maxWidth = 0;
        } else {
          this.maxWidth = this.getBorderThicknessLeft() + this.getPaddingLeft() + dataMaxWidth + this.getPaddingRight() + this.getBorderThicknessRight();
        }
      } else {
        this.maxWidth = specifiedMaxWidth;
      }
    }
    return this.maxWidth;
  }

  public getMinHeight(): number {
    if (this.minHeight == null) {
      const specifiedMinHeight: number = super.getMinHeight();

      if (this.getShouldMeasureMinHeight(specifiedMinHeight)) {
        const dataMinHeight: number = this.getDataMinHeight();
        if (dataMinHeight <= 0) {
          this.minHeight = 0;
        } else {
          this.minHeight = this.getBorderThicknessTop() + this.getPaddingTop() + dataMinHeight + this.getPaddingBottom() + this.getBorderThicknessBottom();
        }
      } else {
        this.minHeight = specifiedMinHeight;
      }
    }
    return this.minHeight;
  }

  public getMaxHeight(): number {
    if (this.maxHeight == null) {
      const specifiedMaxHeight: number = super.getMaxHeight();

      if (this.getShouldMeasureMaxHeight(specifiedMaxHeight)) {
        const dataMaxHeight: number = this.getDataMaxHeight();
        if (dataMaxHeight <= 0) {
          this.maxHeight = 0;
        } else {
          this.maxHeight = this.getBorderThicknessTop() + this.getPaddingTop() + dataMaxHeight + this.getPaddingBottom() + this.getBorderThicknessBottom();
        }
      } else {
        this.maxHeight = specifiedMaxHeight;
      }
    }
    return this.maxHeight;
  }

  public saveState(): any {
    const json: any = super.saveState();
    json.minWidth = this.minWidth;
    json.maxWidth = this.maxWidth;
    json.minHeight = this.minHeight;
    json.maxHeight = this.maxHeight;
    return json;
  }

  protected loadState(json: any): void {
    super.loadState(json);
    this.minWidth = json.minWidth;
    this.maxWidth = json.maxWidth;
    this.minHeight = json.minHeight;
    this.maxHeight = json.maxHeight;
  }

  protected abstract getDataMinWidth(): number;

  protected abstract getDataMaxWidth(): number;

  protected abstract getDataMinHeight(): number;

  protected abstract getDataMaxHeight(): number;
}
