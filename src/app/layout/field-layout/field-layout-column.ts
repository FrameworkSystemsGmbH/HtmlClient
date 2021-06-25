import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { FieldLayoutCell } from '@app/layout/field-layout/field-layout-cell';

export class FieldLayoutColumn {

  private readonly _cells: Array<FieldLayoutCell>;
  private readonly _minColumnWidth: number;
  private readonly _maxColumnWidth: number;
  private readonly _horizontalStretchable: boolean;

  private _resultColumnWidth: number;
  private _minColumnHeight: number;

  public constructor(cells: Array<FieldLayoutCell>) {
    this._cells = new Array<FieldLayoutCell>();
    this._minColumnWidth = 0;
    this._maxColumnWidth = 0;
    this._horizontalStretchable = false;

    for (const cell of cells) {
      cell.setColumn(this);
      this._cells.push(cell);
      if (cell.isVisible()) {
        this._minColumnWidth = Math.max(this._minColumnWidth, cell.getMinWidth());
        if (cell.getAlignmentHorizontal() === HorizontalAlignment.Stretch) {
          this._maxColumnWidth = Math.max(this._maxColumnWidth, cell.getMaxWidth());
          this._horizontalStretchable = true;
        }
      }
    }

    if (!this._horizontalStretchable) {
      this._maxColumnWidth = this._minColumnWidth;
    } else {
      this._maxColumnWidth = Math.max(this._maxColumnWidth, this._minColumnWidth);
    }
  }

  public isHorizontalStretchable(): boolean {
    return this._horizontalStretchable;
  }

  public getCells(): Array<FieldLayoutCell> {
    return this._cells;
  }

  public getCellCount(): number {
    return this._cells.length;
  }

  public getMinColumnWidth(): number {
    return this._minColumnWidth;
  }

  public getMaxColumnWidth(): number {
    return this._maxColumnWidth;
  }

  public getMinColumnHeight(): number {
    return this._minColumnHeight;
  }

  public setMinColumnHeight(value: number): void {
    this._minColumnHeight = value;
  }

  public getResultColumnWidth(): number {
    return this._resultColumnWidth;
  }

  public setResultColumnWidth(value: number): void {
    this._resultColumnWidth = value;
  }
}
