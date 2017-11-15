import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { LayoutableControlWrapper } from 'app/layout/layoutable-control-wrapper';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { LinkedListOneWay } from 'app/util/linked-list-one-way';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

export class ContainerLayout extends LayoutContainerBase {

  private width: number = -1;
  private wrappers: Array<LayoutableControlWrapper>;

  constructor(container: ILayoutableContainer) {
    super(container);
  }

  public getControl(): ILayoutableContainer {
    return super.getControl() as ILayoutableContainer;
  }

  private initWrappers(): void {
    const controls: Array<ILayoutableControl> = this.getControl().getLayoutableControls();
    const controlCount: number = controls.length;

    this.wrappers = new Array<LayoutableControlWrapper>(controlCount);

    for (let i = 0; i < controlCount; i++) {
      this.wrappers[i] = new LayoutableControlWrapper(controls[i]);
    }
  }

  public measureMinWidth(): number {
    const container: ILayoutableContainer = this.getControl();

    this.initWrappers();

    // Iterate wrappers to calculate total content min width (maximum of all min widths)
    let minWidth: number = 0;

    for (const wrapper of this.wrappers) {
      // Ignore invisible items (items with min width = 0 do not have an impact)
      if (wrapper.getIsVisible()) {
        minWidth = Math.max(minWidth, wrapper.getMinLayoutWidth());
      }
    }

    if (minWidth > 0) {
      // Include horizontal insets (padding + border + margin) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // Determine the container minimum width and add horizontal margins
    const containerMinWidth: number = container.getMinWidth() + container.getMarginLeft() + container.getMarginRight();

    // The greater value wins: The calculated minimum width for all children or defined container minimum width
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    const container: ILayoutableContainer = this.getControl();

    this.width = width;

    // Include insets (padding + border + margin) of the container
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    let minHeight: number = 0;

    for (const wrapper of this.wrappers) {
      if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
        minHeight += wrapper.getMinLayoutHeight(width);
      }
    }

    // Add vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // Determine the container minimum height and add vertical margins
    const containerMinHeight: number = container.getMinHeight() + container.getMarginTop() + container.getMarginBottom();

    // The greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  public arrange(): void {
    const container: ILayoutableContainer = this.getControl();

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // Consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    if (!this.wrappers || !this.wrappers.length) {
      return;
    }

    // Include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const availableWidth = containerWidth - insetsLeft - insetsRight;
    let availableHeight = containerHeight - insetsTop - insetsBottom;

    // Calculate result widths and heights
    let sumMinHeights: number = 0;
    const todo: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();

    for (const wrapper of this.wrappers) {
      if (wrapper.getHorizontalAlignment() !== HorizontalAlignment.Stretch) {
        wrapper.setResultWidth(wrapper.getMinLayoutWidth());
      } else {
        wrapper.setResultWidth(Math.min(availableWidth, wrapper.getMaxLayoutWidth()));
      }

      if (wrapper.getVerticalAlignment() !== VerticalAlignment.Stretch) {
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
      for (const wrapper of todo.toArray()) {
        const desiredHeight: number = Math.round(verticalStretchFactor * wrapper.getMinLayoutHeightBuffered());
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
      const wrapper: LayoutableControlWrapper = todo.poll();
      wrapper.setResultHeight(Math.round(verticalStretchFactor * wrapper.getMinLayoutHeightBuffered()));
      sumMinHeights -= wrapper.getMinLayoutHeightBuffered();
      availableHeight -= wrapper.getResultHeight();
      verticalStretchFactor = availableHeight / sumMinHeights;
    }

    // Do alignment
    const xPos: number = 0;
    let yPos: number = 0;

    for (const wrapper of this.wrappers) {
      let xOffset: number = 0;
      const hAlignment: HorizontalAlignment = wrapper.getHorizontalAlignment();

      if (hAlignment === HorizontalAlignment.Right) {
        xOffset = availableWidth - wrapper.getResultWidth();
      } else if (hAlignment === HorizontalAlignment.Center) {
        xOffset = (availableWidth - wrapper.getResultWidth()) / 2;
      }

      const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
      layoutableProperties.setX(xPos + xOffset);
      layoutableProperties.setY(yPos);
      layoutableProperties.setLayoutWidth(wrapper.getResultWidth());
      layoutableProperties.setLayoutHeight(wrapper.getResultHeight());

      yPos += wrapper.getResultHeight();
    }

    for (const control of container.getLayoutableControls()) {
      const subContainer: ILayoutableContainer = control as ILayoutableContainer;
      if (subContainer) {
        const layout: any = subContainer.getLayout();
        if (layout.arrange) {
          layout.arrange();
        }
      }
    }
  }
}
