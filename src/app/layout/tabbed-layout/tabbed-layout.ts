import { HorizontalAlignment } from '@app/enums/horizontal-alignment';
import { TabAlignment } from '@app/enums/tab-alignment';
import { VerticalAlignment } from '@app/enums/vertical-alignment';
import { Visibility } from '@app/enums/visibility';
import { LayoutContainerBase } from '@app/layout/layout-container-base';
import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';
import { LayoutableControlWrapper } from '@app/layout/layoutable-control-wrapper';
import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { ITabbedLayoutControl } from '@app/layout/tabbed-layout/tabbed-layout-control.interface';

export class TabbedLayout extends LayoutContainerBase {

  private _width: number = -1;
  private _wrappers: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();

  public constructor(container: ILayoutableContainer) {
    super(container);
  }

  public getControl(): ITabbedLayoutControl {
    return super.getControl() as ITabbedLayoutControl;
  }

  private initWrappers(): void {
    const controls: Array<ILayoutableControl> = this.getControl().getLayoutableControls();
    const controlCount: number = controls.length;

    this._wrappers = new Array<LayoutableControlWrapper>(controlCount);

    for (let i = 0; i < controlCount; i++) {
      this._wrappers[i] = new LayoutableControlWrapper(controls[i]);
    }
  }

  public measureMinWidth(): number {
    const container: ITabbedLayoutControl = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    this.initWrappers();

    // Iterate wrappers to calculate total content min width (maximum of all min widths)
    let minWidth: number = 0;

    for (const wrapper of this._wrappers) {
      // Ignore invisible items (items with min width = 0 do not have an impact)
      if (wrapper.getIsControlVisible()) {
        minWidth = Math.max(minWidth, wrapper.getMinLayoutWidth());
      }
    }

    if (minWidth > 0) {
      // Include horizontal insets (padding + border + margin) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();

      if (minWidth > 0) {
        const tabAlignment: TabAlignment = container.getTabAlignment();

        // If the tab alignment is either left or right, add the widest tab header to the minWidth
        if (tabAlignment === TabAlignment.Left || tabAlignment === TabAlignment.Right) {
          minWidth += container.getWidestLayoutTabPageHeader();
        }

        // TabPage headers are drawn into the adjacent border of the content -> subtract it from the minwidth
        if (tabAlignment === TabAlignment.Left) {
          minWidth -= container.getBorderThicknessLeft();
        }

        if (tabAlignment === TabAlignment.Right) {
          minWidth -= container.getBorderThicknessRight();
        }
      }
    }

    // Calculate the defined container minimum width
    const containerMinWidth: number = this.getContainerMinWidth(container);

    // The greater value wins: The calculated minimum width for all children or defined container minimum width
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  protected getContainerMinWidth(container: ITabbedLayoutControl): number {
    // If no visible tab pages exist -> do not render the control
    if (this._wrappers.filter(w => w.getIsControlVisible()).length <= 0) {
      return 0;
    }

    // Determine the container minimum width and add horizontal margins
    let containerMinWidth: number = container.getMinWidth();

    if (containerMinWidth > 0) {
      containerMinWidth += container.getMarginLeft() + container.getMarginRight();
    }

    const tabAlignment: TabAlignment = container.getTabAlignment();

    // TabPage headers are drawn into the adjacent border of the content -> subtract it from the containerMinWidth
    if (tabAlignment === TabAlignment.Left) {
      containerMinWidth -= container.getBorderThicknessLeft();
    }

    if (tabAlignment === TabAlignment.Right) {
      containerMinWidth -= container.getBorderThicknessRight();
    }

    return containerMinWidth;
  }

  public measureMinHeight(width: number): number {
    const container: ITabbedLayoutControl = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed || width <= 0) {
      return 0;
    }

    this._width = width;

    // Include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    let availableWidth: number = width - insetsLeft - insetsRight;

    // If the tab alignment is either left or right, subtract the widest tab header from the available width
    const tabAlignment: TabAlignment = container.getTabAlignment();

    if (tabAlignment === TabAlignment.Left || tabAlignment === TabAlignment.Right) {
      availableWidth -= container.getWidestLayoutTabPageHeader();
    }

    // TabPage headers are drawn into the adjacent border of the content -> add it to the available width
    if (tabAlignment === TabAlignment.Left) {
      availableWidth += container.getBorderThicknessLeft();
    }

    if (tabAlignment === TabAlignment.Right) {
      availableWidth += container.getBorderThicknessRight();
    }

    let minHeight: number = 0;

    if (container.getIsMobileMode()) {
      const selectedTabIndex: number = container.getSelectedTabIndex();
      const activeTab: LayoutableControlWrapper | null = selectedTabIndex >= 0 ? this._wrappers[selectedTabIndex] : null;

      if (activeTab != null && activeTab.getIsControlVisible() && activeTab.getMinLayoutWidth() > 0) {
        minHeight += activeTab.getMinLayoutHeight(availableWidth);
      }
    } else {
      for (const wrapper of this._wrappers) {
        if (wrapper.getIsControlVisible() && wrapper.getMinLayoutWidth() > 0) {
          minHeight = Math.max(minHeight, wrapper.getMinLayoutHeight(availableWidth));
        }
      }
    }

    // Add vertical insets
    if (minHeight > 0) {
      minHeight += insetsTop + insetsBottom;

      if (minHeight > 0) {
        // If the tab alignment is either top or bottom, add the highest tab header to the minHeight
        if (tabAlignment === TabAlignment.Top || tabAlignment === TabAlignment.Bottom) {
          minHeight += container.getHighestLayoutTabPageHeader();
        }

        // TabPage headers are drawn into the adjacent border of the content -> subtract it from the minHeight
        if (tabAlignment === TabAlignment.Top) {
          minHeight -= container.getBorderThicknessTop();
        }

        if (tabAlignment === TabAlignment.Bottom) {
          minHeight -= container.getBorderThicknessBottom();
        }
      }
    }

    // Calculate the defined container minimum height
    const containerMinHeight: number = this.getContainerMinHeight(container);

    // The greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  protected getContainerMinHeight(container: ITabbedLayoutControl): number {
    // If no visible tab pages exist -> do not render the control
    if (this._wrappers.filter(w => w.getIsControlVisible()).length <= 0) {
      return 0;
    }

    // Determine the container minimum height and add vertical margins
    let containerMinHeight: number = container.getMinHeight();

    if (containerMinHeight > 0) {
      containerMinHeight += container.getMarginTop() + container.getMarginBottom();
    }

    const tabAlignment: TabAlignment = container.getTabAlignment();

    // TabPage headers are drawn into the adjacent border of the content -> subtract it from the containerMinHeight
    if (tabAlignment === TabAlignment.Top) {
      containerMinHeight -= container.getBorderThicknessTop();
    }

    if (tabAlignment === TabAlignment.Bottom) {
      containerMinHeight -= container.getBorderThicknessBottom();
    }

    return containerMinHeight;
  }

