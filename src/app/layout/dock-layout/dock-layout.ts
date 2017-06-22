import { DockContainer, DockOrientation } from '.';
import { LayoutContainerBase, LayoutableControlWrapper, LayoutableControl, LayoutableProperties } from '..';
import { HorizontalAlignment, VerticalAlignment } from '../../enums';

export class DockLayout extends LayoutContainerBase {

  private width: number = -1;
  private isVertical: boolean = false;
  private wrappers: Array<LayoutableControlWrapper> = null;

  constructor(container: DockContainer) {
    super(container);
  }

  public getControl(): DockContainer {
    return super.getControl() as DockContainer;
  }

  private initWrappers(container: DockContainer): void {
    // iterate children and fill wrapper array
    let controls: Array<LayoutableControl> = container.getLayoutableControls();
    let controlCount: number = controls.length;

    this.wrappers = new LayoutableControlWrapper[controlCount];

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
    let container: DockContainer = this.getControl();

    this.initWrappers(container);

    let orientation: DockOrientation = container.getDockOrientation();
    let hSpacing: number = container.getSpacingHorizontal();

    // iterate wrappers to calculate total content min width
    let minWidth: number = 0;
    let addSpacing: boolean = false;

    for (let wrapper of this.wrappers) {
      // ignore invisible items and items with min width = 0
      if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
        // add spacing if needed
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
      // include insets (padding) of the container
      minWidth += container.getInsetsLeft() + container.getInsetsRight();
    }

    // determine at the container defined minimum size
    let containerMinWidth: number = container.getMinWidth();

    // the greater value wins: calculated minimum size for all children or defined container minimum size
    return Math.max(minWidth, Number.zeroIfNull(containerMinWidth));
  }

