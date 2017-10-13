import { FieldCellWrapper } from './field-cell-wrapper';
import { HorizontalAlignment } from '../../enums/horizontal-alignment';

/**
 * Diese Klasse stellt eine vertikale Verknüpfung von CellWrappern dar.
 * Aus allen verknüpften Zellen werden die Eigenschaften MinColumnWidth und
 * MaxColumnWidth berechnet, welche dann wiederrum für alle verknüpften Zellen
 * als MinWidth bzw. MaxWidth zu verwenden sind.
 * Außerdem können die Eigenschaften ResultColumnWidth und MinColumnHeight für die Spalte gepuffert werden.
 */
export class FieldColumnWrapper {

  private cells: Array<FieldCellWrapper>;
  private minColumnWidth: number;
  private maxColumnWidth: number;
  private horizontalStretchable: boolean;

  private resultColumnWidth: number;
  private minColumnHeight: number;

  /**
   * Erzeugt einen FieldColumnWrapper. Dieser stellt eine Spalte dar, die aus allen übergebenenn Zellen besteht.
   * An den Zellen wird dieser FieldColumnWrapper automatisch als "Column" gesetzt.
   * @param cells
   */
  constructor(cells: Array<FieldCellWrapper>) {
    this.cells = new Array<FieldCellWrapper>();
    this.minColumnWidth = 0;
    this.maxColumnWidth = 0;
    this.horizontalStretchable = false;

    for (let cell of cells) {
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

  public getCells(): Array<FieldCellWrapper> {
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

  public isHorizontalStretchable(): boolean {
    return this.horizontalStretchable;
  }

  /**
   * Gibt die minimale Höhe der der Spalte zurück. Der Wert muss zuvor von außerhalb gesetzt werden.
   */
  public getMinColumnHeight(): number {
    return this.minColumnHeight;
  }

  /**
   * Setzt die minimale Höhe der Spalte.
   * @param value
   */
  public setMinColumnHeight(value: number): void {
    this.minColumnHeight = value;
  }

  /**
   * Gibt die endgültige Breite der Spalte zurück, in der sie arrangiert werden soll. Der Wert muss zuvor von außerhalb gesetzt werden.
   */
  public getResultColumnWidth(): number {
    return this.resultColumnWidth;
  }

  /**
   * Setzt die endgültige Breite der Spalte, in der sie arrangiert werden soll.
   * @param value
   */
  public setResultColumnWidth(value: number): void {
    this.resultColumnWidth = value;
  }
}
