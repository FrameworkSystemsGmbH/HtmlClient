import { WrapRow, WrapColumn, WrapContainer, WrapArrangement } from '.';
import { LayoutContainerBase, LayoutableControlWrapper, LayoutableControl, LayoutableProperties } from '..';
import { HorizontalContentAlignment, HorizontalAlignment, VerticalAlignment, VerticalContentAlignment } from '../../enums';
import { Queue, LinkedListOneWay } from '../../util';

export class WrapLayout extends LayoutContainerBase {

  private width: number = -1;
  private wrappers: Array<LayoutableControlWrapper> = null;
  private wrapRows: Array<WrapRow> = null;
  private wrapColumns: Array<WrapColumn> = null;

  constructor(container: WrapContainer) {
    super(container);
  }

  public getControl(): WrapContainer {
    return super.getControl() as WrapContainer;
  }

  private initWrappers(container: WrapContainer): void {
    this.wrapRows = null;
    this.wrapColumns = null;

    let controls: Array<LayoutableControl> = container.getLayoutableControls();
    let controlCount: number = controls.length;

    this.wrappers = new Array<LayoutableControlWrapper>(controlCount);

    for (let i = 0; i < controlCount; i++) {
      this.wrappers[i] = new LayoutableControlWrapper(controls[i]);
    }
  }

