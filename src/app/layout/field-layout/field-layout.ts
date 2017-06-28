import { FieldContainer, FieldRowWrapper, FieldColumnWrapper, FieldCellWrapper, FieldRowLabelMode } from '.';
import { LayoutContainerBase, LayoutableContainer, LayoutableControlLabel } from '..';
import { ControlVisibility, HorizontalAlignment, VerticalAlignment } from '../../enums';
import { LinkedListOneWay } from '../../util';

export class FieldLayout extends LayoutContainerBase {

  private width: number = -1;
  private rows: Array<FieldRowWrapper>;
  private columns: Array<FieldColumnWrapper>;

  constructor(container: FieldContainer) {
    super(container);
  }

  public getControl(): FieldContainer {
    return super.getControl() as FieldContainer;
  }

  private initRows(): void {
    let container: FieldContainer = this.getControl();
    this.rows = new Array<FieldRowWrapper>();

    // remember all IControlLabel children
    // those control labels, which will not be added again, have to be removed
    let controlLabels: Array<LayoutableControlLabel> = new Array<LayoutableControlLabel>();
    for (let child of container.getLayoutableControlLabels()) {
      controlLabels.push(child);
    }

    // iterate children and fill wrapper array
    for (let row of container.getLayoutableControls()) {
      // check, if at least one control of this row is visible
      let isRowVisible: boolean = false;
      for (let rowChild of row.getLayoutableControls()) {

        if (rowChild.getVisibility() !== ControlVisibility.Collapsed) {
          isRowVisible = true;
          break;
        }
      }

      if (isRowVisible && row.getVisibility() !== ControlVisibility.Collapsed) {
        this.rows.push(new FieldRowWrapper(row, controlLabels));
      }
    }

    for (let controlLabelToDelete of controlLabels) {
      container.removeChild(controlLabelToDelete);
    }
  }

