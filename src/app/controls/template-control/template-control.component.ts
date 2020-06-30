import { Component, ViewChild, ViewContainerRef, OnInit, ElementRef, ComponentRef, Injector } from '@angular/core';

import { ILayoutableProperties } from 'app/layout/layoutable-properties.interface';

import { ControlComponent } from 'app/controls/control.component';
import { TemplateControlWrapper } from 'app/wrappers/template-control-wrapper';
import { TemplateControlContentComponent } from 'app/controls/template-control/template-control-content.component';
import { BaseFormatService } from 'app/services/formatter/base-format.service';
import { ParseMethod } from 'app/enums/parse-method';

import * as StyleUtil from 'app/util/style-util';

@Component({
  selector: 'hc-template-control',
  templateUrl: './template-control.component.html',
  styleUrls: ['./template-control.component.scss']
})
export class TemplateControlComponent extends ControlComponent implements OnInit {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef;

  @ViewChild('wrapper', { static: true })
  public wrapperEl: ElementRef;

  public wrapperStyle: any;

  private values: Array<string>;
  private contentCompRef: ComponentRef<TemplateControlContentComponent>;
  private contentCompInstance: TemplateControlContentComponent;

  private baseFormatService: BaseFormatService;

  constructor(injector: Injector) {
    super(injector);
  }

  protected init(): void {
    super.init();
    this.baseFormatService = this.getInjector().get(BaseFormatService);
  }

  public ngOnInit(): void {
    this.attachContentComponent();
    this.updateComponent();
  }

  public getWrapper(): TemplateControlWrapper {
    return super.getWrapper() as TemplateControlWrapper;
  }

  public setWrapper(wrapper: TemplateControlWrapper): void {
    super.setWrapper(wrapper);
  }

  private attachContentComponent(): void {
    this.contentCompRef = this.anchor.createComponent(this.getWrapper().getTemplateFactory());
    this.contentCompInstance = this.contentCompRef.instance;
  }

  protected updateData(wrapper: TemplateControlWrapper): void {
    super.updateData(wrapper);
    this.values = wrapper.getValues().map(v => this.baseFormatService.formatString(v.getValue(), ParseMethod.Server, v.getFormat(), v.getFormatPattern()));
    this.setContentValues();
  }

  private setContentValues(): void {
    if (!this.contentCompInstance) {
      return;
    }

    this.contentCompInstance.enabled = this.isEditable;
    this.contentCompInstance.values = this.values;
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
