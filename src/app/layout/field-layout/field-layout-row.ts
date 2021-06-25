import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { Visibility } from '@app/enums/visibility';
import { IFieldContainer } from '@app/layout/field-layout/field-container.interface';
import { FieldLayoutCell } from '@app/layout/field-layout/field-layout-cell';
import { IFieldRowControl } from '@app/layout/field-layout/field-row-control.interface';
import { FieldRowLabelMode } from '@app/layout/field-layout/field-row-label-mode';
import { ILayoutableControlLabelTemplate } from '@app/layout/layoutable-control-label-template.interface';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';

export class FieldLayoutRow {

  private readonly _cells: Array<FieldLayoutCell>;
  private readonly _size: number;
  private readonly _labelMode: FieldRowLabelMode;
  private readonly _hasFirstColumnControl: boolean;
  private readonly _stretchable: boolean;

  private _minRowHeight: number;
  private _resultRowHeight: number;

  public constructor(fieldRow: IFieldRowControl) {
    const fieldContainer: IFieldContainer = fieldRow.getFieldContainer();

    this._cells = new Array<FieldLayoutCell>();
    this._size = fieldRow.getFieldRowSize();
    this._labelMode = fieldRow.getFieldRowLabelMode();
    this._hasFirstColumnControl = fieldRow.getHasFirstColumnControl();

    // 1. Create layout control wrappers
    const synchronizedColumns: boolean = fieldContainer.getSynchronizeColumns();
    const controlWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

    for (const control of fieldRow.getLayoutableControls()) {
      if (control.getCurrentVisibility() !== Visibility.Collapsed || synchronizedColumns) {
        controlWrappers.push(new LayoutableControlWrapper(control));
      }
    }

    // 2. Create first column cell
    const rowLabelTemplate: ILayoutableControlLabelTemplate = fieldContainer.getRowLabelTemplate();
    const firstControl: LayoutableControlWrapper = controlWrappers[0];

    if (this._labelMode === FieldRowLabelMode.None
      || this._labelMode === FieldRowLabelMode.Generated && !this._hasFirstColumnControl
      || this._labelMode === FieldRowLabelMode.GeneratedMerged && !this._hasFirstColumnControl) {
      // Add empty cell
      this._cells.push(new FieldLayoutCell(null, rowLabelTemplate));
    }

    if (this._hasFirstColumnControl && (firstControl.getIsLayoutVisible() || synchronizedColumns && firstControl.getIsSynchronizedVisible())) {
      this._cells.push(new FieldLayoutCell(firstControl, rowLabelTemplate));
    }

    // 3. Add remaining wrappers
    for (let i = this._hasFirstColumnControl ? 1 : 0; i < controlWrappers.length; i++) {
      const controlWrapper: LayoutableControlWrapper = controlWrappers[i];
      if (controlWrapper.getIsLayoutVisible() || synchronizedColumns && controlWrapper.getIsSynchronizedVisible()) {
        this._cells.push(new FieldLayoutCell(controlWrapper, null));
      }
    }

    // 4. Check if this row is strechable
    this._stretchable = false;
    for (const cell of this._cells) {
      if (cell.getAlignmentVertical() === VerticalAlignment.Stretch && cell.isVisible()) {
        this._stretchable = true;
        break;
      }
    }
  }

  public isStretchable(): boolean {
    return this._stretchable;
  }

  public getCells(): Array<FieldLayoutCell> {
    return this._cells;
  }

  public getCellsCount(): number {
    return this._cells.length;
  }

  public getCell(index: number): FieldLayoutCell {
    return this._cells[index];
  }

  public getSize(): number {
    return this._size;
  }

  public getLabelMode(): FieldRowLabelMode {
    return this._labelMode;
  }

  public getMinRowHeight(): number {
    return this._minRowHeight;
  }

  public setMinRowHeight(value: number): void {
    this._minRowHeight = value;
  }

  public getResultRowHeight(): number {
    return this._resultRowHeight;
  }

  public setResultRowHeight(value: number): void {
    this._resultRowHeight = value;
  }
}