  public measureMinWidth(): number {
    let container: FieldContainer = this.getControl();

    // init rows
    this.initRows();

    // init columns in grid mode
    let isGridMode: boolean = container.getSynchronizeColumns();

    if (isGridMode) {
      this.columns = new Array<FieldColumnWrapper>();

      let maxCellCount: number = 0;
      for (let row of this.rows) {
        maxCellCount = Math.max(maxCellCount, row.getCellsCount());
      }

      // build columns for all cells
      for (let i = 0; i < maxCellCount; i++) {
        let columnCells: Array<FieldCellWrapper> = new Array<FieldCellWrapper>();
        for (let row of this.rows) {
          if (row.getLabelMode() !== FieldRowLabelMode.NoneFill && i < row.getCellsCount()) {
            columnCells.push(row.getCell(i));
          }
        }
        this.columns.push(new FieldColumnWrapper(columnCells));
      }
    }

    // sum up cell min widths (care about columns), add spacings for each row
    // and get the widest rows min width.
    let hSpacing: number = container.getSpacingHorizontal();
    let minWidth: number = 0;

    for (let row of this.rows) {
      let rowMinWidth: number = 0;
      let isFirst: boolean = true;
      for (let cell of row.getCells()) {
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
      // include insets (padding) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // determine at the container defined minimum size (including margin)
    let containerMinWidth: number = container.getMinWidth() + Number.zeroIfNull(container.getMarginLeft()) + Number.zeroIfNull(container.getMarginRight());

    // the greater value wins: calculated minimum size for all children or defined container minimum size
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    this.width = width;

    let container: FieldContainer = this.getControl();

    // insets (padding and border) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let hSpacing: number = container.getSpacingHorizontal();
    let vSpacing: number = container.getSpacingVertical();

    // do horizontal layout => all controls know their result width
    let isGridMode: boolean = container.getSynchronizeColumns();
    let isFirstRow: boolean = true;
    let minHeight: number = 0;

    // in grid mode only: set result column width
    if (isGridMode) {
      // stretch columns horizontally
      let availableWidth: number = width - insetsLeft - insetsRight;

      // set column result width = min width for the first column and not stretchable columns
      // and update the available width (care about horizontal spacings)
      // remember columns todo
      let todo: LinkedListOneWay<FieldColumnWrapper> = new LinkedListOneWay<FieldColumnWrapper>();
      let isFirstColumn: boolean = true;

      for (let column of this.columns) {
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
      for (let column of todo.toArray()) {
        sumMinWidths += column.getMinColumnWidth();
      }

      // calculate desired width an care about max width
      let stretchFactor: number = availableWidth / sumMinWidths;
      let allProblemsSolved: boolean = false;
      while (!allProblemsSolved && !todo.isEmpty()) {
        allProblemsSolved = true;

        let currentTodo: Array<FieldColumnWrapper> = todo.toArray();

        for (let column of currentTodo) {
          let desiredWidth: number = stretchFactor * column.getMinColumnWidth();
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
        let column: FieldColumnWrapper = todo.poll();
        column.setResultColumnWidth(Math.round(stretchFactor * column.getMinColumnWidth()));

        // recalculate stretch factor to aviod rounding errors
        sumMinWidths -= column.getMinColumnWidth();
        availableWidth -= column.getResultColumnWidth();
        stretchFactor = availableWidth / sumMinWidths;
      }
    }

    for (let row of this.rows) {
      if (isGridMode) {
        // grid mode
        for (let cell of row.getCells()) {
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
        let todo: LinkedListOneWay<FieldCellWrapper> = new LinkedListOneWay<FieldCellWrapper>();
        let isFirstCell: boolean = true;

        for (let cell of row.getCells()) {
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
        for (let cell of todo.toArray()) {
          sumMinWidths += cell.getMinWidth();
        }

        // calculate desired width an care about alignment and max width
        let stretchFactor: number = availableWidth / sumMinWidths;
        let allProblemsSolved: boolean = false;

        while (!allProblemsSolved && !todo.isEmpty()) {
          allProblemsSolved = true;

          let currentTodo: Array<FieldCellWrapper> = todo.toArray();

          for (let cell of currentTodo) {
            if (cell.getAlignmentHorizontal() !== HorizontalAlignment.Stretch) {
              // alignment != stretch => align using min width
              cell.setResultWidth(cell.getMinWidth());
              sumMinWidths -= cell.getMinWidth();
              availableWidth -= cell.getMinWidth();
              stretchFactor = availableWidth / sumMinWidths;
              allProblemsSolved = false;
              todo.remove(cell);
            } else {
              let desiredWidth: number = stretchFactor * cell.getMinWidth();
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
          let cell: FieldCellWrapper = todo.poll();
          cell.setResultWidth(Math.round(stretchFactor * cell.getMinWidth()));

          // recalculate stretch factor to aviod rounding errors
          sumMinWidths -= cell.getMinWidth();
          availableWidth -= cell.getResultWidth();
          stretchFactor = availableWidth / sumMinWidths;
        }

      }

      // for both modes:
      // now all result widths are set, so calculate min height for all rows
      // add them including vertical spaces.
      let rowMinHeight: number = 0;
      for (let cell of row.getCells()) {
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

    return minHeight;
  }

  public arrange(): void {
    let container: FieldContainer = this.getControl();

    let containerWidth: number = container.getLayoutableProperties().getWidth();
    let containerHeight: number = container.getLayoutableProperties().getHeight();

    // consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    // include insets (padding and border) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let vSpacing: number = container.getSpacingVertical();

    let availableHeight: number = containerHeight - insetsTop - insetsBottom;

    // reduce the available height by needed spacings
    availableHeight -= Math.max(0, this.rows.length - 1) * vSpacing;

    // get sum of (visible) field row sizes
    let sumFieldRowSizes: number = 0;
    for (let row of this.rows) {
      if (row.getSize() != null && row.isStretchable()) {
        sumFieldRowSizes += row.getSize();
      }
    }

    // calculate result height for auto sized rows
    // and remember all dynamic rows to be processed later
    let todo: Array<FieldRowWrapper> = new Array<FieldRowWrapper>();
    for (let row of this.rows) {
      if (row.getSize() == null || !row.isStretchable()) {
        // auto sized rows: resultSize = minSize
        let minHeight: number = row.getMinRowHeight();
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
      let maxMinFailWrapper: FieldRowWrapper = null;

      for (let row of todo) {
        let rowSizeRatio: number = row.getSize() / sumFieldRowSizes;
        let desiredHeight: number = rowSizeRatio * availableHeight;
        let minFail: number = Math.max(0, row.getMinRowHeight() - desiredHeight);
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
      let row: FieldRowWrapper = todo.shift();
      let rowSizeRatio: number = row.getSize() / sumFieldRowSizes;
      let desiredHeight: number = Math.round(rowSizeRatio * availableHeight);
      row.setResultRowHeight(desiredHeight);
      availableHeight -= row.getResultRowHeight();
      sumFieldRowSizes -= row.getSize();
    }

    // layout rows
    let addSpacing: boolean = false;
    let yPos: number = insetsTop;
    for (let row of this.rows) {
      if (addSpacing) {
        yPos += vSpacing;
      } else {
        addSpacing = true;
      }

      this.arrangeRow(container, row, insetsLeft, yPos);

      yPos += row.getResultRowHeight();
    }
  }

  public arrangeRow(container: FieldContainer, row: FieldRowWrapper, x: number, y: number): void {
    let isGridMode: boolean = container.getSynchronizeColumns();
    let hSpacing: number = container.getSpacingHorizontal();

    let addSpacing: boolean = false;
    let xPos: number = x;

    for (let cell of row.getCells()) {
      let alignmentVertical: VerticalAlignment = cell.getAlignmentVertical();
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
        let alignmentHorizontal: HorizontalAlignment = cell.getAlignmentHorizontal();
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
