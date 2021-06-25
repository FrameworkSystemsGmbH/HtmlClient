import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { FieldLayoutColumn } from '@app/layout/field-layout/field-layout-column';
import { ILayoutableControlLabelTemplate } from '@app/layout/layoutable-control-label-template.interface';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';

export class FieldLayoutCell {

  private _column: FieldLayoutColumn;
  private _resultWidth: number;

  public constructor(
    private readonly _wrapper: LayoutableControlWrapper,
    private readonly _rowlabelTemplate: ILayoutableControlLabelTemplate
  ) { }

  public isVisible(): boolean {
    if (this._wrapper) {
      return this._wrapper.getIsLayoutVisible();
    } else {
      return true;
    }
  }

  public getMinWidth(): number {
    let minWidth = this._rowlabelTemplate ? Number.zeroIfNull(this._rowlabelTemplate.getMinWidth()) : 0;

    if (this._wrapper) {
      minWidth = Math.max(minWidth, this._wrapper.getMinLayoutWidth());
    }

    return minWidth;
  }

  public getColumnOrCellMinWidth(): number {
    if (this._column) {
      return this._column.getMinColumnWidth();
    } else {
      return this.getMinWidth();
    }
  }

  public getMaxWidth(): number {
    if (this._wrapper) {
      if (this._wrapper.getHorizontalAlignment() === HorizontalAlignment.Stretch) {
        return this._wrapper.getMaxLayoutWidth();
      } else {
        return this._wrapper.getMinLayoutWidth();
      }
    } else if (this._rowlabelTemplate) {
      return this._rowlabelTemplate.getMaxWidth();
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  public getMinHeight(): number {
    if (this._wrapper) {
      return this._wrapper.getMinLayoutHeight(this._resultWidth);
    } else {
      return 0;
    }
  }

  public getMaxHeight(): number {
    if (this._wrapper != null) {
      return this._wrapper.getMaxLayoutHeight();
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    if (this._wrapper) {
      return this._wrapper.getHorizontalAlignment();
    } else {
      return HorizontalAlignment.Left;
    }
  }

  public getAlignmentVertical(): VerticalAlignment {
    if (this._wrapper) {
      return this._wrapper.getVerticalAlignment();
    } else {
      return VerticalAlignment.Top;
    }
  }

  public getColumn(): FieldLayoutColumn {
    return this._column;
  }

  public setColumn(column: FieldLayoutColumn): void {
    this._column = column;
  }

  public getResultWidth(): number {
    return this._resultWidth;
  }

  public setResultWidth(value: number): void {
    this._resultWidth = value;
  }

  public arrange(x: number, y: number, width: number, height: number): void {
    if (this._wrapper) {
      const layoutProperties: ILayoutableProperties = this._wrapper.getLayoutableProperties();
      layoutProperties.setX(x);
      layoutProperties.setY(y);
      layoutProperties.setLayoutWidth(width);
      layoutProperties.setLayoutHeight(height);

      this._wrapper.arrangeContainer();
    }
  }
}
