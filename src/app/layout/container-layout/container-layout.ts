import { LayoutContainerBase, LayoutableContainer, LayoutableControlWrapper, LayoutableControl, LayoutableProperties } from '..';
import { VerticalAlignment, HorizontalAlignment } from '../../enums';
import { LinkedListOneWay } from '../../util';

export class ContainerLayout extends LayoutContainerBase {

  private width: number = -1;
  private wrappers: Array<LayoutableControlWrapper>;

  constructor(container: LayoutableContainer) {
    super(container);
  }

  public getControl(): LayoutableContainer {
    return super.getControl() as LayoutableContainer;
  }

  private initWrappers(): void {
    let controls: Array<LayoutableControl> = this.getControl().getLayoutableControls();
    let controlCount: number = controls.length;

    this.wrappers = new Array<LayoutableControlWrapper>(controlCount);

    for (let i = 0; i < controlCount; i++) {
      this.wrappers[i] = new LayoutableControlWrapper(controls[i]);
    }
  }

  public measureMinWidth(): number {
    let container: LayoutableContainer = this.getControl();

    this.initWrappers();

    // Iterate wrappers to calculate total content min width (maximum of all min widths)
    let minWidth: number = 0;

    for (let wrapper of this.wrappers) {
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
    let containerMinWidth: number = container.getMinWidth() + container.getMarginLeft() + container.getMarginRight();

    // The greater value wins: The calculated minimum width for all children or defined container minimum width
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    let container: LayoutableContainer = this.getControl();

    this.width = width;

    // Include insets (padding + border + margin) of the container
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let minHeight: number = 0;

    for (let wrapper of this.wrappers) {
      if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
        minHeight += wrapper.getMinLayoutHeight(width);
      }
    }

    // Add vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // Determine the container minimum height and add vertical margins
    let containerMinHeight: number = container.getMinHeight() + container.getMarginTop() + container.getMarginBottom();

    // The greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  public arrange(): void {
    let container: LayoutableContainer = this.getControl();

    let containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    let containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // Consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    if (!this.wrappers || !this.wrappers.length) {
      return;
    }

    // Include insets (padding + border + margin) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let availableWidth = containerWidth - insetsLeft - insetsRight;
    let availableHeight = containerHeight - insetsTop - insetsBottom;

    // Calculate result widths and heights
    let sumMinHeights: number = 0;
    let todo: LinkedListOneWay<LayoutableControlWrapper> = new LinkedListOneWay<LayoutableControlWrapper>();

    for (let wrapper of this.wrappers) {
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

    // Do alignment
    let xPos: number = 0;
    let yPos: number = 0;

    for (let wrapper of this.wrappers) {
      let xOffset: number = 0;
      let hAlignment: HorizontalAlignment = wrapper.getHorizontalAlignment();

      if (hAlignment === HorizontalAlignment.Right) {
        xOffset = availableWidth - wrapper.getResultWidth();
      } else if (hAlignment === HorizontalAlignment.Center) {
        xOffset = (availableWidth - wrapper.getResultWidth()) / 2;
      }

      let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
      layoutableProperties.setX(xPos + xOffset);
      layoutableProperties.setY(yPos);
      layoutableProperties.setLayoutWidth(wrapper.getResultWidth());
      layoutableProperties.setLayoutHeight(wrapper.getResultHeight());

      yPos += wrapper.getResultHeight();
    }
  }
}