  /**
   * Ermittelt die minimale Höhe zur angegebenen Breite.
   * Sollte das Arrangement horizontal ausfallen, so werden in this.wrappers
   * bereits die beim Arrangieren zu verwendenden entgültigen Breiten der Controls gespeichert.
   */
  public measureMinHeight(width: number): number {
    let container: DockContainer = this.getControl();
    let orientation: DockOrientation = container.getDockOrientation();

    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let hSpacing: number = container.getSpacingHorizontal();
    let vSpacing: number = container.getSpacingVertical();

    // if the orientation is vertical, there is nothing to do right now
    if (orientation === DockOrientation.Vertical) {
      this.width = width;
      this.isVertical = true;
    } else {
      // try horizontal layout
      // iterate children and add min sizes and spaces
      let neededWidth: number = 0;
      let addSpacing: boolean = false;

      for (let wrapper of this.wrappers) {
        // ignore invisible items and items with min width = 0
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

      this.width = width;
      // do vertical layout if there is not enough width available and the orientation does not force horizontal layout
      this.isVertical = width < neededWidth && orientation !== DockOrientation.Horizontal;
    }

    if (this.isVertical) {
      let minHeight: number = 0;
      let contentWidth = width - insetsLeft - insetsRight;


      let addSpacing: boolean = false;

      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeight(contentWidth) > 0) {
          // add spacing if needed
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

      // determine at the container defined minimum height
      let containerMinHeight: number = container.getMinHeight();
      // the greater value wins: calculated minimum height or defined container minimum height
      return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
    } else {
      // horizontal layout => arrange horizontal, because the widths are needed to calculate min height

      // get sum of (visible) dock item sizes
      // and count of visible controls
      let sumDockItemSizes: number = 0;
      let countVisibleControls: number = 0;
      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          countVisibleControls++;
          if (wrapper.getDockItemSize()) {
            sumDockItemSizes += wrapper.getDockItemSize();
          }
        }
      }

      // calculate result width for auto sized items
      // and remember all dynamic items to be processed later
      let todo: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
      let availableWidth: number = width - insetsLeft - insetsRight - Math.max(0, countVisibleControls - 1) * hSpacing;

      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          if (wrapper.getDockItemSize() == null) {
            // auto sized items: resultSize = minSize
            wrapper.setResultWidth(wrapper.getMinLayoutWidth());
            availableWidth -= wrapper.getMinLayoutWidth();
          } else {
            // dynamic items: todo later
            todo.push(wrapper);
          }
        }
      }

      // calculate result width for dynamic items respecting min and max widths
      let allMinMaxProblemsSolved: boolean = false;

      while (!todo.isEmpty() && !allMinMaxProblemsSolved) {
        // sum up all distances below minimum and above maximum
        // and remember the greatest distance item
        let sumMinFails: number = 0;
        let maxMinFail: number = 0;
        let sumMaxFails: number = 0;
        let maxMaxFail: number = 0;
        let maxMinFailWrapper: LayoutableControlWrapper = null;
        let maxMaxFailWrapper: LayoutableControlWrapper = null;

        for (let wrapper of todo) {
          let dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
          let desiredWidth: number = dockItemSizeRatio * availableWidth;
          let minFail: number = Math.max(0, wrapper.getMinLayoutWidth() - desiredWidth);

          if (minFail > 0) {
            sumMinFails += minFail;
            if (minFail > maxMinFail) {
              maxMinFail = minFail;
              maxMinFailWrapper = wrapper;
            }
          } else {
            let maxFail: number = Math.max(0, desiredWidth - wrapper.getMaxLayoutWidth());
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
          // no problems concerning min and max size
          allMinMaxProblemsSolved = true;
        } else if (sumMaxFails > sumMinFails) {
          // max
          todo.remove(maxMaxFailWrapper);
          maxMaxFailWrapper.setResultWidth(maxMaxFailWrapper.getMaxLayoutWidth());
          availableWidth -= maxMaxFailWrapper.getResultWidth();
          sumDockItemSizes -= maxMaxFailWrapper.getDockItemSize();
        } else {
          // min
          todo.remove(maxMinFailWrapper);
          maxMinFailWrapper.setResultWidth(maxMinFailWrapper.getMinLayoutWidth());
          availableWidth -= maxMinFailWrapper.getResultWidth();
          sumDockItemSizes -= maxMinFailWrapper.getDockItemSize();
        }
      }

      // calculate result width for dynamic items without problems concerning min and max width
      while (!todo.isEmpty()) {
        let wrapper: LayoutableControlWrapper = todo.shift();
        let dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
        let desiredWidth: number = Math.round(dockItemSizeRatio * availableWidth);
        wrapper.setResultWidth(desiredWidth);
        availableWidth -= wrapper.getResultWidth();
        sumDockItemSizes -= wrapper.getDockItemSize();
      }

      // find greatest min height of all dock items
      let minHeight: number = 0;
      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          minHeight = Math.max(minHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));
        }
      }

      // total height with insets
      if (minHeight > 0) {
        minHeight += insetsTop + insetsBottom;
      }

      // determine at the container defined minimum height
      let containerMinHeight: number = container.getMinHeight();
      // the greater value wins: calculated minimum height or defined container minimum height
      return Math.max(minHeight, Number.zeroIfNull(containerMinHeight));
    }
  }

  /**
   * Arrangiert die Untercontrols anhand der aktuell gegebenen Breite des DockPanels.
   * Bei horizontalem Arrangement ist nicht viel zu tun, da die Methode measureMinHeight(width)
   * bereits die entgültigen Controlbreiten berechnet hat. Lediglich die Position und die Höhe muss noch gesetzt werden.
   */
  public arrange(): void {
    let container: DockContainer = this.getControl();

    let containerWidth: number = container.getLayoutableProperties().getWidth();
    let containerHeight: number = container.getLayoutableProperties().getHeight();

    // consistency check
    if (containerWidth !== this.width) {
      this.measureMinHeight(containerWidth);
    }

    // include insets (padding) of the container
    let insetsLeft: number = container.getInsetsLeft();
    let insetsRight: number = container.getInsetsRight();
    let insetsTop: number = container.getInsetsTop();
    let insetsBottom: number = container.getInsetsBottom();

    let vSpacing: number = container.getSpacingVertical();

    if (this.isVertical) {
      let contentWidth: number = this.width - insetsLeft - insetsRight;

      // get sum of (visible) dock item sizes
      // and count of visible controls
      let sumDockItemSizes: number = 0;
      let countVisibleControls: number = 0;

      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeight(contentWidth) > 0) {
          countVisibleControls++;
          if (wrapper.getDockItemSize()) {
            sumDockItemSizes += wrapper.getDockItemSize();
          }
        }
      }

      // calculate result height for auto sized items
      // and remember all dynamic items to be processed later
      let todo: Array<LayoutableControlWrapper> = new Array<LayoutableControlWrapper>();
      let availableHeight: number = containerHeight - insetsTop - insetsBottom - Math.max(0, countVisibleControls - 1) * vSpacing;

      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeightBuffered() > 0) {
          let minHeight: number = wrapper.getMinLayoutHeightBuffered();
          if (wrapper.getDockItemSize() == null) {
            // auto sized items: resultSize = minSize
            wrapper.setResultHeight(minHeight);
            availableHeight -= minHeight;
          } else {
            // dynamic items: todo later
            todo.push(wrapper);
          }
        }
      }

      // calculate result height for dynamic items respecting min and max height
      let allMinMaxProblemsSolved: boolean = false;

      while (!todo.isEmpty() && !allMinMaxProblemsSolved) {
        // sum up all distances below minimum and above maximum
        // and remember the greatest distance item
        let sumMinFails: number = 0;
        let maxMinFail: number = 0;
        let sumMaxFails: number = 0;
        let maxMaxFail: number = 0;
        let maxMinFailWrapper: LayoutableControlWrapper = null;
        let maxMaxFailWrapper: LayoutableControlWrapper = null;

        for (let wrapper of todo) {
          let dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
          let desiredHeight: number = dockItemSizeRatio * availableHeight;
          let minFail: number = Math.max(0, wrapper.getMinLayoutHeightBuffered() - desiredHeight);
          if (minFail > 0) {
            sumMinFails += minFail;
            if (minFail > maxMinFail) {
              maxMinFail = minFail;
              maxMinFailWrapper = wrapper;
            }
          } else {
            let maxFail: number = Math.max(0, desiredHeight - wrapper.getMaxLayoutHeight());
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
          // no problems concerning min and max size
          allMinMaxProblemsSolved = true;
        } else if (sumMaxFails > sumMinFails) {
          // max
          todo.remove(maxMaxFailWrapper);
          maxMaxFailWrapper.setResultHeight(maxMaxFailWrapper.getMaxLayoutHeight());
          availableHeight -= maxMaxFailWrapper.getResultHeight();
          sumDockItemSizes -= maxMaxFailWrapper.getDockItemSize();
        } else {
          // min
          todo.remove(maxMinFailWrapper);
          maxMinFailWrapper.setResultHeight(maxMinFailWrapper.getMinLayoutHeightBuffered());
          availableHeight -= maxMinFailWrapper.getResultHeight();
          sumDockItemSizes -= maxMinFailWrapper.getDockItemSize();
        }
      }

      // calculate result height for dynamic items without problems concerning min and max height
      while (!todo.isEmpty()) {
        let wrapper: LayoutableControlWrapper = todo.shift();
        let dockItemSizeRatio: number = wrapper.getDockItemSize() / sumDockItemSizes;
        let desiredHeight: number = Math.round(dockItemSizeRatio * availableHeight);
        wrapper.setResultHeight(desiredHeight);
        availableHeight -= wrapper.getResultHeight();
        sumDockItemSizes -= wrapper.getDockItemSize();
      }

      // layout vertical
      let addSpacing: boolean = false;
      let yPos: number = insetsTop;

      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutHeightBuffered() > 0) {
          if (addSpacing) {
            yPos += vSpacing;
          } else {
            addSpacing = true;
          }

          let hAlignment: HorizontalAlignment = wrapper.getAlignmentHorizontal();
          let resultWidth: number = Math.min(contentWidth, Number.maxIfNull(wrapper.getMaxLayoutWidth()));

          if (hAlignment !== HorizontalAlignment.Stretch) {
            resultWidth = Math.min(resultWidth, wrapper.getMinLayoutWidth());
          }

          let xOffset: number = 0;

          if (hAlignment === HorizontalAlignment.Right) {
            xOffset = contentWidth - resultWidth;
          } else if (hAlignment === HorizontalAlignment.Center) {
            xOffset = (contentWidth - resultWidth) / 2;
          }

          let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
          layoutableProperties.setX(insetsLeft + xOffset);
          layoutableProperties.setY(yPos);
          layoutableProperties.setWidth(resultWidth);
          layoutableProperties.setHeight(wrapper.getResultHeight());

          yPos += wrapper.getResultHeight();
        }
      }
    } else {
      // layout horizontal
      let hSpacing: number = container.getSpacingHorizontal();
      let contentHeight: number = containerHeight - insetsTop - insetsBottom;
      let addSpacing: boolean = false;
      let xPos: number = insetsLeft;

      for (let wrapper of this.wrappers) {
        if (wrapper.getIsVisible() && wrapper.getMinLayoutWidth() > 0) {
          if (addSpacing) {
            xPos += hSpacing;
          } else {
            addSpacing = true;
          }

          let vAlignment: VerticalAlignment = wrapper.getAlignmentVertical();
          let resultHeight: number = Math.min(contentHeight, Number.maxIfNull(wrapper.getMaxLayoutHeight()));

          if (vAlignment !== VerticalAlignment.Stretch) {
            resultHeight = Math.min(resultHeight, wrapper.getMinLayoutHeight(wrapper.getResultWidth()));
          }

          let yOffset: number = 0;

          if (vAlignment === VerticalAlignment.Bottom) {
            yOffset = contentHeight - resultHeight;
          } else if (vAlignment === VerticalAlignment.Middle) {
            yOffset = (contentHeight - resultHeight) / 2;
          }

          let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();
          layoutableProperties.setX(xPos);
          layoutableProperties.setY(insetsTop + yOffset);
          layoutableProperties.setWidth(wrapper.getResultWidth());
          layoutableProperties.setHeight(resultHeight);

          xPos += wrapper.getResultWidth();
        }
      }
    }
  }
}