  /**
   * Gibt die minimale Breite(!) zurück.
   * Die minimale Höhe ist irrelevant und wird mit 0 angegeben,
   * da die Berechnung der minimalen Höhe über die Methode measureMinHeight(width) erfolgen muss.
   */
  public measureMinWidth(): number {
    let container: WrapContainer = this.getControl();

    this.initWrappers(container);

    // Iterate wrappers to calculate total content min width (maximum of all min widths)
    let minWidth: number = 0;

    for (let wrapper of this.wrappers) {
      // Ignore invisible items (items with min width = 0 do not have an impact)
      if (wrapper.getIsVisible()) {
        minWidth = Math.max(minWidth, wrapper.getMinLayoutWidth());
      }
    }

    if (minWidth > 0) {
      // Include horizontal insets (padding + border) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // determine at the container defined minimum size
    let containerMinWidth: number = container.getMinWidth();

    // the greater value wins: calculated minimum size for all children or defined container minimum size
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    if (this.getControl().getWrapArrangement() === WrapArrangement.Horizontal) {
      return this.measureMinHeightHorizontally(width);
    } else {
      return this.measureMinimumHeightVertically(width);
    }
  }

  private measureMinHeightHorizontally(width: number): number {
    let container: WrapContainer = this.getControl();

    this.width = width;

    // include insets (padding + border) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let hSpacing: number = container.getSpacingHorizontal();
    let vSpacing: number = container.getSpacingVertical();

    let availableWidth: number = width - insetsLeft - insetsRight;

    // build list of not "arranged" wrappers
    let pendingWrappers: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();

    for (let wrapper of this.wrappers) {
      if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
        pendingWrappers.add(wrapper);
      }
    }

    this.wrapRows = new Array<WrapRow>();

    try {
      while (!pendingWrappers.isEmpty()) {
        this.wrapRows.push(this.createWrapRow(pendingWrappers, availableWidth, hSpacing, container));
      }
    } catch (error) {
      console.error(error);
      // Im Fehlerfall fehlt ggf. eine oder mehrere WrapRows. Die bereits verarbeiteten sollen aber normal weiterverarbeitet
      // und somit letztendlich auch angezeigt werden.
      // Deshalb wird hier normal mit der Berechnung der Minimalhöhe fortgefahren.
    }

    let minHeight: number = 0;

    // content min height is the sum of all rows min height plus spacings
    if (this.wrapRows.length) {
      for (let wrapRow of this.wrapRows) {
        minHeight += wrapRow.getMinRowHeight();
      }

      minHeight += Math.max(0, this.wrapRows.length - 1) * vSpacing;
    }

    // vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // determine at the container defined minimum height
    let containerMinHeight: number = container.getMinHeight();
    // the greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  /**
   * Erzeugt eine WrapRow, die der Reihe nach so viele Wrapper enthält, wie die angegebene Breite zulässt. Dabei wird auch die Höhe der
   * WrapRow ermittelt und alle aufgenommenen Wrapper kennen ihre endgültige Breite. Die in die WrapRow aufgenommenen Wrapper werden aus
   * den pendingWrappers entfernt.
   */
  private createWrapRow(pendingWrappers: LinkedListOneWay<LayoutableControlWrapper>, availableWidth: number, hSpacing: number, container: WrapContainer): WrapRow {
    let horizontalContentAlignment: HorizontalContentAlignment = container.getContentAlignmentHorizontal();

    // as long as there are still wrappers to deal with and there is space left in this row,
    // try to add the next wrapper
    // and sum all min widths
    let neededWidth: number = 0;
    let widthExceeded: boolean = false;
    let rowWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
    let sumMinWidths: number = 0;
    let addSpacing: boolean = false;

    while (!widthExceeded && !pendingWrappers.isEmpty()) {
      let wrapper: LayoutableControlWrapper = pendingWrappers.peek();

      // add spacing if needed
      if (addSpacing) {
        neededWidth += hSpacing;
      } else {
        addSpacing = true;
      }

      neededWidth += wrapper.getMinLayoutWidth();
      widthExceeded = neededWidth > availableWidth;

      if (!widthExceeded) {
        rowWrappers.push(pendingWrappers.poll());
        sumMinWidths += wrapper.getMinLayoutWidth();
      }
    }

    if (sumMinWidths <= 0) {
      // in this situation another layout component did not do it's job!
      // (no wrapper could be placed into the row or there was a negativ min width)
      if (pendingWrappers.isEmpty()) {
        throw new Error('Cannot layout \'' + container.getName() + '\' using width = ' + this.width + ' because sumMinWidth is less or equal to zero.');
      } else {
        let msg: string = 'Cannot layout the following children for \'' + container.getName() + '\' using width = ' + this.width + ': ';
        let addComma: boolean = false;
        for (let wrapper of pendingWrappers.toArray()) {
          if (addComma) {
            msg += ', ';
          } else {
            addComma = true;
          }
          msg += wrapper.getName();
        }
        msg += '.';

        throw new Error(msg);
      }
    }

    // stretch items to fill the available width (on horizontal content alignment stretch)
    if (horizontalContentAlignment === HorizontalContentAlignment.Fill) {

      // reduce the available width by needed spacings
      availableWidth -= Math.max(0, rowWrappers.length - 1) * hSpacing;

      // calculate desired width an care about alignment and max width
      let stretchFactor: number = availableWidth / sumMinWidths;
      let todo: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();
      let allProblemsSolved: boolean = false;

      for (let wrapper of rowWrappers) {
        todo.add(wrapper);
      }

      while (!todo.isEmpty() && !allProblemsSolved) {
        allProblemsSolved = true;

        let currentTodo: Array<LayoutableControlWrapper> = todo.toArray();

        for (let wrapper of currentTodo) {
          let wrapperMinOuterWidth: number = wrapper.getMinLayoutWidth();
          let wrapperMaxOuterWidth: number = wrapper.getMaxLayoutWidth();

          if (wrapper.getAlignmentHorizontal() !== HorizontalAlignment.Stretch) {
            // alignment !== stretch => align using min width
            wrapper.setResultWidth(wrapperMinOuterWidth);
            sumMinWidths -= wrapperMinOuterWidth;
            availableWidth -= wrapperMinOuterWidth;
            stretchFactor = availableWidth / sumMinWidths;
            allProblemsSolved = false;
            todo.remove(wrapper);
          } else {
            let desiredWidth: number = wrapperMinOuterWidth * stretchFactor;
            if (wrapperMaxOuterWidth < desiredWidth) {
              // desired size conficts max size => aling using max size
              wrapper.setResultWidth(wrapperMaxOuterWidth);
              sumMinWidths -= wrapperMinOuterWidth;
              availableWidth -= wrapperMaxOuterWidth;
              stretchFactor = availableWidth / sumMinWidths;
              allProblemsSolved = false;
              todo.remove(wrapper);
            }
          }
        }
      }

      // if there are still controls not stretched, stretch them
      // they will not have any problems
      while (!todo.isEmpty()) {
        let wrapper: LayoutableControlWrapper = todo.poll();
        wrapper.setResultWidth(Math.round(stretchFactor * wrapper.getMinLayoutWidth()));

        // recalculate stretch factor to aviod rounding errors
        sumMinWidths -= wrapper.getMinLayoutWidth();
        availableWidth -= wrapper.getResultWidth();
        stretchFactor = availableWidth / sumMinWidths;
      }

    } else {
      // no horizontal stretching
      for (let wrapper of rowWrappers) {
        wrapper.setResultWidth(wrapper.getMinLayoutWidth());
      }
    }

    // calculate min row height
    let minRowHeight: number = 0;
    let maxRowHeight: number = 0;

    for (let wrapper of rowWrappers) {
      minRowHeight = Math.max(minRowHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));

      if (wrapper.getAlignmentVertical() === VerticalAlignment.Stretch) {
        maxRowHeight = Math.max(maxRowHeight, wrapper.getMaxLayoutHeight());
      } else {
        maxRowHeight = Math.max(maxRowHeight, wrapper.getMinLayoutHeightBuffered());
      }
    }

    return new WrapRow(rowWrappers, minRowHeight, maxRowHeight);
  }

