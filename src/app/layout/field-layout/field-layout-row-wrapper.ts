import { IFieldContainer } from './field-container';
import { FieldLayoutCellWrapper } from './field-layout-cell-wrapper';
import { IFieldRowControl } from './field-row-control';
import { FieldRowLabelMode } from './field-row-label-mode';
import { ILayoutableControlLabel } from '../layoutable-control-label';
import { LayoutableControlWrapper } from '../layoutable-control-wrapper';
import { ILayoutableControlLabelTemplate } from '../layoutable-control-label-template';
import { ControlVisibility } from '../../enums/control-visibility';
import { VerticalAlignment } from '../../enums/vertical-alignment';
/**
 * Diese Klasse stellt eine Zeile eines FieldPanels dar. Sie besteht im Wesentlichen aus CellWrappern
 * und kennt den LabelMode.
 * Die Eigenschaften MinRowHeight, MaxRowHeight und ResultRowHeight können gesetzt/gepuffert werden.
 */
export class FieldLayoutRowWrapper {
  private cells: Array<FieldLayoutCellWrapper>;
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
   */
  constructor(fieldRow: IFieldRowControl, controlLabels: Array<ILayoutableControlLabel>) {
    const fieldContainer: IFieldContainer = fieldRow.getFieldContainer();

    this.cells = new Array<FieldLayoutCellWrapper>();
    this.size = fieldRow.getFieldRowSize();
    this.labelMode = fieldRow.getFieldRowLabelMode();

    // 1. create layout control wrapper
    const includeInvisibleControls: boolean = fieldContainer.getSynchronizeColumns();
    const controlWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

    for (const control of fieldRow.getLayoutableControls()) {
      if (control.getVisibility() !== ControlVisibility.Collapsed || includeInvisibleControls) {
        controlWrappers.push(new LayoutableControlWrapper(control));
      }
    }

    // 2. create first column cell
    const rowLabelTemplate: ILayoutableControlLabelTemplate = fieldContainer.getRowLabelTemplate();

    switch (this.labelMode) {
      case FieldRowLabelMode.GeneratedMerged:
      const mergedLabel: ILayoutableControlLabel = fieldRow.getControlLabel();
        if (mergedLabel != null) {
          mergedLabel.setParent(fieldContainer);
          controlLabels.remove(mergedLabel);
        }
        this.cells.push(new FieldLayoutCellWrapper(null, mergedLabel, rowLabelTemplate));
        break;

      case FieldRowLabelMode.Generated:
        let generatedLabel: ILayoutableControlLabel = null;
        for (const wrapper of controlWrappers) {
          if (wrapper.getIsVisible()) {
            if (wrapper.getLabelTemplate().getIsVisible()) {
              generatedLabel = wrapper.getControlLabel();
            }
            if (generatedLabel != null) {
              generatedLabel.setParent(fieldContainer);
              controlLabels.remove(generatedLabel);
            }
            break;
          }
        }
        this.cells.push(new FieldLayoutCellWrapper(null, generatedLabel, rowLabelTemplate));
        break;

      case FieldRowLabelMode.None:
        // insert empty cell
        this.cells.push(new FieldLayoutCellWrapper(null, null, rowLabelTemplate));
        break;

      case FieldRowLabelMode.NoneAligned:
        for (const wrapper of controlWrappers) {
          if (wrapper.getIsVisible() || includeInvisibleControls) {
            this.cells.push(new FieldLayoutCellWrapper(wrapper, null, rowLabelTemplate));
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
    const generateLabels: boolean = this.labelMode === FieldRowLabelMode.Generated;

    for (const wrapper of controlWrappers) {
      if (isFirst) {
        // in case of labelMode=none-aligned the first control wrapper was already inserted
        if (this.labelMode !== FieldRowLabelMode.NoneAligned) {
          this.cells.push(new FieldLayoutCellWrapper(wrapper, null, null));
        }
        isFirst = false;
      } else {
        if (generateLabels) {
          const controlLabel: ILayoutableControlLabel = wrapper.getControlLabel();
          if (controlLabel != null) {
            // ignore invisible generated labels
            if (wrapper.getLabelTemplate().getIsVisible()) {
              controlLabel.setParent(fieldContainer);
              controlLabels.remove(controlLabel);
              this.cells.push(new FieldLayoutCellWrapper(null, controlLabel, null));
            }
          }
        }
        this.cells.push(new FieldLayoutCellWrapper(wrapper, null, null));
      }
    }

    // is this row stretchable?
    this.stretchable = false;
    for (const cell of this.cells) {
      if (cell.getAlignmentVertical() === VerticalAlignment.Stretch && cell.isVisible()) {
        this.stretchable = true;
        break;
      }
    }
  }

  public getCells(): Array<FieldLayoutCellWrapper> {
    return this.cells;
  }

  public getCellsCount(): number {
    return this.cells.length;
  }

  public getCell(index: number): FieldLayoutCellWrapper {
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
   */
  public setResultRowHeight(value: number): void {
    this.resultRowHeight = value;
  }
}
