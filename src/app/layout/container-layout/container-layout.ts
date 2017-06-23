import { LayoutContainerBase, LayoutableContainer, LayoutableControlWrapper, LayoutableControl, LayoutableProperties } from '..';
import { HorizontalContentAlignment, VerticalContentAlignment, VerticalAlignment, HorizontalAlignment } from '../../enums';
import { LinkedListOneWay } from '../../util';

export class ContainerLayout extends LayoutContainerBase {

  private width: number = -1;
  private wrappers: Array<LayoutableControlWrapper> = null;

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

    // Determine at the container defined minimum size
    let containerMinWidth: number = container.getMinWidth();

    // The greater value wins: calculated minimum size for all children or defined container minimum size
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    let container: LayoutableContainer = this.getControl();

    this.width = width;

    // Include insets (padding + border + margin) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let availableWidth: number = width - insetsLeft - insetsRight;
    let minHeight: number = 0;

    for (let wrapper of this.wrappers) {
      if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
        minHeight += wrapper.getMinLayoutHeight(width);
      }
    }

    // Vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;
    }

    // Determine at the container defined minimum height
    let containerMinHeight: number = container.getMinHeight();

    // The greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  public arrange(): void {
    let container: LayoutableContainer = this.getControl();

    let containerWidth: number = container.getLayoutableProperties().getWidth();
    let containerHeight: number = container.getLayoutableProperties().getHeight();

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
      if (wrapper.getAlignmentHorizontal() !== HorizontalAlignment.Stretch) {
        wrapper.setResultWidth(wrapper.getMinLayoutWidth());
      } else {
        wrapper.setResultWidth(Math.min(availableWidth, wrapper.getMaxLayoutWidth()));
      }

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

    // Do alignment
    let xPos: number = insetsLeft;
    let yPos: number = insetsTop;

    for (let wrapper of this.wrappers) {
      let xOffset: number = 0;
      let hAlignment: HorizontalAlignment = wrapper.getAlignmentHorizontal();

      if (hAlignment === HorizontalAlignment.Right) {
        xOffset = availableWidth - wrapper.getResultWidth();
      } else if (hAlignment === HorizontalAlignment.Center) {
        xOffset = (availableWidth - wrapper.getResultWidth()) / 2;
      }

      let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
      layoutableProperties.setX(xPos + xOffset);
      layoutableProperties.setY(yPos);
      layoutableProperties.setWidth(wrapper.getResultWidth());
      layoutableProperties.setHeight(wrapper.getResultHeight());

      yPos += wrapper.getResultHeight();
    }
  }
}