  private measureMinimumHeightVertically(width: number): number {
    let container: WrapContainer = this.getControl();

    this.width = width;

    // include insets (padding) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let hSpacing: number = container.getSpacingHorizontal();
    let vSpacing: number = container.getSpacingVertical();

    let availableWidth: number = width - insetsLeft - insetsRight;

    // collect all visible wrappers having a min width (in desired order)
    let targetWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

    if (container.getInvertFlowDirection()) {
      for (let i = this.wrappers.length - 1; i >= 0; i--) {
        let wrapper: LayoutableControlWrapper = this.wrappers[i];
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          targetWrappers.push(wrapper);
        }
      }
    } else {
      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          targetWrappers.push(wrapper);
        }
      }
    }

    ///////////////////////////////////////////////////////////////
    // map wrappers to columns at minimum height
    ///////////////////////////////////////////////////////////////

    // calculate min height at min width for all target wrappers
    for (let wrapper of targetWrappers) {
      wrapper.getMinLayoutHeight(wrapper.getMinLayoutWidth());
    }

    // calculate total limits for height
    let lowerHeightLimit: number = 0;
    let upperHeightLimit: number = 1; // solutions will always be lower than the upper bound => add one to the highest valid solution
    let addSpacing: boolean = false;

    for (let wrapper of targetWrappers) {
      lowerHeightLimit = Math.max(lowerHeightLimit, wrapper.getMinLayoutHeightBuffered());

      if (addSpacing) {
        upperHeightLimit += vSpacing;
      } else {
        addSpacing = true;
      }

      upperHeightLimit += Math.max(0, wrapper.getMinLayoutHeightBuffered());
    }

    // find the minimal height where the arrangement is still ok
    let lastSuccessfulWrapColumns: Array<WrapColumn> = null;

    while (lowerHeightLimit < upperHeightLimit) {
      let currentHeight: number = lowerHeightLimit + (upperHeightLimit - lowerHeightLimit) / 2;
      let pendingWrappers: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();
      let currentWrapColumns: Array<WrapColumn> = new Array<WrapColumn>();
      let arrangementFailed: boolean = false;

      for (let wrapper of targetWrappers) {
        pendingWrappers.add(wrapper);
      }

      while (!pendingWrappers.isEmpty() && !arrangementFailed) {
        currentWrapColumns.push(this.createWrapColumn(pendingWrappers, currentHeight, vSpacing));

        let totalMinWidth: number = 0;

        currentWrapColumns.forEach(column => {
          totalMinWidth += column.getMinColumnWidth();
        });

        totalMinWidth += Math.max(0, currentWrapColumns.length - 1) * hSpacing;

        if (totalMinWidth > availableWidth) {
          lowerHeightLimit = currentHeight + 1;
          arrangementFailed = true;
        }
      }
      if (!arrangementFailed) {
        upperHeightLimit = currentHeight;
        lastSuccessfulWrapColumns = currentWrapColumns;
      }
    }

    // store result
    this.wrapColumns = lastSuccessfulWrapColumns;

    ///////////////////////////////////////////////////////////////
    // calculate column and control wrappers width to get the
    // control wrappers and columns result minimum height
    ///////////////////////////////////////////////////////////////

    // do horizontal arrangement of the columns to calculate the min height of all columns

    if (!this.wrapColumns) {
      // in this situation another layout component did not do it's job!
      // (minimum height was requested for a width less than min width)
      console.error('Wrap Column alignment failed for \'' + container.getName() + '\', requested width = ' + this.width + ', minWidth = ' + this.measureMinWidth() + '!');
      return Number.zeroIfNull(container.getMinHeight());
    }

    // stretch columns on horizontal content alignment fill
    if (container.getContentAlignmentHorizontal() === HorizontalContentAlignment.Fill) {

      availableWidth = this.width - insetsLeft - insetsRight - Math.max(0, this.wrapColumns.length - 1) * hSpacing;

      let sumMinWidths: number = 0;

      this.wrapColumns.forEach(column => {
        sumMinWidths += column.getMinColumnWidth();
      });

      // calculate column widths and then wrapper widths
      let todoColumns: LinkedListOneWay<WrapColumn> = new LinkedListOneWay<WrapColumn>();

      for (let wrapColumn of this.wrapColumns) {
        todoColumns.add(wrapColumn);
      }

      // set result width for all stretchable columns (first those exceeding max size)
      let horizontalStretchFactor: number = availableWidth / sumMinWidths;
      let allProblemsSolved: boolean = false;

      while (!todoColumns.isEmpty() && !allProblemsSolved) {
        allProblemsSolved = true;

        let currentTodo: Array<WrapColumn> = todoColumns.toArray();

        for (let wrapColumn of currentTodo) {
          let desiredWidth: number = wrapColumn.getMinColumnWidth() * horizontalStretchFactor;

          if (wrapColumn.getMaxColumnWidth() < desiredWidth) {
            wrapColumn.setResultColumnWidth(wrapColumn.getMaxColumnWidth());

            sumMinWidths -= wrapColumn.getMinColumnWidth();
            availableWidth -= wrapColumn.getResultColumnWidth();
            horizontalStretchFactor = availableWidth / sumMinWidths;
            allProblemsSolved = false;
            todoColumns.remove(wrapColumn);
          }
        }
      }

      // stretch columns without problems (concerning max size)
      while (!todoColumns.isEmpty()) {
        let wrapColumn: WrapColumn = todoColumns.poll();
        wrapColumn.setResultColumnWidth(Math.round(horizontalStretchFactor * wrapColumn.getMinColumnWidth()));

        sumMinWidths -= wrapColumn.getMinColumnWidth();
        availableWidth -= wrapColumn.getResultColumnWidth();
        horizontalStretchFactor = availableWidth / sumMinWidths;
      }

    } else {
      // no column stretching
      for (let wrapColumn of this.wrapColumns) {
        wrapColumn.setResultColumnWidth(wrapColumn.getMinColumnWidth());
      }
    }

    // for each wrap column:
    // calculate width and min height for all wrappers
    // and sum up the total height
    // set the column min height
    for (let wrapColumn of this.wrapColumns) {
      let addVSpacing: boolean = false;
      let minColumnHeight: number = 0;

      for (let wrapper of wrapColumn.getWrappers()) {
        if (addVSpacing) {
          minColumnHeight += vSpacing;
        } else {
          addVSpacing = true;
        }

        let desiredWidth: number = wrapper.getAlignmentHorizontal() === HorizontalAlignment.Stretch ? wrapColumn.getResultColumnWidth() : wrapper.getMinLayoutWidth();
        wrapper.setResultWidth(Math.min(wrapper.getMaxLayoutWidth(), desiredWidth));
        minColumnHeight += wrapper.getMinLayoutHeight(wrapper.getResultWidth());
      }

      wrapColumn.setMinColumnHeight(minColumnHeight);
    }

    ///////////////////////////////////////////////////////////////
    // calculate minimum height by analyzing all columns minimum heights
    ///////////////////////////////////////////////////////////////

    let minHeight: number = 0;
    // content min height is the maximum of all columns min heights
    if (this.wrapColumns && this.wrapColumns.length) {
      for (let wrapColumn of this.wrapColumns) {
        minHeight = Math.max(minHeight, wrapColumn.getMinColumnHeight());
      }
    }

    // vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // determine at the container defined minimum height
    let containerMinHeight: number = container.getMinHeight();
    // the greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  /**
   * Erzeugt eine WrapColumn, die der Reihe nach so viele Wrapper enthält, wie die angegebene Höhe zulässt.
   * Dabei werden auch minimale Breite und Höhe sowie die maximale Breite für die WrapColumn ermittelt.
   * Die in die WrapRow aufgenommenen Wrapper werden aus den pendingWrappers entfernt.
   * @param pendingWrappers
   * @param availableHeight
   * @param vSpacing
   * @return
   */
  private createWrapColumn(pendingWrappers: LinkedListOneWay<LayoutableControlWrapper>, availableHeight: number, vSpacing: number): WrapColumn {

    // as long as there are still wrappers to deal with and there is space left in this column,
    // try to add the next wrapper and sum all min heights
    let neededHeight: number = 0;
    let heightExceeded: boolean = false;
    let columnWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
    let minWidth: number = 0;
    let maxWidth: number = 0;
    let horizontalStretchable: boolean = false;
    let sumMinHeight: number = 0;
    let addSpacing: boolean = false;

    while (!heightExceeded && !pendingWrappers.isEmpty()) {
      let wrapper: LayoutableControlWrapper = pendingWrappers.peek();

      if (wrapper.getMinLayoutHeightBuffered() > 0) {
        // add spacing if needed
        if (addSpacing) {
          neededHeight += vSpacing;
        } else {
          addSpacing = true;
        }

        neededHeight += wrapper.getMinLayoutHeightBuffered();
        heightExceeded = neededHeight > availableHeight;

        if (!heightExceeded) {
          minWidth = Math.max(minWidth, wrapper.getMinLayoutWidth());
          maxWidth = Math.max(maxWidth, wrapper.getMaxLayoutWidth());
          sumMinHeight = neededHeight;
          horizontalStretchable = horizontalStretchable || wrapper.getAlignmentHorizontal() === HorizontalAlignment.Stretch;
          columnWrappers.push(pendingWrappers.poll());
        }
      } else {
        pendingWrappers.poll();
      }
    }

    if (!horizontalStretchable) {
      maxWidth = minWidth;
    }

    let result: WrapColumn = new WrapColumn(columnWrappers, minWidth, maxWidth);
    result.setMinColumnHeight(sumMinHeight);
    return result;
  }

  public arrange(): void {
    if (this.getControl().getWrapArrangement() === WrapArrangement.Horizontal) {
      this.arrangeHorizontally();
    } else {
      this.arrangeVertically();
    }
  }

  private arrangeHorizontally(): void {
    let container: WrapContainer = this.getControl();

    let containerWidth: number = container.getLayoutableProperties().getWidth();
    let containerHeight: number = container.getLayoutableProperties().getHeight();

    // consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    if (!this.wrapRows || !this.wrapRows.length) {
      return;
    }

    // include insets (padding) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let hSpacing: number = container.getSpacingHorizontal();
    let vSpacing: number = container.getSpacingVertical();

    // calculate height for all rows
    let availableHeight: number = containerHeight - insetsLeft - insetsRight - Math.max(0, this.wrapRows.length - 1) * vSpacing;

    if (container.getContentAlignmentVertical() === VerticalContentAlignment.Fill) {
      let sumMinHeights: number = 0;

      for (let wrapRow of this.wrapRows) {
        sumMinHeights += wrapRow.getMinRowHeight();
      }

      let verticalStretchFactor: number = availableHeight / sumMinHeights;

      let todo: LinkedListOneWay<WrapRow> = new LinkedListOneWay<WrapRow>();

      for (let wrapRow of this.wrapRows) {
        todo.add(wrapRow);
      }

      let allProblemsSolved: boolean = false;

      while (!allProblemsSolved && !todo.isEmpty()) {
        allProblemsSolved = true;

        for (let wrapRow of todo.toArray()) {
          let desiredRowHeight: number = Math.round(verticalStretchFactor * wrapRow.getMinRowHeight());
          if (desiredRowHeight > wrapRow.getMaxRowHeight()) {
            wrapRow.setResultRowHeight(wrapRow.getMaxRowHeight());
            availableHeight -= wrapRow.getResultRowHeight();
            sumMinHeights -= wrapRow.getMinRowHeight();
            verticalStretchFactor = availableHeight / sumMinHeights;
            allProblemsSolved = false;
            todo.remove(wrapRow);
          }
        }
      }

      while (!todo.isEmpty()) {
        let wrapRow: WrapRow = todo.poll();
        let desiredRowHeight: number = Math.round(verticalStretchFactor * wrapRow.getMinRowHeight());
        wrapRow.setResultRowHeight(desiredRowHeight);
        availableHeight -= desiredRowHeight;
        sumMinHeights -= wrapRow.getMinRowHeight();
        verticalStretchFactor = availableHeight / sumMinHeights;
      }

    } else {
      // no stretch mode => result height = min height
      for (let row of this.wrapRows) {
        row.setResultRowHeight(row.getMinRowHeight());
      }
    }

    // vertical start position
    let yPos: number = insetsTop;
    let verticalContentAlignment: VerticalContentAlignment = container.getContentAlignmentVertical();
    if (verticalContentAlignment === VerticalContentAlignment.Bottom) {
      yPos += availableHeight;
    } else if (verticalContentAlignment === VerticalContentAlignment.Middle) {
      yPos += availableHeight / 2;
    }

    // iterate all wrap rows
    let addVSpacing: boolean = false;

    for (let wrapRow of this.wrapRows) {
      if (addVSpacing) {
        yPos += vSpacing;
      } else {
        addVSpacing = true;
      }

      let resultRowHeight: number = wrapRow.getResultRowHeight();

      // calculate neededWidth to care about horizontal content alignment offset
      let neededWidth: number = 0;

      for (let wrapper of wrapRow.getWrappers()) {
        neededWidth += wrapper.getResultWidth();
      }

      let unusedWidth: number = this.width - insetsLeft - insetsRight - Math.max(0, wrapRow.getWrapperCount() - 1) * hSpacing - neededWidth;

      // horizontal start position
      let xPos: number = insetsLeft;
      let horizontalContentAlignment: HorizontalContentAlignment = container.getContentAlignmentHorizontal();

      if (horizontalContentAlignment === HorizontalContentAlignment.Right) {
        xPos += unusedWidth;
      } else if (horizontalContentAlignment === HorizontalContentAlignment.Center) {
        xPos += unusedWidth / 2;
      }

      // iterate all wrappers of the wrap row
      let addHSpacing: boolean = false;

      for (let wrapper of wrapRow.getWrappers()) {
        if (addHSpacing) {
          xPos += hSpacing;
        } else {
          addHSpacing = true;
        }

        let alignmentVertical: VerticalAlignment = wrapper.getAlignmentVertical();
        let desiredHeight: number = alignmentVertical === VerticalAlignment.Stretch ? resultRowHeight : wrapper.getMinLayoutHeightBuffered();
        let resultHeight: number = Math.min(desiredHeight, wrapper.getMaxLayoutHeight());

        // calculate offset (caused by vertical alignment)
        let yOffset: number = 0;

        if (alignmentVertical === VerticalAlignment.Bottom) {
          yOffset = resultRowHeight - resultHeight;
        } else if (alignmentVertical === VerticalAlignment.Middle) {
          yOffset = (resultRowHeight - resultHeight) / 2;
        }

        let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
        layoutableProperties.setX(xPos);
        layoutableProperties.setY(yPos + yOffset);
        layoutableProperties.setWidth(wrapper.getResultWidth());
        layoutableProperties.setHeight(resultHeight);

        xPos += wrapper.getResultWidth();
      }

      yPos += resultRowHeight;
    }
  }

  private arrangeVertically(): void {
    let container: WrapContainer = this.getControl();

    let containerWidth: number = container.getLayoutableProperties().getWidth();
    let containerHeight: number = container.getLayoutableProperties().getHeight();

    // consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    if (!this.wrapColumns || !this.wrapColumns.length) {
      return;
    }

    // include insets (padding) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let hSpacing: number = container.getSpacingHorizontal();
    let vSpacing: number = container.getSpacingVertical();

    let neededWidth: number = 0;

    for (let wrapColumn of this.wrapColumns) {
      neededWidth += wrapColumn.getResultColumnWidth();
    }

    neededWidth += Math.max(0, this.wrapColumns.length - 1) * hSpacing;

    let columnXPos: number = insetsLeft;
    let horizontalContentAlignment: HorizontalContentAlignment = container.getContentAlignmentHorizontal();

    if (horizontalContentAlignment === HorizontalContentAlignment.Right) {
      // add difference between neededWidth and available width
      columnXPos += this.width - insetsLeft - insetsRight - neededWidth;
    } else if (horizontalContentAlignment === HorizontalContentAlignment.Center) {
      // add half of the difference between neededWidth and available width
      columnXPos += (this.width - insetsLeft - insetsRight - neededWidth) / 2;
    }

    // for all columns ...
    let fillContentVertically: boolean = container.getContentAlignmentVertical() === VerticalContentAlignment.Fill;
    let addHSpacing: boolean = false;

    for (let wrapColumn of this.wrapColumns) {
      let availableHeight: number = containerHeight - insetsTop - insetsBottom - Math.max(0, wrapColumn.getWrapperCount() - 1) * vSpacing;

      // 1. calculate result heights for all wrappers
      if (fillContentVertically) {
        let sumMinHeights: number = 0;
        let todo: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();

        for (let wrapper of wrapColumn.getWrappers()) {
          if (wrapper.getAlignmentVertical() !== VerticalAlignment.Stretch) {
            wrapper.setResultHeight(wrapper.getMinLayoutHeightBuffered());
            availableHeight -= wrapper.getResultHeight();
          } else {
            sumMinHeights += wrapper.getMinLayoutHeightBuffered();
            todo.add(wrapper);
          }
        }

        let verticalStretchFactor: number = availableHeight / sumMinHeights;

        let allProblemsSolved: boolean = false;

        while (!todo.isEmpty() && !allProblemsSolved) {
          allProblemsSolved = true;

          for (let wrapper of todo.toArray()) {
            let desiredHeight: number = Math.round(verticalStretchFactor * wrapper.getMinLayoutHeightBuffered());
            if (desiredHeight > wrapper.getMaxLayoutHeight()) {
              wrapper.setResultHeight(wrapper.getMaxLayoutHeight());
              sumMinHeights -= wrapper.getMinLayoutHeightBuffered();
              availableHeight -= wrapper.getResultHeight();
              verticalStretchFactor = availableHeight / sumMinHeights;
              allProblemsSolved = false;
              todo.remove(wrapper);
            }
          }
        }

        while (!todo.isEmpty()) {
          let wrapper: LayoutableControlWrapper = todo.poll();
          wrapper.setResultHeight(Math.round(verticalStretchFactor * wrapper.getMinLayoutHeightBuffered()));
          sumMinHeights -= wrapper.getMinLayoutHeightBuffered();
          availableHeight -= wrapper.getResultHeight();
          verticalStretchFactor = availableHeight / sumMinHeights;
        }
      } else {
        // do not fill content vertically
        for (let wrapper of wrapColumn.getWrappers()) {
          wrapper.setResultHeight(wrapper.getMinLayoutHeightBuffered());
        }
      }

      // 2. do alignment
      if (addHSpacing) {
        columnXPos += hSpacing;
      } else {
        addHSpacing = true;
      }

      let yPos: number = insetsTop;
      let verticalContentAlignment: VerticalContentAlignment = container.getContentAlignmentVertical();

      if (verticalContentAlignment === VerticalContentAlignment.Bottom) {
        // add unused vertical space
        yPos += availableHeight;
      } else if (verticalContentAlignment === VerticalContentAlignment.Middle) {
        // add half of the unused vertical space
        yPos += availableHeight / 2;
      }

      let addVSpacing: boolean = false;

      for (let wrapper of wrapColumn.getWrappers()) {
        if (addVSpacing) {
          yPos += vSpacing;
        } else {
          addVSpacing = true;
        }

        let xOffset: number = 0;
        let hAlignment: HorizontalAlignment = wrapper.getAlignmentHorizontal();
        if (hAlignment === HorizontalAlignment.Right) {
          xOffset = wrapColumn.getResultColumnWidth() - wrapper.getResultWidth();
        } else if (hAlignment === HorizontalAlignment.Center) {
          xOffset = (wrapColumn.getResultColumnWidth() - wrapper.getResultWidth()) / 2;
        }

        let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
        layoutableProperties.setX(columnXPos + xOffset);
        layoutableProperties.setY(yPos);
        layoutableProperties.setWidth(wrapper.getResultWidth());
        layoutableProperties.setHeight(wrapper.getResultHeight());

        yPos += wrapper.getResultHeight();
      }

      columnXPos += wrapColumn.getResultColumnWidth();
    }
  }
}
