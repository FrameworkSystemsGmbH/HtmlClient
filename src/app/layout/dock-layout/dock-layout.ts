import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';
import { IDockContainer } from 'app/layout/dock-layout/dock-container.interface';

import { LayoutContainerBase } from 'app/layout/layout-container-base';
import { LayoutableControlWrapper } from 'app/layout/layoutable-control-wrapper';
import { DockOrientation } from 'app/layout/dock-layout/dock-orientation';
import { DockPanelScrolling } from 'app/enums/dockpanel-scrolling';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';
import { Visibility } from 'app/enums/visibility';

export class DockLayout extends LayoutContainerBase {

  private static SCROLLING_MIN_WIDTH: number = 1;
  private static SCROLLING_MIN_HEIGHT: number = 1;

  private width: number = -1;
  private isVertical: boolean = false;
  private wrappers: Array<LayoutableControlWrapper>;

  constructor(container: IDockContainer) {
    super(container);
  }

  public getControl(): IDockContainer {
    return super.getControl() as IDockContainer;
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
    const container: IDockContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return 0;
    }

    this.initWrappers();

    const orientation: DockOrientation = container.getDockOrientation();
    const scrolling: DockPanelScrolling = container.getDockPanelScrolling();
    const hSpacing: number = container.getSpacingHorizontal();

    // Iterate wrappers to calculate total content min width
    let minWidth: number = 0;
    let addSpacing: boolean = false;

