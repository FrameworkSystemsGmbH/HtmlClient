import { TextAlign } from '@app/enums/text-align';
import { IControlLabelContainer } from '@app/layout/control-label-container-layout/control-label-container.interface';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';

export abstract class ControlLabelContainerBaseLayout extends LayoutContainerBase {

  private width: number = -1;
  private wrappers: Array<LayoutableControlWrapper>;

  public constructor(container: IControlLabelContainer) {
    super(container);
  }

  public getControl(): IControlLabelContainer {
    return super.getControl() as IControlLabelContainer;
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
    this.initWrappers();

    // Iterate wrappers to calculate total content min width (sum of all min widths)
    let minWidth: number = 0;

    for (const wrapper of this.wrappers) {
      // Ignore invisible items (items with min width = 0 do not have an impact)
      if (this.checkWrapperVisibility(wrapper)) {
        minWidth += wrapper.getMinLayoutWidth();
      }
    }

    return minWidth;
  }

  public measureMinHeight(width: number): number {
    this.width = width;

    // Get the tallest control
    let minHeight: number = 0;

    for (const wrapper of this.wrappers) {
      if (this.checkWrapperVisibility(wrapper) && wrapper.getMinLayoutWidth() > 0) {
        minHeight = Math.max(minHeight, wrapper.getMinLayoutHeight(width));
      }
    }

    return minHeight;
  }

  public arrange(): void {
    if (!this.wrappers) {
      return;
    }

    const container: IControlLabelContainer = this.getControl();

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const textAlign: TextAlign = container.getTextAlign();

    let availableWidth: number = containerWidth;

    // Consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    const visibleWrappers: Array<LayoutableControlWrapper> = this.wrappers.filter(wrapper => this.checkWrapperVisibility(wrapper));

    if (!visibleWrappers.length) {
      return;
    }

    for (const wrapper of visibleWrappers) {
      wrapper.setResultWidth(wrapper.getMinLayoutWidth());
      wrapper.setResultHeight(wrapper.getMinLayoutHeightBuffered());
      availableWidth -= wrapper.getResultWidth();
    }

    // Calculate xOffset
    let xPos: number = 0;

    if (textAlign === TextAlign.Right) {
      xPos = availableWidth;
    } else if (textAlign === TextAlign.Center) {
      xPos = availableWidth / 2;
    }

    // Do alignment
    for (const wrapper of visibleWrappers) {
      const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
      layoutableProperties.setX(xPos);
      layoutableProperties.setY(0);
      layoutableProperties.setLayoutWidth(wrapper.getResultWidth());
      layoutableProperties.setLayoutHeight(wrapper.getResultHeight());
      xPos += wrapper.getResultWidth();
    }
  }

  protected abstract checkWrapperVisibility(wrapper: LayoutableControlWrapper): boolean;
}
