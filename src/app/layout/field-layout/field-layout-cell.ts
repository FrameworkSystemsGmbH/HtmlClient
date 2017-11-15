import { ILayoutableControl } from 'app/layout/layoutable-control.interface';
import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';
import { ILayoutableControlLabelTemplate } from 'app/layout/layoutable-control-label-template.interface';

import { LayoutableControlWrapper } from 'app/layout/layoutable-control-wrapper';
import { FieldLayoutColumn } from 'app/layout/field-layout/field-layout-column';
import { ControlVisibility } from 'app/enums/control-visibility';
import { HorizontalAlignment } from 'app/enums/horizontal-alignment';
import { VerticalAlignment } from 'app/enums/vertical-alignment';

/**
 * Die Klasse wrappt eine Zelle in einem FieldPanel.
 * Die verschiedenen Arten unterscheiden sich wie folgt:
 * 1. Nur LabelTemplate ist gesetzt => leere Zelle / Platzhalter
 * 2. Nur ControlLabel ist gesetzt => (generiertes) ControlLabel
 * 3. Nur LayoutControlWrapper ist gesetzt => reales Control
 * 4. Zusätzlich zu ControlLabel oder LayoutControlWrapper ist LabelTemplate gesetzt
 *    => für MinWidth und MaxWidth muss zusätzlich zu ControlLabel/LayoutControlWrapper
 *       das LabelTemplate berücksichtigt werden (für erste Spalte interessant).
 */
export class FieldLayoutCell {
  private column: FieldLayoutColumn;
  private resultWidth: number;

  /**
   * Erzeugt einen CellWrapper für das angegebene reale Control (repräsentiert durch den LayoutWrapper)
   * oder das angegebene controlLabel (repräsentiert durch das LayoutControlLabel)
   * und berücksichtigt zusätzlich das angegebene LayoutControlLabelTemplate.
   */
  constructor(
    private wrapper: LayoutableControlWrapper,
    private controlLabel: ILayoutableControl,
    private labelTemplate: ILayoutableControlLabelTemplate) { }

  public isVisible(): boolean {
    if (this.wrapper) {
      return this.wrapper.getIsVisible();
    } else if (this.controlLabel) {
      return this.controlLabel.getVisibility() !== ControlVisibility.Collapsed;
    } else {
      return true;
    }
  }

  public getMinWidth(): number {
    let minWidth = this.labelTemplate ? Number.zeroIfNull(this.labelTemplate.getMinWidth()) : 0;

    if (this.wrapper) {
      minWidth = Math.max(minWidth, this.wrapper.getMinLayoutWidth());
    } else if (this.controlLabel) {
      minWidth = Math.max(minWidth, this.controlLabel.getMinLayoutWidth());
    }

    if (this.labelTemplate != null) {
      minWidth = Math.min(minWidth, Number.zeroIfNull(this.labelTemplate.getMaxWidth()));
    }

    return minWidth;
  }

  public getColumnOrCellMinWidth(): number {
    if (this.column) {
      return this.column.getMinColumnWidth();
    } else {
      return this.getMinWidth();
    }
  }

  public getMaxWidth(): number {
    if (this.wrapper) {
      if (this.wrapper.getHorizontalAlignment() === HorizontalAlignment.Stretch) {
        return this.wrapper.getMaxLayoutWidth();
      } else {
        return this.wrapper.getMinLayoutWidth();
      }
    } else if (this.controlLabel) {
      return this.controlLabel.getMinLayoutWidth();
    } else if (this.labelTemplate) {
      return this.labelTemplate.getMaxWidth();
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  public getMinHeight(): number {
    if (this.wrapper) {
      return this.wrapper.getMinLayoutHeight(this.resultWidth);
    } else if (this.controlLabel != null) {
      return this.controlLabel.getMinLayoutHeight(this.resultWidth);
    } else {
      return 0;
    }
  }

  public getMaxHeight(): number {
    if (this.wrapper != null) {
      return this.wrapper.getMaxLayoutHeight();
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    if (this.wrapper) {
      return this.wrapper.getHorizontalAlignment();
    } else {
      return HorizontalAlignment.Left;
    }
  }

  public getAlignmentVertical(): VerticalAlignment {
    if (this.wrapper) {
      return this.wrapper.getVerticalAlignment();
    } else {
      return VerticalAlignment.Top;
    }
  }

  public getColumn(): FieldLayoutColumn {
    return this.column;
  }

  public setColumn(column: FieldLayoutColumn): void {
    this.column = column;
  }

  public getResultWidth(): number {
    return this.resultWidth;
  }

  public setResultWidth(value: number): void {
    this.resultWidth = value;
  }

  public arrange(x: number, y: number, width: number, height: number): void {
    if (this.wrapper) {
      const layoutProperties: ILayoutableProperties = this.wrapper.getLayoutableProperties();
      layoutProperties.setX(x);
      layoutProperties.setY(y);
      layoutProperties.setLayoutWidth(width);
      layoutProperties.setLayoutHeight(height);
    } else if (this.controlLabel) {
      const layoutProperties: ILayoutableProperties = this.controlLabel.getLayoutableProperties();
      layoutProperties.setX(x);
      layoutProperties.setY(y);
      layoutProperties.setLayoutWidth(width);
      layoutProperties.setLayoutHeight(height);
    }
  }
}
