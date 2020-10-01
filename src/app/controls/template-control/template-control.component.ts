import { Component, ViewChild, ElementRef, Injector } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { TemplateControlWrapper } from 'app/wrappers/template-control-wrapper';
import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { ParseMethod } from 'app/enums/parse-method';

import * as StyleUtil from 'app/util/style-util';

@Component({
  selector: 'hc-template-control',
  templateUrl: './template-control.component.html',
  styleUrls: ['./template-control.component.scss']
})
export class TemplateControlComponent extends ControlComponent {

  @ViewChild('wrapper', { static: true })
  public wrapperEl: ElementRef;

  @ViewChild('content', { static: true })
  public contentEl: ElementRef;

  public wrapperStyle: any;

  private baseFormatService: BaseFormatService;

  constructor(injector: Injector) {
    super(injector);
  }

  protected init(): void {
    super.init();
    this.baseFormatService = this.getInjector().get(BaseFormatService);
  }

  public getWrapper(): TemplateControlWrapper {
    return super.getWrapper() as TemplateControlWrapper;
  }

  public setWrapper(wrapper: TemplateControlWrapper): void {
    super.setWrapper(wrapper);

    const templateCss: string = wrapper.getViewTemplateCss();
    const templateHtml: string = wrapper.getViewTemplateHtml();

    this.contentEl.nativeElement.init(templateCss, templateHtml);
  }

  protected updateData(wrapper: TemplateControlWrapper): void {
    super.updateData(wrapper);

    const formattedValues: Array<string> = new Array<string>();

    for (const templateValue of wrapper.getViewTemplateValues()) {
      formattedValues.push(this.baseFormatService.formatString(templateValue.getValue(), ParseMethod.Server, templateValue.getFormat(), templateValue.getFormatPattern()));
    }

    this.contentEl.nativeElement.update(this.isEditable, formattedValues);
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
