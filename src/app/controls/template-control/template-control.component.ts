import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ControlComponent } from '@app/controls/control.component';
import { ParseMethod } from '@app/enums/parse-method';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import { FocusService } from '@app/services/focus.service';
import { BaseFormatService } from '@app/services/formatter/base-format.service';
import * as StyleUtil from '@app/util/style-util';
import { TemplateControlContentWebComp } from '@app/webcomponents/template-control-content/template-control-content.webcomp';
import { TemplateControlWrapper } from '@app/wrappers/template-control-wrapper';

@Component({
  selector: 'hc-template-control',
  templateUrl: './template-control.component.html',
  styleUrls: ['./template-control.component.scss']
})
export class TemplateControlComponent extends ControlComponent {

  @ViewChild('wrapper', { static: true })
  public wrapperEl: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('content', { static: true })
  public contentEl: ElementRef<TemplateControlContentWebComp> | null = null;

  public wrapperStyle: any;

  private readonly _baseFormatService: BaseFormatService;

  public constructor(
    cdr: ChangeDetectorRef,
    focusService: FocusService,
    baseFormatService: BaseFormatService
  ) {
    super(cdr, focusService);
    this._baseFormatService = baseFormatService;
  }

  public getWrapper(): TemplateControlWrapper {
    return super.getWrapper() as TemplateControlWrapper;
  }

  public setWrapper(wrapper: TemplateControlWrapper): void {
    super.setWrapper(wrapper);

    const globalCss: string | null = wrapper.getTemplateControlCssGlobal();
    const templateCss: string | null = wrapper.getViewTemplateCss();
    const templateHtml: string | null = wrapper.getViewTemplateHtml();

    if (this.contentEl != null) {
      this.contentEl.nativeElement.init(globalCss, templateCss, templateHtml);
    }
  }

  protected updateData(wrapper: TemplateControlWrapper): void {
    super.updateData(wrapper);

    const formattedValues: Array<string | null> = new Array<string | null>();

    for (const templateValue of wrapper.getViewTemplateValues()) {
      const value: string | null = templateValue.getValue();
      formattedValues.push(value != null ? this._baseFormatService.formatString(value, ParseMethod.Server, templateValue.getFormat(), templateValue.getFormatPattern()) : null);
    }

    if (this.contentEl != null) {
      this.contentEl.nativeElement.update(this.isEditable, formattedValues);
    }
  }

  protected updateStyles(wrapper: TemplateControlWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: TemplateControlWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isVisible: boolean = this.isVisible && layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': isVisible ? 'flex' : 'none',
      'flex-direction': 'column',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight),
      'color': StyleUtil.getForeColor(this.isEditable, wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
      'border-style': 'solid',
      'border-color': wrapper.getBorderColor(),
      'border-radius': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderRadiusTopLeft(),
        wrapper.getBorderRadiusTopRight(),
        wrapper.getBorderRadiusBottomRight(),
        wrapper.getBorderRadiusBottomLeft()),
      'border-width': StyleUtil.pixToRemFourValueStr(
        wrapper.getBorderThicknessTop(),
        wrapper.getBorderThicknessRight(),
        wrapper.getBorderThicknessBottom(),
        wrapper.getBorderThicknessLeft()),
      'margin': StyleUtil.pixToRemFourValueStr(
        wrapper.getMarginTop(),
        wrapper.getMarginRight(),
        wrapper.getMarginBottom(),
        wrapper.getMarginLeft()),
      'padding': StyleUtil.pixToRemFourValueStr(
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.rem': StyleUtil.pixToRem(wrapper.getFontSize()),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.rem': StyleUtil.pixToRem(wrapper.getLineHeight()),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };
  }
}