    for (const wrapper of this.wrappers) {
      // Ignore invisible items and items with min width = 0
      if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
        // Add spacing if needed
        if (addSpacing) {
          if (orientation === DockOrientation.Horizontal) {
            minWidth += hSpacing;
          }
        } else {
          addSpacing = true;
        }

        minWidth = orientation === DockOrientation.Horizontal
          ? minWidth + wrapper.getMinLayoutWidth()
          : Math.max(minWidth, wrapper.getMinLayoutWidth());
      }
    }

    if (minWidth > 0) {
      // Determine the container minimum width and add horizontal margins
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // determine at the container defined minimum size
    const containerMinWidth: number = container.getMinWidth() + container.getMarginLeft() + container.getMarginRight();

    if (scrolling !== DockPanelScrolling.None) {
      // If scrolling is enabled, either return the minimum container width or the fixed minimum width if the former is not set
      return Math.max(DockLayout.SCROLLING_MIN_WIDTH, containerMinWidth);
    } else {
      // The greater value wins: The calculated minimum width for all children or defined container minimum width
      return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
    }
  }

  public measureMinHeight(width: number): number {
    const container: IDockContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed || width <= 0) {
      return 0;
    }

    const orientation: DockOrientation = container.getDockOrientation();

    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const hSpacing: number = container.getSpacingHorizontal();
    const vSpacing: number = container.getSpacingVertical();

    const scrolling: boolean = container.getDockPanelScrolling() !== DockPanelScrolling.None;

    this.width = width;

    this.isVertical = orientation === DockOrientation.Vertical;

    if (orientation === DockOrientation.HorizontalOrVertical) {
      // Iterate children and add min sizes and spaces
      let neededWidth: number = 0;
      let addSpacing: boolean = false;

      for (const wrapper of this.wrappers) {
        // Ignore invisible items and items with minWidth = 0
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {

          // add spacing if needed
          if (addSpacing) {
            neededWidth += hSpacing;
          } else {
            addSpacing = true;
          }

          neededWidth += wrapper.getMinLayoutWidth();
        }
      }

      if (neededWidth > 0) {
        neededWidth += insetsLeft + insetsRight;
      }

      // Do vertical layout if there is not enough available space for horizontal layout
      this.isVertical = width < neededWidth;
    }

    if (this.isVertical) {
      const contentWidth = width - insetsLeft - insetsRight;

      let minHeight: number = 0;
      let addSpacing: boolean = false;

      for (const wrapper of this.wrappers) {
        let wrapperMeasureWidth: number = contentWidth;

        // If the DockPanel scrolls, the wrapper should not be narrower than its minimal width
        if (scrolling) {
          wrapperMeasureWidth = Math.max(contentWidth, wrapper.getMinLayoutWidth());
        }

        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeight(wrapperMeasureWidth) > 0) {
          // Add spacing if needed
          if (addSpacing) {
            minHeight += vSpacing;
          } else {
            addSpacing = true;
          }

          minHeight += wrapper.getMinLayoutHeightBuffered();
        }
      }

      if (minHeight > 0) {
        minHeight += insetsTop + insetsBottom;
      }

      // Determine the container minimum height and add vertical margins
      const containerMinHeight: number = container.getMinHeight() + container.getMarginTop() + container.getMarginBottom();

      if (scrolling) {
        // If scrolling is enabled, either return the minimum container height or the fixed minimum height if the former is not set
        return Math.max(DockLayout.SCROLLING_MIN_HEIGHT, containerMinHeight);
      } else {
        // The greater value wins: The calculated minimum height for all children or defined container minimum height
        return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
      }
    } else {
      // Horizontal layout => arrange horizontal, because the widths are needed to calculate min height

      let sumDockItemSizes: number = 0;
      let sumMinWidths: number = 0;
      let countVisibleControls: number = 0;

      for (const wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          countVisibleControls++;
          sumMinWidths += wrapper.getMinLayoutWidth();
          if (wrapper.getDockItemSize()) {
            sumDockItemSizes += wrapper.getDockItemSize();
          }
        }
      }

      // Calculate result width for auto sized items and remember all dynamic items to be processed later
      const todo: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
      let availableWidth: number = width - insetsLeft - insetsRight - Math.max(0, countVisibleControls - 1) * hSpacing;

      // If the DockPanel scrolls and the wrappers do not fit, all wrappers get auto-sized to the minimum width
      if (scrolling && sumMinWidths > availableWidth) {
        availableWidth = sumMinWidths;
      }

      for (const wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          if (wrapper.getDockItemSize() == null) {
            // Auto sized items: resultWidth = minWidth
            wrapper.setResultWidth(wrapper.getMinLayoutWidth());
            availableWidth -= wrapper.getMinLayoutWidth();
          } else {
            // Dynamic items: Process later
            todo.push(wrapper);
          }
        }
      }

      // Calculate result width for dynamic items respecting min and max widths
      let allMinMaxProblemsSolved: boolean = false;

      while (!todo.isEmpty() && !allMinMaxProblemsSolved) {
        // Sum up all distances below minimum and above maximum and remember the greatest distance item
        let sumMinFails: number = 0;
        let maxMinFail: number = 0;
        let sumMaxFails: number = 0;
        let maxMaxFail: number = 0;
        let maxMinFailWrapper: LayoutableControlWrapper;
        let maxMaxFailWrapper: LayoutableControlWrapper;

        for (const wrapper of todo) {
          const dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
          const desiredWidth: number = dockItemSizeRatio * availableWidth;
          const minFail: number = Math.max(0, wrapper.getMinLayoutWidth() - desiredWidth);

          if (minFail > 0) {
            sumMinFails += minFail;
            if (minFail > maxMinFail) {
              maxMinFail = minFail;
              maxMinFailWrapper = wrapper;
            }
          } else {
            const maxFail: number = Math.max(0, desiredWidth - wrapper.getMaxLayoutWidth());
            if (maxFail > 0) {
              sumMaxFails += maxFail;
              if (maxFail > maxMaxFail) {
                maxMaxFail = maxFail;
                maxMaxFailWrapper = wrapper;
              }
            }
          }
        }

        if (sumMinFails === 0 && sumMaxFails === 0) {
          // No problems concerning min and max size
          allMinMaxProblemsSolved = true;
        } else if (sumMaxFails > sumMinFails) {
          // Max
          todo.remove(maxMaxFailWrapper);
          maxMaxFailWrapper.setResultWidth(maxMaxFailWrapper.getMaxLayoutWidth());
          availableWidth -= maxMaxFailWrapper.getResultWidth();
          sumDockItemSizes -= maxMaxFailWrapper.getDockItemSize();
        } else {
          // Min
          todo.remove(maxMinFailWrapper);
          maxMinFailWrapper.setResultWidth(maxMinFailWrapper.getMinLayoutWidth());
          availableWidth -= maxMinFailWrapper.getResultWidth();
          sumDockItemSizes -= maxMinFailWrapper.getDockItemSize();
        }
      }

      // Calculate result width for dynamic items without problems concerning min and max width
      while (!todo.isEmpty()) {
        const wrapper: LayoutableControlWrapper = todo.shift();
        const dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
        const desiredWidth: number = Math.round(dockItemSizeRatio * availableWidth);
        wrapper.setResultWidth(desiredWidth);
        availableWidth -= wrapper.getResultWidth();
        sumDockItemSizes -= wrapper.getDockItemSize();
      }

      // Find greatest min height of all dock items
      let minHeight: number = 0;
      for (const wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          minHeight = Math.max(minHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));
        }
      }

      // Total height with insets
      if (minHeight > 0) {
        minHeight += insetsTop + insetsBottom;
      }

      // Determine the container minimum height and add vertical margins
      const containerMinHeight: number = container.getMinHeight() + container.getMarginTop() + container.getMarginBottom();

      if (scrolling) {
        // If scrolling is enabled, either return the minimum container height or the fixed minimum height if the former is not set
        return Math.max(DockLayout.SCROLLING_MIN_HEIGHT, containerMinHeight);
      } else {
        // The greater value wins: The calculated minimum height for all children or defined container minimum height
        return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
      }
    }
  }

  public arrange(): void {
    const container: IDockContainer = this.getControl();

    if (container.getCurrentVisibility() === Visibility.Collapsed) {
      return;
    }

    const containerWidth: number = container.getLayoutableProperties().getLayoutWidth();
    const containerHeight: number = container.getLayoutableProperties().getLayoutHeight();

    // Consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    // Include insets (padding + border + margin) of the container
    const insetsLeft: number = container.getInsetsLeft();
    const insetsRight: number = container.getInsetsRight();
    const insetsTop: number = container.getInsetsTop();
    const insetsBottom: number = container.getInsetsBottom();

    const vSpacing: number = container.getSpacingVertical();
    const scrolling: boolean = container.getDockPanelScrolling() !== DockPanelScrolling.None;

    container.getLayoutableProperties().setHBarNeeded(false);

    if (this.isVertical) {
      const contentWidth: number = this.width - insetsLeft - insetsRight;

      let countVisibleControls: number = 0;
      let sumDockItemSizes: number = 0;
      let sumMinHeights: number = 0;
      let maxMinWidth: number = 0;
      let wrapperMeasureWidth: number = contentWidth;

      if (scrolling) {
        // Find the widest wrapper
        for (const wrapper of this.wrappers) {
          maxMinWidth = Math.max(maxMinWidth, wrapper.getMinLayoutWidth());
        }
        if (contentWidth < maxMinWidth) {
          wrapperMeasureWidth = maxMinWidth;
          container.getLayoutableProperties().setHBarNeeded(true);
        }
      }

      for (const wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeight(wrapperMeasureWidth) > 0) {
          sumMinHeights += wrapper.getMinLayoutHeightBuffered();
          countVisibleControls++;
          if (wrapper.getDockItemSize()) {
            sumDockItemSizes += wrapper.getDockItemSize();
          }
        }
      }

      // Calculate result height for auto sized items and remember all dynamic items to be processed later
      const todo: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
      let availableHeight: number = containerHeight - insetsTop - insetsBottom - Math.max(0, countVisibleControls - 1) * vSpacing;

      // If the DockPanel scrolls and the wrappers do not fit, all wrappers get auto-sized to the minimum height
      if (scrolling && sumMinHeights > availableHeight) {
        availableHeight = sumMinHeights;
      }

      for (const wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeightBuffered() > 0) {
          const minHeight: number = wrapper.getMinLayoutHeightBuffered();
          if (wrapper.getDockItemSize() == null) {
            // Auto sized items: resultSize = minSize
            wrapper.setResultHeight(minHeight);
            availableHeight -= minHeight;
          } else {
            // Dynamic items: Process later
            todo.push(wrapper);
          }
        }
      }

      // Calculate result height for dynamic items respecting min and max height
      let allMinMaxProblemsSolved: boolean = false;

      while (!todo.isEmpty() && !allMinMaxProblemsSolved) {
        // Sum up all distances below minimum and above maximum and remember the greatest distance item
        let sumMinFails: number = 0;
        let maxMinFail: number = 0;
        let sumMaxFails: number = 0;
        let maxMaxFail: number = 0;
        let maxMinFailWrapper: LayoutableControlWrapper;
        let maxMaxFailWrapper: LayoutableControlWrapper;

        for (const wrapper of todo) {
          const dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
          const desiredHeight: number = dockItemSizeRatio * availableHeight;
          const minFail: number = Math.max(0, wrapper.getMinLayoutHeightBuffered() - desiredHeight);
          if (minFail > 0) {
            sumMinFails += minFail;
            if (minFail > maxMinFail) {
              maxMinFail = minFail;
              maxMinFailWrapper = wrapper;
            }
          } else {
            const maxFail: number = Math.max(0, desiredHeight - wrapper.getMaxLayoutHeight());
            if (maxFail > 0) {
              sumMaxFails += maxFail;
              if (maxFail > maxMaxFail) {
                maxMaxFail = maxFail;
                maxMaxFailWrapper = wrapper;
              }
            }
          }
        }

        if (sumMinFails === 0 && sumMaxFails === 0) {
          // No problems concerning min and max size
          allMinMaxProblemsSolved = true;
        } else if (sumMaxFails > sumMinFails) {
          // Max
          todo.remove(maxMaxFailWrapper);
          maxMaxFailWrapper.setResultHeight(maxMaxFailWrapper.getMaxLayoutHeight());
          availableHeight -= maxMaxFailWrapper.getResultHeight();
          sumDockItemSizes -= maxMaxFailWrapper.getDockItemSize();
        } else {
          // Min
          todo.remove(maxMinFailWrapper);
          maxMinFailWrapper.setResultHeight(maxMinFailWrapper.getMinLayoutHeightBuffered());
          availableHeight -= maxMinFailWrapper.getResultHeight();
          sumDockItemSizes -= maxMinFailWrapper.getDockItemSize();
        }
      }

      // Calculate result height for dynamic items without problems concerning min and max height
      while (!todo.isEmpty()) {
        const wrapper: LayoutableControlWrapper = todo.shift();
        const dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
        const desiredHeight: number = Math.round(dockItemSizeRatio * availableHeight);
        wrapper.setResultHeight(desiredHeight);
        availableHeight -= wrapper.getResultHeight();
        sumDockItemSizes -= wrapper.getDockItemSize();
      }

      // Layout vertical
      let addSpacing: boolean = false;
      let yPos: number = 0;

      for (const wrapper of this.wrappers) {
        const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeightBuffered() > 0) {
          if (addSpacing) {
            yPos += vSpacing;
          } else {
            addSpacing = true;
          }

          const hAlignment: HorizontalAlignment = wrapper.getHorizontalAlignment();
          let resultWidth: number = Math.min(wrapperMeasureWidth, Number.maxIfNull(wrapper.getMaxLayoutWidth()));

          if (hAlignment !== HorizontalAlignment.Stretch) {
            resultWidth = Math.min(resultWidth, wrapper.getMinLayoutWidth());
          }

          let xOffset: number = 0;

          if (hAlignment === HorizontalAlignment.Right) {
            xOffset = wrapperMeasureWidth - resultWidth;
          } else if (hAlignment === HorizontalAlignment.Center) {
            xOffset = (wrapperMeasureWidth - resultWidth) / 2;
          }

          layoutableProperties.setX(xOffset);
          layoutableProperties.setY(yPos);
          layoutableProperties.setLayoutWidth(resultWidth);
          layoutableProperties.setLayoutHeight(wrapper.getResultHeight());

          yPos += wrapper.getResultHeight();

          wrapper.arrangeContainer();
        } else {
          layoutableProperties.setX(0);
          layoutableProperties.setY(0);
          layoutableProperties.setLayoutWidth(0);
          layoutableProperties.setLayoutHeight(0);
        }
      }
    } else {
      // Layout horizontal
      const hSpacing: number = container.getSpacingHorizontal();
      const contentWidth: number = containerWidth - insetsLeft - insetsRight;
      const contentHeight: number = containerHeight - insetsTop - insetsBottom;

      let arrangeHeight: number = contentHeight;
      let sumMinWidths: number = 0;
      let maxMinHeight: number = 0;
      let addSpacing: boolean = false;
      let xPos: number = 0;

      if (scrolling) {
        for (const wrapper of this.wrappers) {
          sumMinWidths += wrapper.getResultWidth();
          maxMinHeight = Math.max(maxMinHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));
        }
        if (contentWidth < sumMinWidths) {
          container.getLayoutableProperties().setHBarNeeded(true);
        }
        if (contentHeight < maxMinHeight) {
          arrangeHeight = maxMinHeight;
        }
      }

      for (const wrapper of this.wrappers) {
        const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          if (addSpacing) {
            xPos += hSpacing;
          } else {
            addSpacing = true;
          }

          const vAlignment: VerticalAlignment = wrapper.getVerticalAlignment();
          let resultHeight: number = Math.min(arrangeHeight, Number.maxIfNull(wrapper.getMaxLayoutHeight()));

          if (vAlignment !== VerticalAlignment.Stretch) {
            resultHeight = Math.min(resultHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));
          }

          let yOffset: number = 0;

          if (vAlignment === VerticalAlignment.Bottom) {
            yOffset = arrangeHeight - resultHeight;
          } else if (vAlignment === VerticalAlignment.Middle) {
            yOffset = (arrangeHeight - resultHeight) / 2;
          }

          layoutableProperties.setX(xPos);
          layoutableProperties.setY(yOffset);
          layoutableProperties.setLayoutWidth(wrapper.getResultWidth());
          layoutableProperties.setLayoutHeight(resultHeight);

          xPos += wrapper.getResultWidth();

          wrapper.arrangeContainer();
        } else {
          layoutableProperties.setX(0);
          layoutableProperties.setY(0);
          layoutableProperties.setLayoutWidth(0);
          layoutableProperties.setLayoutHeight(0);
        }
      }
    }
  }
}
