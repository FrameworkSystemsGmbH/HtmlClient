import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { HorizontalContentAlignment } from '@app/enums/horizontal-content-alignment';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { VerticalContentAlignment } from '@app/enums/vertical-content-alignment';
import { Visibility } from '@app/enums/visibility';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { WrapArrangement } from '@app/layout/wrap-layout/wrap-arrangement';
import { IWrapContainer } from '@app/layout/wrap-layout/wrap-container.interface';
import { WrapLayoutColumn } from '@app/layout/wrap-layout/wrap-layout-column';
import { WrapLayoutRow } from '@app/layout/wrap-layout/wrap-layout-row';
import { LinkedListOneWay } from '@app/util/linked-list-one-way';

export class WrapLayout extends LayoutContainerBase {

  private _width: number = -1;
  private _wrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
  private _wrapRows: Array<WrapLayoutRow> | null = null;
  private _wrapColumns: Array<WrapLayoutColumn> | null = null;

  public getControl(): IWrapContainer {
    return super.getControl() as IWrapContainer;
  }

  private initWrappers(): void {
    this._wrapRows = null;
    this._wrapColumns = null;

    const controls: Array<ILayoutableControl> = this.getControl().getLayoutableControls();
    const controlCount: number = controls.length;

    this._wrappers = new Array<LayoutableControlWrapper>(controlCount);

    for (let i = 0; i < controlCount; i++) {
      this._wrappers[i] = new LayoutableControlWrapper(controls[i]);
    }
  }

  /**
   * Gibt die minimale Breite(!) zurück.
   * Die minimale Höhe ist irrelevant und wird mit 0 angegeben,
   * da die Berechnung der minimalen Höhe über die Methode measureMinHeight(width) erfolgen muss.
   */
  public measureMinWidth(): number {
    const container: IWrapContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    this.initWrappers();

    // Iterate wrappers to calculate total content min width (maximum of all min widths)
    let minWidth: number = 0;

    for (const wrapper of this._wrappers) {
      // Ignore invisible items (items with min width = 0 do not have an impact)
      if (wrapper.getIsLayoutVisible()) {
        minWidth = Math.max(minWidth, wrapper.getMinLayoutWidth());
      }
    }

    if (minWidth > 0) {
      // Include horizontal insets (padding + border + margin) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // Determine the container minimum width and add horizontal margins
    let containerMinWidth: number = container.getMinWidth();

    if (containerMinWidth > 0) {
      containerMinWidth += container.getMarginLeft() + container.getMarginRight();
    }

    // The greater value wins: The calculated minimum width for all children or defined container minimum width
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    const container: IWrapContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed || width <= 0) {
      return 0;
    }

    if (container.getWrapArrangement() === WrapArrangement.Horizontal) {
      return this.measureMinHeightHorizontally(width);
    } else {
      return this.measureMinimumHeightVertically(width);
    }
  }

