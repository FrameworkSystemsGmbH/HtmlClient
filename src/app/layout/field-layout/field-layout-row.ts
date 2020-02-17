import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template.interface';
import { IFieldContainer } from 'app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control.interface';

import { LayoutableControlWrapper } from 'app/layout/layoutable-control-wrapper';
import { FieldLayoutCell } from 'app/layout/field-layout/field-layout-cell';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { Visibility } from 'app/enums/visibility';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export class FieldLayoutRow {

  private cells: Array<FieldLayoutCell>;
  private size: number;
  private labelMode: FieldRowLabelMode;
  private hasFirstColumnControl: boolean;
  private stretchable: boolean;

  private minRowHeight: number;
  private resultRowHeight: number;

  constructor(fieldRow: IFieldRowControl) {
    const fieldContainer: IFieldContainer = fieldRow.getFieldContainer();

    this.cells = new Array<FieldLayoutCell>();
    this.size = fieldRow.getFieldRowSize();
    this.labelMode = fieldRow.getFieldRowLabelMode();
    this.hasFirstColumnControl = fieldRow.getHasFirstColumnControl();

    // 1. Create layout control wrappers
    const includeInvisibleControls: boolean = fieldContainer.getSynchronizeColumns();
    const controlWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

    for (const control of fieldRow.getLayoutableControls()) {
      if (control.getCurrentVisibility() !== Visibility.Collapsed || includeInvisibleControls) {
        controlWrappers.push(new LayoutableControlWrapper(control));
      }
    }

    // 2. Create first column cell
    const rowLabelTemplate: ILayoutableControlLabelTemplate = fieldContainer.getRowLabelTemplate();
    const firstControl: LayoutableControlWrapper = controlWrappers[0];

    if (this.labelMode === FieldRowLabelMode.None
      || (this.labelMode === FieldRowLabelMode.Generated && !this.hasFirstColumnControl)
      || (this.labelMode === FieldRowLabelMode.GeneratedMerged && !this.hasFirstColumnControl)) {
      // Add empty cell
      this.cells.push(new FieldLayoutCell(null, rowLabelTemplate));
    }

    if (this.hasFirstColumnControl && (firstControl.getIsLayoutVisible() || includeInvisibleControls)) {
      this.cells.push(new FieldLayoutCell(firstControl, rowLabelTemplate));
    }

    // 3. Add remaining wrappers
    for (let i = this.hasFirstColumnControl ? 1 : 0; i < controlWrappers.length; i++) {
      const controlWrapper: LayoutableControlWrapper = controlWrappers[i];
      if (controlWrapper.getIsLayoutVisible() || includeInvisibleControls) {
        this.cells.push(new FieldLayoutCell(controlWrapper, null));
      }
    }

    // 4. Check if this row is strechable
    this.stretchable = false;
    for (const cell of this.cells) {
      if (cell.getAlignmentVertical() === VerticalAlignment.Stretch && cell.isVisible()) {
        this.stretchable = true;
        break;
      }
    }
  }

  public isStretchable(): boolean {
    return this.stretchable;
  }

  public getCells(): Array<FieldLayoutCell> {
    return this.cells;
  }

  public getCellsCount(): number {
    return this.cells.length;
  }

  public getCell(index: number): FieldLayoutCell {
    return this.cells[index];
  }

  public getSize(): number {
    return this.size;
  }

  public getLabelMode(): FieldRowLabelMode {
    return this.labelMode;
  }

  public getMinRowHeight(): number {
    return this.minRowHeight;
  }

  public setMinRowHeight(value: number): void {
    this.minRowHeight = value;
  }

  public getResultRowHeight(): number {
    return this.resultRowHeight;
  }

  public setResultRowHeight(value: number): void {
    this.resultRowHeight = value;
  }
}
