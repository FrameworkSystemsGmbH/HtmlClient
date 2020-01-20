import { ITabbedLayoutControl } from 'app/layout/tabbed-layout/tabbed-layout-control.interface';
import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';
import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { LayoutableControlWrapper } from 'app/layout/layoutable-control-wrapper';
import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { Visibility } from 'app/enums/visibility';
import { TabAlignment } from 'app/enums/tab-alignment';

export class TabbedLayout extends LayoutContainerBase {

  private width: number = -1;
  private wrappers: Array<LayoutableControlWrapper>;

  constructor(container: ILayoutableContainer) {
    super(container);
  }

  public getControl(): ITabbedLayoutControl {
    return super.getControl() as ITabbedLayoutControl;
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
    const container: ITabbedLayoutControl = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

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

      if (minWidth > 0) {
        // If the tab alignment is either left or right, add the widest tab header to the minWidth
        const tabAlignment: TabAlignment = container.getTabAlignment();

        if (tabAlignment === TabAlignment.Left || tabAlignment === TabAlignment.Right) {
          minWidth += container.getWidestTabPageHeader();
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

    // Determine the container minimum width and add horizontal margins
    const containerMinWidth: number = container.getMinWidth() + container.getMarginLeft() + container.getMarginRight();

    // The greater value wins: The calculated minimum width for all children or defined container minimum width
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  public measureMinHeight(width: number): number {
    const container: ITabbedLayoutControl = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed || width <= 0) {
      return 0;
    }

    this.width = width;

    // Include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    let availableWidth: number = width - insetsLeft - insetsRight;

    // If the tab alignment is either left or right, subtract the widest tab header from the available width
    const tabAlignment: TabAlignment = container.getTabAlignment();

    if (tabAlignment === TabAlignment.Left || tabAlignment === TabAlignment.Right) {
      availableWidth -= container.getWidestTabPageHeader();
    }

    // TabPage headers are drawn into the adjacent border of the content -> subtract it from the minwidth
    if (tabAlignment === TabAlignment.Left) {
      availableWidth -= container.getBorderThicknessLeft();
    }

    if (tabAlignment === TabAlignment.Right) {
      availableWidth -= container.getBorderThicknessRight();
    }

    let minHeight: number = 0;

    if (container.getIsMobileMode()) {
      const selectedTabIndex: number = container.getSelectedTabIndex();
      const activeTab: LayoutableControlWrapper = selectedTabIndex >= 0 ? this.wrappers[selectedTabIndex] : null;

      if (activeTab != null && activeTab.getIsVisible() && activeTab.getMinLayoutWidth() > 0) {
        minHeight += activeTab.getMinLayoutHeight(availableWidth);
      }
    } else {
      for (const wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
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
          minHeight += container.getHighestTabPageHeader();
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

    // Determine the container minimum height and add vertical margins
    const containerMinHeight: number = container.getMinHeight() + container.getMarginTop() + container.getMarginBottom();

    // The greater value wins: calculated minimum height or defined container minimum height
    return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
  }

  public arrange(): void {
    const container: ITabbedLayoutControl = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return;
    }

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // Consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    const selectedTabIndex: number = container.getSelectedTabIndex();
    const activeTab: LayoutableControlWrapper = selectedTabIndex >= 0 ? this.wrappers[selectedTabIndex] : null;

    if (activeTab == null) {
      return;
    }

    // Include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const availableWidth = containerWidth - insetsLeft - insetsRight;
    const availableHeight = containerHeight - insetsTop - insetsBottom;

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