  private measureMinHeightHorizontally(width: number): number {
    const container: IWrapContainer = this.getControl();

    this._width = width;

    // include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const hSpacing: number = container.getSpacingHorizontal();
    const vSpacing: number = container.getSpacingVertical();

    const availableWidth: number = width - insetsLeft - insetsRight;

    // build list of not "arranged" wrappers
    const pendingWrappers: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();

    for (const wrapper of this._wrappers) {
      if (wrapper.getIsLayoutVisible() && wrapper.getMinLayoutWidth() > 0) {
        pendingWrappers.add(wrapper);
      }
    }

    this._wrapRows = new Array<WrapLayoutRow>();

    try {
      while (!pendingWrappers.isEmpty()) {
        this._wrapRows.push(this.createWrapRow(pendingWrappers, availableWidth, hSpacing, container));
      }
    } catch (error: unknown) {
      console.error(error);

      /*
       * Im Fehlerfall fehlt ggf. eine oder mehrere WrapRows. Die bereits verarbeiteten sollen aber normal weiterverarbeitet
       * und somit letztendlich auch angezeigt werden.
       * Deshalb wird hier normal mit der Berechnung der Minimalhöhe fortgefahren.
       */
    }

    let minHeight: number = 0;

    // content min height is the sum of all rows min height plus spacings
    if (this._wrapRows.length > 0) {
      for (const wrapRow of this._wrapRows) {
        minHeight += wrapRow.getMinRowHeight();
      }

      minHeight += Math.max(0, this._wrapRows.length - 1) * vSpacing;
    }

    // vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // Determine the container minimum height and add vertical margins
    let containerMinHeight: number = container.getMinHeight();

    if (containerMinHeight > 0) {
      containerMinHeight += container.getMarginTop() + container.getMarginBottom();
    }

    // the greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  /**
   * Erzeugt eine WrapRow, die der Reihe nach so viele Wrapper enthält, wie die angegebene Breite zulässt. Dabei wird auch die Höhe der
   * WrapRow ermittelt und alle aufgenommenen Wrapper kennen ihre endgültige Breite. Die in die WrapRow aufgenommenen Wrapper werden aus
   * den pendingWrappers entfernt.
   */
  private createWrapRow(pendingWrappers: LinkedListOneWay<LayoutableControlWrapper>, width: number, hSpacing: number, container: IWrapContainer): WrapLayoutRow {

    /*
     * as long as there are still wrappers to deal with and there is space left in this row,
     * try to add the next wrapper
     * and sum all min widths
     */
    const rowWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
    const horizontalContentAlignment: HorizontalContentAlignment = container.getHorizontalContentAlignment();

    let availableWidth: number = width;
    let neededWidth: number = 0;
    let widthExceeded: boolean = false;
    let sumMinWidths: number = 0;
    let addSpacing: boolean = false;

    while (!widthExceeded && !pendingWrappers.isEmpty()) {
      const wrapper: LayoutableControlWrapper | null = pendingWrappers.peek();
      if (wrapper != null) {
        // add spacing if needed
        if (addSpacing) {
          neededWidth += hSpacing;
        } else {
          addSpacing = true;
        }

        neededWidth += wrapper.getMinLayoutWidth();
        widthExceeded = neededWidth > availableWidth;

        if (!widthExceeded) {
          const pendingWrp: LayoutableControlWrapper | null = pendingWrappers.poll();
          if (pendingWrp != null) {
            rowWrappers.push(pendingWrp);
            sumMinWidths += wrapper.getMinLayoutWidth();
          }
        }
      }
    }

    if (sumMinWidths <= 0) {

      /*
       * in this situation another layout component did not do it's job!
       * (no wrapper could be placed into the row or there was a negativ min width)
       */
      if (pendingWrappers.isEmpty()) {
        throw new Error(`Cannot layout '${container.getName()}' using width = ${this._width} because sumMinWidth is less or equal to zero.`);
      } else {
        let msg: string = `Cannot layout the following children for '${container.getName()}' using width = ${this._width}: `;
        let addComma: boolean = false;
        for (const wrapper of pendingWrappers.toArray()) {
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
      const todo: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();
      let stretchFactor: number = availableWidth / sumMinWidths;
      let allProblemsSolved: boolean = false;

      for (const wrapper of rowWrappers) {
        todo.add(wrapper);
      }

      while (!todo.isEmpty() && !allProblemsSolved) {
        allProblemsSolved = true;

        const currentTodo: Array<LayoutableControlWrapper> = todo.toArray();

        for (const wrapper of currentTodo) {
          const wrapperMinOuterWidth: number = wrapper.getMinLayoutWidth();
          const wrapperMaxOuterWidth: number = wrapper.getMaxLayoutWidth();

          if (wrapper.getHorizontalAlignment() !== HorizontalAlignment.Stretch) {
            // alignment !== stretch => align using min width
            wrapper.setResultWidth(wrapperMinOuterWidth);
            sumMinWidths -= wrapperMinOuterWidth;
            availableWidth -= wrapperMinOuterWidth;
            stretchFactor = availableWidth / sumMinWidths;
            allProblemsSolved = false;
            todo.remove(wrapper);
          } else {
            const desiredWidth: number = wrapperMinOuterWidth * stretchFactor;
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

      /*
       * if there are still controls not stretched, stretch them
       * they will not have any problems
       */
      while (!todo.isEmpty()) {
        const wrapper: LayoutableControlWrapper | null = todo.poll();
        if (wrapper != null) {
          wrapper.setResultWidth(Math.round(stretchFactor * wrapper.getMinLayoutWidth()));

          // recalculate stretch factor to aviod rounding errors
          sumMinWidths -= wrapper.getMinLayoutWidth();
          availableWidth -= wrapper.getResultWidth();
          stretchFactor = availableWidth / sumMinWidths;
        }
      }

    } else {
      // no horizontal stretching
      for (const wrapper of rowWrappers) {
        wrapper.setResultWidth(wrapper.getMinLayoutWidth());
      }
    }

    // calculate min row height
    let minRowHeight: number = 0;
    let maxRowHeight: number = 0;

    for (const wrapper of rowWrappers) {
      minRowHeight = Math.max(minRowHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));

      if (wrapper.getVerticalAlignment() === VerticalAlignment.Stretch) {
        maxRowHeight = Math.max(maxRowHeight, wrapper.getMaxLayoutHeight());
      } else {
        maxRowHeight = Math.max(maxRowHeight, wrapper.getMinLayoutHeightBuffered());
      }
    }

    return new WrapLayoutRow(rowWrappers, minRowHeight, maxRowHeight);
  }

  private measureMinimumHeightVertically(width: number): number {
    const container: IWrapContainer = this.getControl();

    this._width = width;

    // include insets (padding) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const hSpacing: number = container.getSpacingHorizontal();
    const vSpacing: number = container.getSpacingVertical();

    let availableWidth: number = width - insetsLeft - insetsRight;

    // collect all visible wrappers having a min width (in desired order)
    const targetWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

    if (container.getInvertFlowDirection()) {
      for (let i = this._wrappers.length - 1; i >= 0; i--) {
        const wrapper: LayoutableControlWrapper = this._wrappers[i];
        if (wrapper.getIsLayoutVisible() && wrapper.getMinLayoutWidth() > 0) {
          targetWrappers.push(wrapper);
        }
      }
    } else {
      for (const wrapper of this._wrappers) {
        if (wrapper.getIsLayoutVisible() && wrapper.getMinLayoutWidth() > 0) {
          targetWrappers.push(wrapper);
        }
      }
    }

    // map wrappers to columns at minimum height

    // calculate min height at min width for all target wrappers
    for (const wrapper of targetWrappers) {
      wrapper.getMinLayoutHeight(wrapper.getMinLayoutWidth());
    }

    // calculate total limits for height
    let lowerHeightLimit: number = 0;
    let upperHeightLimit: number = 1; // solutions will always be lower than the upper bound => add one to the highest valid solution
    let addSpacing: boolean = false;

    for (const wrapper of targetWrappers) {
      lowerHeightLimit = Math.max(lowerHeightLimit, wrapper.getMinLayoutHeightBuffered());

      if (addSpacing) {
        upperHeightLimit += vSpacing;
      } else {
        addSpacing = true;
      }

      upperHeightLimit += Math.max(0, wrapper.getMinLayoutHeightBuffered());
    }

    // find the minimal height where the arrangement is still ok
    let lastSuccessfulWrapColumns: Array<WrapLayoutColumn> | null = null;

    while (lowerHeightLimit < upperHeightLimit) {
      const currentHeight: number = lowerHeightLimit + (upperHeightLimit - lowerHeightLimit) / 2;
      const pendingWrappers: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();
      const currentWrapColumns: Array<WrapLayoutColumn> = new Array<WrapLayoutColumn>();
      let arrangementFailed: boolean = false;

      for (const wrapper of targetWrappers) {
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
    this._wrapColumns = lastSuccessfulWrapColumns;

    /*
     * calculate column and control wrappers width to get the
     * control wrappers and columns result minimum height
     */

    // do horizontal arrangement of the columns to calculate the min height of all columns

    if (!this._wrapColumns) {

      /*
       * in this situation another layout component did not do it's job!
       * (minimum height was requested for a width less than min width)
       */
      console.error(`Wrap Column alignment failed for '${container.getName()}', requested width = ${this._width}, minWidth = ${this.measureMinWidth()}!`);
      return Number.zeroIfNull(container.getMinHeight());
    }

    // stretch columns on horizontal content alignment fill
    if (container.getHorizontalContentAlignment() === HorizontalContentAlignment.Fill) {

      availableWidth = this._width - insetsLeft - insetsRight - Math.max(0, this._wrapColumns.length - 1) * hSpacing;

      let sumMinWidths: number = 0;

      this._wrapColumns.forEach(column => {
        sumMinWidths += column.getMinColumnWidth();
      });

      // calculate column widths and then wrapper widths
      const todoColumns: LinkedListOneWay<WrapLayoutColumn> = new LinkedListOneWay<WrapLayoutColumn>();

      for (const wrapColumn of this._wrapColumns) {
        todoColumns.add(wrapColumn);
      }

      // set result width for all stretchable columns (first those exceeding max size)
      let horizontalStretchFactor: number = availableWidth / sumMinWidths;
      let allProblemsSolved: boolean = false;

      while (!todoColumns.isEmpty() && !allProblemsSolved) {
        allProblemsSolved = true;

        const currentTodo: Array<WrapLayoutColumn> = todoColumns.toArray();

        for (const wrapColumn of currentTodo) {
          const desiredWidth: number = wrapColumn.getMinColumnWidth() * horizontalStretchFactor;

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
        const wrapColumn: WrapLayoutColumn | null = todoColumns.poll();
        if (wrapColumn != null) {
          wrapColumn.setResultColumnWidth(Math.round(horizontalStretchFactor * wrapColumn.getMinColumnWidth()));

          sumMinWidths -= wrapColumn.getMinColumnWidth();
          availableWidth -= wrapColumn.getResultColumnWidth();
          horizontalStretchFactor = availableWidth / sumMinWidths;
        }
      }

    } else {
      // no column stretching
      for (const wrapColumn of this._wrapColumns) {
        wrapColumn.setResultColumnWidth(wrapColumn.getMinColumnWidth());
      }
    }

    /*
     * for each wrap column:
     * calculate width and min height for all wrappers
     * and sum up the total height
     * set the column min height
     */
    for (const wrapColumn of this._wrapColumns) {
      let addVSpacing: boolean = false;
      let minColumnHeight: number = 0;

      for (const wrapper of wrapColumn.getWrappers()) {
        if (addVSpacing) {
          minColumnHeight += vSpacing;
        } else {
          addVSpacing = true;
        }

        const desiredWidth: number = wrapper.getHorizontalAlignment() === HorizontalAlignment.Stretch ? wrapColumn.getResultColumnWidth() : wrapper.getMinLayoutWidth();
        wrapper.setResultWidth(Math.min(wrapper.getMaxLayoutWidth(), desiredWidth));
        minColumnHeight += wrapper.getMinLayoutHeight(wrapper.getResultWidth());
      }

      wrapColumn.setMinColumnHeight(minColumnHeight);
    }

    // calculate minimum height by analyzing all columns minimum heights

    let minHeight: number = 0;
    // content min height is the maximum of all columns min heights
    if (this._wrapColumns.length > 0) {
      for (const wrapColumn of this._wrapColumns) {
        minHeight = Math.max(minHeight, wrapColumn.getMinColumnHeight());
      }
    }

    // vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // Determine the container minimum height and add vertical margins
    const containerMinHeight: number = container.getMinHeight() + container.getMarginTop() + container.getMarginBottom();

    // the greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  /**
   * Erzeugt eine WrapColumn, die der Reihe nach so viele Wrapper enthält, wie die angegebene Höhe zulässt.
   * Dabei werden auch minimale Breite und Höhe sowie die maximale Breite für die WrapColumn ermittelt.
   * Die in die WrapRow aufgenommenen Wrapper werden aus den pendingWrappers entfernt.
   */
  private createWrapColumn(pendingWrappers: LinkedListOneWay<LayoutableControlWrapper>, availableHeight: number, vSpacing: number): WrapLayoutColumn {

    /*
     * as long as there are still wrappers to deal with and there is space left in this column,
     * try to add the next wrapper and sum all min heights
     */
    const columnWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

    let neededHeight: number = 0;
    let heightExceeded: boolean = false;
    let minWidth: number = 0;
    let maxWidth: number = 0;
    let horizontalStretchable: boolean = false;
    let sumMinHeight: number = 0;
    let addSpacing: boolean = false;

    while (!heightExceeded && !pendingWrappers.isEmpty()) {
      const wrapper: LayoutableControlWrapper | null = pendingWrappers.peek();
      if (wrapper != null) {
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
            horizontalStretchable ||= wrapper.getHorizontalAlignment() === HorizontalAlignment.Stretch;
            const pendingWrp: LayoutableControlWrapper | null = pendingWrappers.poll();
            if (pendingWrp != null) {
              columnWrappers.push(pendingWrp);
            }
          }
        } else {
          pendingWrappers.poll();
        }
      }
    }

    if (!horizontalStretchable) {
      maxWidth = minWidth;
    }

    const result: WrapLayoutColumn = new WrapLayoutColumn(columnWrappers, minWidth, maxWidth);
    result.setMinColumnHeight(sumMinHeight);
    return result;
  }

  public arrange(): void {
    const container: IWrapContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return;
    }

    if (container.getWrapArrangement() === WrapArrangement.Horizontal) {
      this.arrangeHorizontally();
    } else {
      this.arrangeVertically();
    }
  }

  private arrangeHorizontally(): void {
    const container: IWrapContainer = this.getControl();

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // consistency check
    if (containerWidth !== this._width) {
      this.measureMinHeight(containerWidth);
    }

    if (this._wrapRows == null || this._wrapRows.length === 0) {
      return;
    }

    // not arranged wrappers need to be reset
    const notArrangedWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
    notArrangedWrappers.pushAll(this._wrappers);

    // include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const hSpacing: number = container.getSpacingHorizontal();
    const vSpacing: number = container.getSpacingVertical();

    const availableWidth: number = containerWidth - insetsLeft - insetsRight;
    const availableHeight: number = containerHeight - insetsTop - insetsBottom;

    let spaceForRows: number = availableHeight - Math.max(0, this._wrapRows.length - 1) * vSpacing;

    if (container.getVerticalContentAlignment() === VerticalContentAlignment.Fill) {
      let sumMinHeights: number = 0;

      for (const wrapRow of this._wrapRows) {
        sumMinHeights += wrapRow.getMinRowHeight();
      }

      let verticalStretchFactor: number = spaceForRows / sumMinHeights;

      const todo: LinkedListOneWay<WrapLayoutRow> = new LinkedListOneWay<WrapLayoutRow>();

      for (const wrapRow of this._wrapRows) {
        todo.add(wrapRow);
      }

      let allProblemsSolved: boolean = false;

      while (!allProblemsSolved && !todo.isEmpty()) {
        allProblemsSolved = true;

        for (const wrapRow of todo.toArray()) {
          const desiredRowHeight: number = Math.round(verticalStretchFactor * wrapRow.getMinRowHeight());
          if (desiredRowHeight > wrapRow.getMaxRowHeight()) {
            wrapRow.setResultRowHeight(wrapRow.getMaxRowHeight());
            spaceForRows -= wrapRow.getResultRowHeight();
            sumMinHeights -= wrapRow.getMinRowHeight();
            verticalStretchFactor = spaceForRows / sumMinHeights;
            allProblemsSolved = false;
            todo.remove(wrapRow);
          }
        }
      }

      while (!todo.isEmpty()) {
        const wrapRow: WrapLayoutRow | null = todo.poll();
        if (wrapRow != null) {
          const desiredRowHeight: number = Math.round(verticalStretchFactor * wrapRow.getMinRowHeight());
          wrapRow.setResultRowHeight(desiredRowHeight);
          spaceForRows -= desiredRowHeight;
          sumMinHeights -= wrapRow.getMinRowHeight();
          verticalStretchFactor = spaceForRows / sumMinHeights;
        }
      }

    } else {
      // no stretch mode => result height = min height
      for (const row of this._wrapRows) {
        row.setResultRowHeight(row.getMinRowHeight());
        spaceForRows -= row.getMinRowHeight();
      }
    }

    // vertical start position
    let yPos: number = 0;
    const verticalContentAlignment: VerticalContentAlignment = container.getVerticalContentAlignment();
    if (verticalContentAlignment === VerticalContentAlignment.Bottom) {
      yPos = spaceForRows;
    } else if (verticalContentAlignment === VerticalContentAlignment.Middle) {
      yPos = spaceForRows / 2;
    }

    // iterate all wrap rows
    let addVSpacing: boolean = false;

    for (const wrapRow of this._wrapRows) {
      if (addVSpacing) {
        yPos += vSpacing;
      } else {
        addVSpacing = true;
      }

      const resultRowHeight: number = wrapRow.getResultRowHeight();

      // calculate neededWidth to care about horizontal content alignment offset
      let totalWrapperWidths: number = 0;

      for (const wrapper of wrapRow.getWrappers()) {
        totalWrapperWidths += wrapper.getResultWidth();
      }

      totalWrapperWidths += Math.max(0, wrapRow.getWrapperCount() - 1) * hSpacing;

      // horizontal start position
      let xPos: number = 0;
      const horizontalContentAlignment: HorizontalContentAlignment = container.getHorizontalContentAlignment();

      if (horizontalContentAlignment === HorizontalContentAlignment.Right) {
        xPos += availableWidth - totalWrapperWidths;
      } else if (horizontalContentAlignment === HorizontalContentAlignment.Center) {
        xPos += (availableWidth - totalWrapperWidths) / 2;
      }

      // iterate all wrappers of the wrap row
      let addHSpacing: boolean = false;

      for (const wrapper of wrapRow.getWrappers()) {
        if (addHSpacing) {
          xPos += hSpacing;
        } else {
          addHSpacing = true;
        }

        const alignmentVertical: VerticalAlignment = wrapper.getVerticalAlignment();
        const desiredHeight: number = alignmentVertical === VerticalAlignment.Stretch ? resultRowHeight : wrapper.getMinLayoutHeightBuffered();
        const resultHeight: number = Math.min(desiredHeight, wrapper.getMaxLayoutHeight());

        // calculate offset (caused by vertical alignment)
        let yOffset: number = 0;

        if (alignmentVertical === VerticalAlignment.Bottom) {
          yOffset = resultRowHeight - resultHeight;
        } else if (alignmentVertical === VerticalAlignment.Middle) {
          yOffset = (resultRowHeight - resultHeight) / 2;
        }

        const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
        layoutableProperties.setX(xPos);
        layoutableProperties.setY(yPos + yOffset);
        layoutableProperties.setLayoutWidth(wrapper.getResultWidth());
        layoutableProperties.setLayoutHeight(resultHeight);

        xPos += wrapper.getResultWidth();

        wrapper.arrangeContainer();

        notArrangedWrappers.remove(wrapper);
      }

      yPos += resultRowHeight;
    }

    notArrangedWrappers.forEach(wrapper => {
      const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
      layoutableProperties.setX(0);
      layoutableProperties.setY(0);
      layoutableProperties.setLayoutWidth(0);
      layoutableProperties.setLayoutHeight(0);
    });
  }

  private arrangeVertically(): void {
    const container: IWrapContainer = this.getControl();

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // consistency check
    if (containerWidth !== this._width) {
      this.measureMinHeight(containerWidth);
    }

    if (this._wrapColumns == null || this._wrapColumns.length === 0) {
      return;
    }

    // not arranged wrappers need to be reset
    const notArrangedWrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
    notArrangedWrappers.pushAll(this._wrappers);

    // include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const hSpacing: number = container.getSpacingHorizontal();
    const vSpacing: number = container.getSpacingVertical();

    const availableWidth: number = containerWidth - insetsLeft - insetsRight;

    let totalColumnWidths: number = 0;

    for (const wrapColumn of this._wrapColumns) {
      totalColumnWidths += wrapColumn.getResultColumnWidth();
    }

    totalColumnWidths += Math.max(0, this._wrapColumns.length - 1) * hSpacing;

    let columnXPos: number = 0;
    const horizontalContentAlignment: HorizontalContentAlignment = container.getHorizontalContentAlignment();

    if (horizontalContentAlignment === HorizontalContentAlignment.Right) {
      columnXPos = availableWidth - totalColumnWidths;
    } else if (horizontalContentAlignment === HorizontalContentAlignment.Center) {
      columnXPos = (availableWidth - totalColumnWidths) / 2;
    }

    // for all columns ...
    const fillContentVertically: boolean = container.getVerticalContentAlignment() === VerticalContentAlignment.Fill;
    let addHSpacing: boolean = false;

    for (const wrapColumn of this._wrapColumns) {
      let verticalSpaceForColumn: number = containerHeight - insetsTop - insetsBottom - Math.max(0, wrapColumn.getWrapperCount() - 1) * vSpacing;

      // 1. calculate result heights for all wrappers
      if (fillContentVertically) {
        let sumMinHeights: number = 0;
        const todo: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();

        for (const wrapper of wrapColumn.getWrappers()) {
          if (wrapper.getVerticalAlignment() !== VerticalAlignment.Stretch) {
            wrapper.setResultHeight(wrapper.getMinLayoutHeightBuffered());
            verticalSpaceForColumn -= wrapper.getResultHeight();
          } else {
            sumMinHeights += wrapper.getMinLayoutHeightBuffered();
            todo.add(wrapper);
          }
        }

        let verticalStretchFactor: number = verticalSpaceForColumn / sumMinHeights;

        let allProblemsSolved: boolean = false;

        while (!todo.isEmpty() && !allProblemsSolved) {
          allProblemsSolved = true;

          for (const wrapper of todo.toArray()) {
            const desiredHeight: number = Math.round(verticalStretchFactor * wrapper.getMinLayoutHeightBuffered());
            if (desiredHeight > wrapper.getMaxLayoutHeight()) {
              wrapper.setResultHeight(wrapper.getMaxLayoutHeight());
              sumMinHeights -= wrapper.getMinLayoutHeightBuffered();
              verticalSpaceForColumn -= wrapper.getResultHeight();
              verticalStretchFactor = verticalSpaceForColumn / sumMinHeights;
              allProblemsSolved = false;
              todo.remove(wrapper);
            }
          }
        }

        while (!todo.isEmpty()) {
          const wrapper: LayoutableControlWrapper | null = todo.poll();
          if (wrapper != null) {
            wrapper.setResultHeight(Math.round(verticalStretchFactor * wrapper.getMinLayoutHeightBuffered()));
            sumMinHeights -= wrapper.getMinLayoutHeightBuffered();
            verticalSpaceForColumn -= wrapper.getResultHeight();
            verticalStretchFactor = verticalSpaceForColumn / sumMinHeights;
          }
        }
      } else {
        // do not fill content vertically
        for (const wrapper of wrapColumn.getWrappers()) {
          wrapper.setResultHeight(wrapper.getMinLayoutHeightBuffered());
          verticalSpaceForColumn -= wrapper.getMinLayoutHeightBuffered();
        }
      }

      // 2. do alignment
      if (addHSpacing) {
        columnXPos += hSpacing;
      } else {
        addHSpacing = true;
      }

      let yPos: number = 0;
      const verticalContentAlignment: VerticalContentAlignment = container.getVerticalContentAlignment();
      if (verticalContentAlignment === VerticalContentAlignment.Bottom) {
        // add unused vertical space
        yPos = verticalSpaceForColumn;
      } else if (verticalContentAlignment === VerticalContentAlignment.Middle) {
        // add half of the unused vertical space
        yPos = verticalSpaceForColumn / 2;
      }

      let addVSpacing: boolean = false;

      for (const wrapper of wrapColumn.getWrappers()) {
        if (addVSpacing) {
          yPos += vSpacing;
        } else {
          addVSpacing = true;
        }

        let xOffset: number = 0;
        const hAlignment: HorizontalAlignment = wrapper.getHorizontalAlignment();
        if (hAlignment === HorizontalAlignment.Right) {
          xOffset = wrapColumn.getResultColumnWidth() - wrapper.getResultWidth();
        } else if (hAlignment === HorizontalAlignment.Center) {
          xOffset = (wrapColumn.getResultColumnWidth() - wrapper.getResultWidth()) / 2;
        }

        const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
        layoutableProperties.setX(columnXPos + xOffset);
        layoutableProperties.setY(yPos);
        layoutableProperties.setLayoutWidth(wrapper.getResultWidth());
        layoutableProperties.setLayoutHeight(wrapper.getResultHeight());

        yPos += wrapper.getResultHeight();

        wrapper.arrangeContainer();

        notArrangedWrappers.remove(wrapper);
      }

      columnXPos += wrapColumn.getResultColumnWidth();
    }

    notArrangedWrappers.forEach(wrapper => {
      const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
      layoutableProperties.setX(0);
      layoutableProperties.setY(0);
      layoutableProperties.setLayoutWidth(0);
      layoutableProperties.setLayoutHeight(0);
    });
  }
}
