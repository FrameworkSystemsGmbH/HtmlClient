import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { FieldLayoutCell } from '@app/layout/field-layout/field-layout-cell';

export class FieldLayoutColumn {

  private readonly cells: Array<FieldLayoutCell>;
  private readonly minColumnWidth: number;
  private readonly maxColumnWidth: number;
  private readonly horizontalStretchable: boolean;

  private resultColumnWidth: number;
  private minColumnHeight: number;

  public constructor(cells: Array<FieldLayoutCell>) {
    this.cells = new Array<FieldLayoutCell>();
    this.minColumnWidth = 0;
    this.maxColumnWidth = 0;
    this.horizontalStretchable = false;

    for (const cell of cells) {
      cell.setColumn(this);
      this.cells.push(cell);
      if (cell.isVisible()) {
        this.minColumnWidth = Math.max(this.minColumnWidth, cell.getMinWidth());
        if (cell.getAlignmentHorizontal() === HorizontalAlignment.Stretch) {
          this.maxColumnWidth = Math.max(this.maxColumnWidth, cell.getMaxWidth());
          this.horizontalStretchable = true;
        }
      }
    }

    if (!this.horizontalStretchable) {
      this.maxColumnWidth = this.minColumnWidth;
    } else {
      this.maxColumnWidth = Math.max(this.maxColumnWidth, this.minColumnWidth);
    }
  }

  public isHorizontalStretchable(): boolean {
    return this.horizontalStretchable;
  }

  public getCells(): Array<FieldLayoutCell> {
    return this.cells;
  }

  public getCellCount(): number {
    return this.cells.length;
  }

  public getMinColumnWidth(): number {
    return this.minColumnWidth;
  }

  public getMaxColumnWidth(): number {
    return this.maxColumnWidth;
  }

  public getMinColumnHeight(): number {
    return this.minColumnHeight;
  }

  public setMinColumnHeight(value: number): void {
    this.minColumnHeight = value;
  }

  public getResultColumnWidth(): number {
    return this.resultColumnWidth;
  }

  public setResultColumnWidth(value: number): void {
    this.resultColumnWidth = value;
  }
}