  public arrange(): void {
    const container: ITabbedLayoutControl = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return;
    }

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // Consistency check
    if (containerWidth !== this._width) {
      this.measureMinHeight(containerWidth);
    }

    const selectedTabIndex: number = container.getSelectedTabIndex();
    const activeTab: LayoutableControlWrapper | null = selectedTabIndex >= 0 ? this._wrappers[selectedTabIndex] : null;

    if (activeTab == null) {
      return;
    }

    // Include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    let availableWidth = containerWidth - insetsLeft - insetsRight;
    let availableHeight = containerHeight - insetsTop - insetsBottom;

    const tabAlignment: TabAlignment = container.getTabAlignment();

    // If the tab alignment is either left or right, subtract the widest tab header from the available width
    if (tabAlignment === TabAlignment.Left || tabAlignment === TabAlignment.Right) {
      availableWidth -= container.getWidestLayoutTabPageHeader();
    }

    // TabPage headers are drawn into the adjacent border of the content -> add it to the available width
    if (tabAlignment === TabAlignment.Left) {
      availableWidth += container.getBorderThicknessLeft();
    }

    if (tabAlignment === TabAlignment.Right) {
      availableWidth += container.getBorderThicknessRight();
    }

    // If the tab alignment is either top or bottom, subtract the highest tab header from the available height
    if (tabAlignment === TabAlignment.Top || tabAlignment === TabAlignment.Bottom) {
      availableHeight -= container.getHighestLayoutTabPageHeader();
    }

    // TabPage headers are drawn into the adjacent border of the content -> add it to the available height
    if (tabAlignment === TabAlignment.Top) {
      availableHeight += container.getBorderThicknessTop();
    }

    if (tabAlignment === TabAlignment.Bottom) {
      availableHeight += container.getBorderThicknessBottom();
    }

    // Calculate result widths and heights
    if (activeTab.getHorizontalAlignment() !== HorizontalAlignment.Stretch) {
      activeTab.setResultWidth(activeTab.getMinLayoutWidth());
    } else {
      activeTab.setResultWidth(Math.min(availableWidth, activeTab.getMaxLayoutWidth()));
    }

    if (activeTab.getVerticalAlignment() !== VerticalAlignment.Stretch) {
      activeTab.setResultHeight(activeTab.getMinLayoutHeightBuffered());
    } else {
      activeTab.setResultHeight(Math.min(availableHeight, activeTab.getMaxLayoutHeight()));
    }

    // Do alignment
    let xOffset: number = 0;
    const hAlignment: HorizontalAlignment = activeTab.getHorizontalAlignment();

    if (hAlignment === HorizontalAlignment.Right) {
      xOffset = availableWidth - activeTab.getResultWidth();
    } else if (hAlignment === HorizontalAlignment.Center) {
      xOffset = (availableWidth - activeTab.getResultWidth()) / 2;
    }

    const layoutableProperties: ILayoutableProperties = activeTab.getLayoutableProperties();
    layoutableProperties.setX(xOffset);
    layoutableProperties.setY(0);
    layoutableProperties.setLayoutWidth(activeTab.getResultWidth());
    layoutableProperties.setLayoutHeight(activeTab.getResultHeight());

    activeTab.arrangeContainer();
  }
}
