import { FieldCellWrapper, FieldRowLabelMode, FieldContainer, FieldRowControl } from '.';
import { LayoutControlLabel, LayoutControl, LayoutControlWrapper, LayoutControlLabelTemplate } from '..';
import { ControlVisibility, VerticalAlignment } from '../../enums';

/**
 * Diese Klasse stellt eine Zeile eines FieldPanels dar. Sie besteht im Wesentlichen aus CellWrappern
 * und kennt den LabelMode.
 * Die Eigenschaften MinRowHeight, MaxRowHeight und ResultRowHeight können gesetzt/gepuffert werden.
 */
export class FieldRowWrapper {
  private cells: Array<FieldCellWrapper>;
  private size: number;
  private labelMode: FieldRowLabelMode;
  private stretchable: boolean;

  private minRowHeight: number;
  private resultRowHeight: number;

  /**
   * Erzeugt einen FieldRowWrapper zur angegebenen UIFieldRow und puffert das zugehörige rowLabelTemplate.
   * Für alle Elemente der UIFieldRow werden die LayoutControlWrapper erzeugt.
   * Es werden alle Zellen der FieldRow inklusive benötigter Leerzellen aufgebaut.
   * (FieldColumnWrapper werden nicht erzeugt.)
   * @param fieldRow
   * @param controlLabelsToDelete
   */
  constructor(fieldRow: FieldRowControl, controlLabelsToDelete: Array<LayoutControlLabel>) {
    let fieldContainer: FieldContainer = fieldRow.getLayoutParent();

    this.cells = new Array<FieldCellWrapper>();
    this.size = fieldRow.getFieldRowSize();
    this.labelMode = fieldRow.getFieldRowLabelMode();

    // 1. create layout control wrapper
    let includeInvisibleControls: boolean = fieldContainer.getSynchronizeColumns();
    let controlWrappers: Array<LayoutControlWrapper> = new Array<LayoutControlWrapper>();

    for (let wrapper of fieldRow.getLayoutableControls()) {
      if (wrapper.getVisibility() !== ControlVisibility.Collapsed || includeInvisibleControls) {
        controlWrappers.push(new LayoutControlWrapper(wrapper));
      }
    }

    // 2. create first column cell
    let rowLabelTemplate: LayoutControlLabelTemplate = fieldContainer.getRowLabelTemplate();

    switch (this.labelMode) {
      case FieldRowLabelMode.GeneratedMerged:
        let mergedLabel: LayoutControlLabel = fieldRow.getControlLabel();
        if (mergedLabel != null) {
          mergedLabel.setParent(fieldContainer);
          controlLabelsToDelete.remove(mergedLabel);
        }
        this.cells.push(new FieldCellWrapper(null, mergedLabel, rowLabelTemplate));
        break;

      case FieldRowLabelMode.Generated:
        let generatedLabel: LayoutControlLabel = null;
        for (let wrapper of controlWrappers) {
          if (wrapper.getIsVisible()) {
            if (wrapper.getLabelTemplate().getIsVisible()) {
              generatedLabel = wrapper.getControlLabel();
            }
            if (generatedLabel != null) {
              generatedLabel.setParent(fieldContainer);
              controlLabelsToDelete.remove(generatedLabel);
            }
            break;
          }
        }
        this.cells.push(new FieldCellWrapper(null, generatedLabel, rowLabelTemplate));
        break;

      case FieldRowLabelMode.None:
        // insert empty cell
        this.cells.push(new FieldCellWrapper(null, null, rowLabelTemplate));
        break;

      case FieldRowLabelMode.NoneAligned:
        for (let wrapper of controlWrappers) {
          if (wrapper.getIsVisible() || includeInvisibleControls) {
            this.cells.push(new FieldCellWrapper(wrapper, null, rowLabelTemplate));
            break;
          }
        }
        break;

      case FieldRowLabelMode.NoneFill:
        // do nothing (all controls will be added in the next step)
        break;
    }

    // 3. iterate wrappers and create cells for wrappers and inner generated labels
    let isFirst: boolean = true;
    let generateLabels: boolean = this.labelMode === FieldRowLabelMode.Generated;

    for (let wrapper of controlWrappers) {
      if (isFirst) {
        // in case of labelMode=none-aligned the first control wrapper was already inserted
        if (this.labelMode !== FieldRowLabelMode.NoneAligned) {
          this.cells.push(new FieldCellWrapper(wrapper, null, null));
        }
        isFirst = false;
      } else {
        if (generateLabels) {
          let controlLabel: LayoutControlLabel = wrapper.getControlLabel();
          if (controlLabel != null) {
            // ignore invisible generated labels
            if (wrapper.getLabelTemplate().getIsVisible()) {
              controlLabel.setParent(fieldContainer);
              controlLabelsToDelete.remove(controlLabel);
              this.cells.push(new FieldCellWrapper(null, controlLabel, null));
            }
          }
        }
        this.cells.push(new FieldCellWrapper(wrapper, null, null));
      }
    }

    // is this row stretchable?
    this.stretchable = false;
    for (let cell of this.cells) {
      if (cell.getAlignmentVertical() === VerticalAlignment.Stretch && cell.isVisible()) {
        this.stretchable = true;
        break;
      }
    }
  }

  public getCells(): Array<FieldCellWrapper> {
    return this.cells;
  }

  public getCellsCount(): number {
    return this.cells.length;
  }

  public getCell(index: number): FieldCellWrapper {
    return this.cells[index];
  }

  public getSize(): number {
    return this.size;
  }

  public isStretchable(): boolean {
    return this.stretchable;
  }

  /**
   * Gibt die minimale Höhe der Zeile zurück. Der Wert muss zuvor von außerhalb gesetzt werden.
   */
  public getMinRowHeight(): number {
    return this.minRowHeight;
  }

  /**
   * Setzt die minimale Höhe der Zeile.
   * @param value
   */
  public setMinRowHeight(value: number): void {
    this.minRowHeight = value;
  }

  public getLabelMode(): FieldRowLabelMode {
    return this.labelMode;
  }

  /**
   * Gibt die endgültige Höhe der Zeile zurück, in der sie arrangiert werden soll. Der Wert muss zuvor von außerhalb gesetzt werden.
   */
  public getResultRowHeight(): number {
    return this.resultRowHeight;
  }

  /**
   * Setzt die endgültige Höhe der Zeile, in der sie arrangiert werden soll.
   * @param value
   */
  public setResultRowHeight(value: number): void {
    this.resultRowHeight = value;
  }
}