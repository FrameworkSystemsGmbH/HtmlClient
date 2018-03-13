import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ComboBoxComponent } from 'app/controls/combobox.component';
import { ComboBoxWrapper } from 'app/wrappers/combobox-wrapper';
import { StyleUtil } from 'app/util/style-util';
import { ControlVisibility } from 'app/enums/control-visibility';

export abstract class ComboBoxMobileComponent extends ComboBoxComponent {

  public tabIndexAttr: number;
  public containerStyle: any;
  public controlStyle: any;
  public valueStyle: any;

  protected updateProperties(wrapper: ComboBoxWrapper): void {
    super.updateProperties(wrapper);
    this.tabIndexAttr = (wrapper.getIsEditable() && wrapper.getTabStop()) ? 0 : -1;
  }

  protected updateStyles(wrapper: ComboBoxWrapper): void {
    this.containerStyle = this.createContainerStyle(wrapper);
    this.controlStyle = this.createControlStyle(wrapper);
    this.valueStyle = this.createValueStyle(wrapper);
  }

  protected createContainerStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
      'left.px': layoutableProperties.getX(),
      'top.px': layoutableProperties.getY(),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize()
    };

    return styles;
  }

  protected createControlStyle(wrapper: ComboBoxWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();

    const styles: any = {
      'min-width.px': 0,
      'min-height.px': 0,
      'width.px': layoutableProperties.getWidth(),
      'height.px': layoutableProperties.getHeight(),
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.getFourValue('px',
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.getFourValue('px',
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.getFourValue('px',
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'cursor': 'pointer'
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      styles['display'] = 'none';
    }

    return styles;
  }

  protected createValueStyle(wrapper: ComboBoxWrapper): any {
    const styles: any = {
      'border': 'none',
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'background-color': StyleUtil.getBackgroundColor(wrapper.getIsEditable(), wrapper.getBackColor()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };

    return styles;
  }
}
