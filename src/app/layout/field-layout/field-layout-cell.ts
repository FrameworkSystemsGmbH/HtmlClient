import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { FieldLayoutColumn } from '@app/layout/field-layout/field-layout-column';
import { ILayoutableControlLabelTemplate } from '@app/layout/layoutable-control-label-template.interface';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';

export class FieldLayoutCell {

  private column: FieldLayoutColumn;
  private resultWidth: number;

  public constructor(
    private wrapper: LayoutableControlWrapper,
    private rowlabelTemplate: ILayoutableControlLabelTemplate
  ) { }

  public isVisible(): boolean {
    if (this.wrapper) {
      return this.wrapper.getIsLayoutVisible();
    } else {
      return true;
    }
  }

  public getMinWidth(): number {
    let minWidth = this.rowlabelTemplate ? Number.zeroIfNull(this.rowlabelTemplate.getMinWidth()) : 0;

    if (this.wrapper) {
      minWidth = Math.max(minWidth, this.wrapper.getMinLayoutWidth());
    }

    return minWidth;
  }

  public getColumnOrCellMinWidth(): number {
    if (this.column) {
      return this.column.getMinColumnWidth();
    } else {
      return this.getMinWidth();
    }
  }

  public getMaxWidth(): number {
    if (this.wrapper) {
      if (this.wrapper.getHorizontalAlignment() === HorizontalAlignment.Stretch) {
        return this.wrapper.getMaxLayoutWidth();
      } else {
        return this.wrapper.getMinLayoutWidth();
      }
    } else if (this.rowlabelTemplate) {
      return this.rowlabelTemplate.getMaxWidth();
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  public getMinHeight(): number {
    if (this.wrapper) {
      return this.wrapper.getMinLayoutHeight(this.resultWidth);
    } else {
      return 0;
    }
  }

  public getMaxHeight(): number {
    if (this.wrapper != null) {
      return this.wrapper.getMaxLayoutHeight();
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    if (this.wrapper) {
      return this.wrapper.getHorizontalAlignment();
    } else {
      return HorizontalAlignment.Left;
    }
  }

  public getAlignmentVertical(): VerticalAlignment {
    if (this.wrapper) {
      return this.wrapper.getVerticalAlignment();
    } else {
      return VerticalAlignment.Top;
    }
  }

  public getColumn(): FieldLayoutColumn {
    return this.column;
  }

  public setColumn(column: FieldLayoutColumn): void {
    this.column = column;
  }

  public getResultWidth(): number {
    return this.resultWidth;
  }

  public setResultWidth(value: number): void {
    this.resultWidth = value;
  }

  public arrange(x: number, y: number, width: number, height: number): void {
    if (this.wrapper) {
      const layoutProperties: ILayoutableProperties = this.wrapper.getLayoutableProperties();
      layoutProperties.setX(x);
      layoutProperties.setY(y);
      layoutProperties.setLayoutWidth(width);
      layoutProperties.setLayoutHeight(height);

      this.wrapper.arrangeContainer();
    }
  }
}
