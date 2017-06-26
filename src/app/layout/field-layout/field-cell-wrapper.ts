import { FieldColumnWrapper } from '.';
import { LayoutableControlWrapper, LayoutableControlLabel, LayoutableControlLabelTemplate, LayoutableProperties } from '..';
import { HorizontalAlignment, VerticalAlignment, ControlVisibility } from '../../enums';

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
export class FieldCellWrapper {
  private column: FieldColumnWrapper;
  private resultWidth: number;

  /**
   * Erzeugt einen CellWrapper für das angegebene reale Control (repräsentiert durch den LayoutWrapper)
   * oder das angegebene controlLabel (repräsentiert durch das LayoutControlLabel)
   * und berücksichtigt zusätzlich das angegebene LayoutControlLabelTemplate.
   * @param layoutControlWrapper
   * @param controlLabel
   * @param labelTemplate
   */
  constructor(
    private wrapper: LayoutableControlWrapper,
    private controlLabel: LayoutableControlLabel,
    private labelTemplate: LayoutableControlLabelTemplate) { }

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
      if (this.wrapper.getAlignmentHorizontal() === HorizontalAlignment.Stretch) {
        return this.wrapper.getMaxLayoutWidth();
      } else {
        return this.wrapper.getMinLayoutWidth();
      }
    } else if (this.controlLabel) {
      return this.controlLabel.getMinLayoutWidth();
    } else if (this.labelTemplate) {
      return this.labelTemplate.getMaxWidth();
    } else {
      return Number.MAX_VALUE;
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
      return Number.MAX_VALUE;
    }
  }

  public getAlignmentHorizontal(): HorizontalAlignment {
    if (this.wrapper) {
      return this.wrapper.getAlignmentHorizontal();
    } else {
      return HorizontalAlignment.Left;
    }
  }

  public getAlignmentVertical(): VerticalAlignment {
    if (this.wrapper) {
      return this.wrapper.getAlignmentVertical();
    } else {
      return VerticalAlignment.Top;
    }
  }

  public getColumn(): FieldColumnWrapper {
    return this.column;
  }

  public setColumn(column: FieldColumnWrapper): void {
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
      let layoutProperties: LayoutableProperties = this.wrapper.getLayoutableProperties();
      layoutProperties.setX(x);
      layoutProperties.setY(y);
      layoutProperties.setLayoutWidth(width);
      layoutProperties.setLayoutHeight(height);
    } else if (this.controlLabel) {
      let layoutProperties: LayoutableProperties = this.controlLabel.getLayoutableProperties();
      layoutProperties.setX(x);
      layoutProperties.setY(y);
      layoutProperties.setLayoutWidth(width);
      layoutProperties.setLayoutHeight(height);
    }
  }
}
