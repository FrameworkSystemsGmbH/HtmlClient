import { IFieldContainer } from 'app/layout/field-layout/field-container.interface';
import { IFieldRowControl } from 'app/layout/field-layout/field-row-control.interface';

import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { FieldLayoutRow } from 'app/layout/field-layout/field-layout-row';
import { FieldLayoutCell } from 'app/layout/field-layout/field-layout-cell';
import { FieldLayoutColumn } from 'app/layout/field-layout/field-layout-column';
import { FieldRowLabelMode } from 'app/layout/field-layout/field-row-label-mode';
import { Visibility } from 'app/enums/visibility';
import { LinkedListOneWay } from 'app/util/linked-list-one-way';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export class FieldLayout extends LayoutContainerBase {

  private width: number = -1;
  private rows: Array<FieldLayoutRow>;
  private columns: Array<FieldLayoutColumn>;

  constructor(container: IFieldContainer) {
    super(container);
  }

  public getControl(): IFieldContainer {
    return super.getControl() as IFieldContainer;
  }

  private initRows(): void {
    const container: IFieldContainer = this.getControl();
    this.rows = new Array<FieldLayoutRow>();

    // iterate children and fill wrapper array
    for (const control of container.getLayoutableControls()) {
      const row: IFieldRowControl = control as IFieldRowControl;
      // check, if at least one control of this row is visible
      let isRowVisible: boolean = false;
      for (const rowChild of row.getLayoutableControls()) {
        if (rowChild.getCurrentVisibility() !== Visibility.Collapsed) {
          isRowVisible = true;
          break;
        }
      }

      if (isRowVisible && row.getCurrentVisibility() !== Visibility.Collapsed) {
        this.rows.push(new FieldLayoutRow(row));
      }
    }
  }

  public measureMinWidth(): number {
    const container: IFieldContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    // init rows
    this.initRows();

    // init columns in grid mode
    const isGridMode: boolean = container.getSynchronizeColumns();

    if (isGridMode) {
      this.columns = new Array<FieldLayoutColumn>();

      let maxCellCount: number = 0;
      for (const row of this.rows) {
        maxCellCount = Math.max(maxCellCount, row.getCellsCount());
      }

      // build columns for all cells
      for (let i = 0; i < maxCellCount; i++) {
        const columnCells: Array<FieldLayoutCell> = new Array<FieldLayoutCell>();
        for (const row of this.rows) {
          if (i < row.getCellsCount()) {
            columnCells.push(row.getCell(i));
          }
        }
        this.columns.push(new FieldLayoutColumn(columnCells));
      }
    }

    // sum up cell min widths (care about columns), add spacings for each row
    // and get the widest rows min width.
    const hSpacing: number = container.getSpacingHorizontal();
    let minWidth: number = 0;

    for (const row of this.rows) {
      let rowMinWidth: number = 0;
      let isFirst: boolean = true;
      for (const cell of row.getCells()) {
        if (!cell.isVisible() && !isGridMode) {
          // ignore invisible cells in normal mode
          continue;
        }

        if (isFirst) {
          rowMinWidth += cell.getColumnOrCellMinWidth();
          isFirst = false;
        } else {
          rowMinWidth += hSpacing + cell.getColumnOrCellMinWidth();
        }
      }
      minWidth = Math.max(minWidth, rowMinWidth);
    }

    if (minWidth > 0) {
      // include insets (padding + border + margin) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // determine at the container defined minimum size (including margin)
    let containerMinWidth: number = container.getMinWidth();

    if (containerMinWidth > 0) {
      containerMinWidth += container.getMarginLeft() + container.getMarginRight();
    }

    // the greater value wins: calculated minimum size for all children or defined container minimum size
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    const container: IFieldContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed || width <= 0) {
      return 0;
    }

    this.width = width;

    // include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const hSpacing: number = container.getSpacingHorizontal();
    const vSpacing: number = container.getSpacingVertical();

    // do horizontal layout => all controls know their result width
    const isGridMode: boolean = container.getSynchronizeColumns();
    let isFirstRow: boolean = true;
    let minHeight: number = 0;

    // in grid mode only: set result column width
    if (isGridMode) {
      // stretch columns horizontally
      let availableWidth: number = width - insetsLeft - insetsRight;

      // set column result width = min width for the first column and not stretchable columns
      // and update the available width (care about horizontal spacings)
      // remember columns todo
      const todo: LinkedListOneWay<FieldLayoutColumn> = new LinkedListOneWay<FieldLayoutColumn>();
      let isFirstColumn: boolean = true;

      for (const column of this.columns) {
        if (isFirstColumn) {
          column.setResultColumnWidth(column.getMinColumnWidth());
          availableWidth -= column.getResultColumnWidth();
          isFirstColumn = false;
        } else {
          if (column.isHorizontalStretchable()) {
            todo.add(column);
          } else {
            column.setResultColumnWidth(column.getMinColumnWidth());
            availableWidth -= hSpacing;
            availableWidth -= column.getResultColumnWidth();
          }
        }
      }

      // stretch columns to fill the available width

      // reduce the available width by needed spacings
      availableWidth -= Math.max(0, todo.getLength() - 1) * hSpacing;

      let sumMinWidths: number = 0;
      for (const column of todo.toArray()) {
        sumMinWidths += column.getMinColumnWidth();
      }

      // calculate desired width an care about max width
      let stretchFactor: number = availableWidth / sumMinWidths;
      let allProblemsSolved: boolean = false;
      while (!allProblemsSolved && !todo.isEmpty()) {
        allProblemsSolved = true;

        const currentTodo: Array<FieldLayoutColumn> = todo.toArray();

        for (const column of currentTodo) {
          const desiredWidth: number = stretchFactor * column.getMinColumnWidth();
          if (column.getMaxColumnWidth() < desiredWidth) {
            // desired size conficts max size => aling using max size
            column.setResultColumnWidth(column.getMaxColumnWidth());
            sumMinWidths -= column.getMinColumnWidth();
            availableWidth -= column.getMaxColumnWidth();
            stretchFactor = availableWidth / sumMinWidths;
            allProblemsSolved = false;
            todo.remove(column);
          }
        }
      }

      // if there are still column not stretched, stretch them
      // they will not have any problems
      while (!todo.isEmpty()) {
        const column: FieldLayoutColumn = todo.poll();
        column.setResultColumnWidth(Math.round(stretchFactor * column.getMinColumnWidth()));

        // recalculate stretch factor to aviod rounding errors
        sumMinWidths -= column.getMinColumnWidth();
        availableWidth -= column.getResultColumnWidth();
        stretchFactor = availableWidth / sumMinWidths;
      }
    }

    for (const row of this.rows) {
      if (isGridMode) {
        // grid mode
        for (const cell of row.getCells()) {
          if (cell.getAlignmentHorizontal() === HorizontalAlignment.Stretch) {
            cell.setResultWidth(Math.min(cell.getColumn().getResultColumnWidth(), cell.getMaxWidth()));
          } else {
            cell.setResultWidth(cell.getMinWidth());
          }
        }
      } else {
        // normal mode

        let availableWidth: number = width - insetsLeft - insetsRight;

        // set result width = min width for first cell and not stretchable cells
        // and update the available width (care about horizontal spacings)
        // remember cells todo
        const todo: LinkedListOneWay<FieldLayoutCell> = new LinkedListOneWay<FieldLayoutCell>();
        let isFirstCell: boolean = true;

        for (const cell of row.getCells()) {
          if (isFirstCell && row.getLabelMode() !== FieldRowLabelMode.NoneFill) {
            cell.setResultWidth(cell.getMinWidth());
            availableWidth -= cell.getResultWidth();
            isFirstCell = false;
          } else {
            if (cell.isVisible()) {
              if (cell.getAlignmentHorizontal() === HorizontalAlignment.Stretch) {
                todo.add(cell);
              } else {
                cell.setResultWidth(cell.getMinWidth());
                availableWidth -= hSpacing;
                availableWidth -= cell.getResultWidth();
              }
            }
          }
        }

        // stretch items to fill the available width

        // reduce the available width by needed spacings
        availableWidth -= Math.max(0, todo.getLength() - 1) * hSpacing;

        let sumMinWidths: number = 0;
        for (const cell of todo.toArray()) {
          sumMinWidths += cell.getMinWidth();
        }

        // calculate desired width an care about alignment and max width
        let stretchFactor: number = availableWidth / sumMinWidths;
        let allProblemsSolved: boolean = false;

        while (!allProblemsSolved && !todo.isEmpty()) {
          allProblemsSolved = true;

          const currentTodo: Array<FieldLayoutCell> = todo.toArray();

          for (const cell of currentTodo) {
            if (cell.getAlignmentHorizontal() !== HorizontalAlignment.Stretch) {
              // alignment != stretch => align using min width
              cell.setResultWidth(cell.getMinWidth());
              sumMinWidths -= cell.getMinWidth();
              availableWidth -= cell.getMinWidth();
              stretchFactor = availableWidth / sumMinWidths;
              allProblemsSolved = false;
              todo.remove(cell);
            } else {
              const desiredWidth: number = stretchFactor * cell.getMinWidth();
              if (cell.getMaxWidth() < desiredWidth) {
                // desired size conficts max size => aling using max size
                cell.setResultWidth(cell.getMaxWidth());
                sumMinWidths -= cell.getMinWidth();
                availableWidth -= cell.getMaxWidth();
                stretchFactor = availableWidth / sumMinWidths;
                allProblemsSolved = false;
                todo.remove(cell);
              }
            }
          }
        }

        // if there are still cells not stretched, stretch them
        // they will not have any problems
        while (!todo.isEmpty()) {
          const cell: FieldLayoutCell = todo.poll();
          cell.setResultWidth(Math.round(stretchFactor * cell.getMinWidth()));

          // recalculate stretch factor to aviod rounding errors
          sumMinWidths -= cell.getMinWidth();
          availableWidth -= cell.getResultWidth();
          stretchFactor = availableWidth / sumMinWidths;
        }
      }

      // For both modes:
      // 1. All result widths are now set, so calculate minimum height for all rows
      // 2. Add them up including vertical spacing
      let rowMinHeight: number = 0;

      for (const cell of row.getCells()) {
        rowMinHeight = Math.max(rowMinHeight, cell.getMinHeight());
      }

      row.setMinRowHeight(rowMinHeight);

      if (rowMinHeight > 0) {
        if (isFirstRow) {
          isFirstRow = false;
        } else {
          minHeight += vSpacing;
        }
        minHeight += rowMinHeight;
      }
    }

    // Add vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // Determine the container minimum height and add vertical margins
    let containerMinHeight: number = container.getMinHeight();

    if (containerMinHeight > 0) {
      containerMinHeight += container.getMarginTop() + container.getMarginBottom();
    }

    // The greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  public arrange(): void {
    const container: IFieldContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return;
    }

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    // include insets (padding and border) of the container
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const vSpacing: number = container.getSpacingVertical();

    let availableHeight: number = containerHeight - insetsTop - insetsBottom;

    // reduce the available height by needed spacings
    availableHeight -= Math.max(0, this.rows.length - 1) * vSpacing;

    // get sum of (visible) field row sizes
    let sumFieldRowSizes: number = 0;
    for (const row of this.rows) {
      if (row.getSize() != null && row.isStretchable()) {
        sumFieldRowSizes += row.getSize();
      }
    }

    // calculate result height for auto sized rows
    // and remember all dynamic rows to be processed later
    const todo: Array<FieldLayoutRow> = new Array<FieldLayoutRow>();
    for (const row of this.rows) {
      if (row.getSize() == null || !row.isStretchable()) {
        // auto sized rows: resultSize = minSize
        const minHeight: number = row.getMinRowHeight();
        row.setResultRowHeight(minHeight);
        availableHeight -= minHeight;
      } else {
        // dynamic rows: todo later
        todo.push(row);
      }
    }

    // calculate result height for dynamic rows respecting min and max height
    let allMinProblemsSolved: boolean = false;
    while (!todo.isEmpty() && !allMinProblemsSolved) {
      // sum up all distances below minimum
      // and remember the greatest distance item
      let hasMinFail: boolean = false;
      let maxMinFail: number = 0;
      let maxMinFailWrapper: FieldLayoutRow = null;

      for (const row of todo) {
        const rowSizeRatio: number = row.getSize() / sumFieldRowSizes;
        const desiredHeight: number = rowSizeRatio * availableHeight;
        const minFail: number = Math.max(0, row.getMinRowHeight() - desiredHeight);
        if (minFail > 0) {
          hasMinFail = true;
          if (minFail > maxMinFail) {
            maxMinFail = minFail;
            maxMinFailWrapper = row;
          }
        }
      }

      if (!hasMinFail) {
        // no problems concerning min and max size
        allMinProblemsSolved = true;
      } else {
        // min problem
        todo.remove(maxMinFailWrapper);
        maxMinFailWrapper.setResultRowHeight(maxMinFailWrapper.getMinRowHeight());
        availableHeight -= maxMinFailWrapper.getResultRowHeight();
        sumFieldRowSizes -= maxMinFailWrapper.getSize();
      }
    }

    // calculate result height for dynamic rows without problems concerning min height
    while (!todo.isEmpty()) {
      const row: FieldLayoutRow = todo.shift();
      const rowSizeRatio: number = row.getSize() / sumFieldRowSizes;
      const desiredHeight: number = Math.round(rowSizeRatio * availableHeight);
      row.setResultRowHeight(desiredHeight);
      availableHeight -= row.getResultRowHeight();
      sumFieldRowSizes -= row.getSize();
    }

    // layout rows
    let addSpacing: boolean = false;
    let yPos: number = 0;
    for (const row of this.rows) {
      if (addSpacing) {
        yPos += vSpacing;
      } else {
        addSpacing = true;
      }

      this.arrangeRow(container, row, 0, yPos);

      yPos += row.getResultRowHeight();
    }
  }

  public arrangeRow(container: IFieldContainer, row: FieldLayoutRow, x: number, y: number): void {
    const isGridMode: boolean = container.getSynchronizeColumns();
    const hSpacing: number = container.getSpacingHorizontal();

    let addSpacing: boolean = false;
    let xPos: number = x;

    for (const cell of row.getCells()) {
      const alignmentVertical: VerticalAlignment = cell.getAlignmentVertical();
      let cellHeight: number = alignmentVertical === VerticalAlignment.Stretch ? row.getResultRowHeight() : cell.getMinHeight();
      cellHeight = Math.min(cellHeight, cell.getMaxHeight());

      if (addSpacing) {
        xPos += hSpacing;
      } else {
        addSpacing = true;
      }

      // calculate vertical offset (caused by vertical cell alignment)
      let yOffset: number = 0;
      if (alignmentVertical === VerticalAlignment.Bottom) {
        yOffset = row.getResultRowHeight() - cellHeight;
      } else if (alignmentVertical === VerticalAlignment.Middle) {
        yOffset = (row.getResultRowHeight() - cellHeight) / 2;
      }

      if (isGridMode) {
        const alignmentHorizontal: HorizontalAlignment = cell.getAlignmentHorizontal();
        let xOffset: number = 0;
        if (alignmentHorizontal === HorizontalAlignment.Right) {
          xOffset = cell.getColumn().getResultColumnWidth() - cell.getResultWidth();
        } else if (alignmentHorizontal === HorizontalAlignment.Center) {
          xOffset = (cell.getColumn().getResultColumnWidth() - cell.getResultWidth()) / 2;
        }

        cell.arrange(xPos + xOffset, y + yOffset, cell.getResultWidth(), cellHeight);
        xPos += cell.getColumn().getResultColumnWidth();

      } else {
        cell.arrange(xPos, y + yOffset, cell.getResultWidth(), cellHeight);
        xPos += cell.getResultWidth();
      }
    }
  }
}
