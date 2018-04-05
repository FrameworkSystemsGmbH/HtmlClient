import { Component, ViewChild, Output, EventEmitter, OnInit, DoCheck } from '@angular/core';
import { MatCheckbox } from '@angular/material';

import { ControlComponent } from 'app/controls/control.component';
import { CheckBoxWrapper } from 'app/wrappers/checkbox-wrapper';
import { ControlVisibility } from 'app/enums/control-visibility';
import { StyleUtil } from 'app/util/style-util';
import { DomUtil } from 'app/util/dom-util';

@Component({
  selector: 'hc-chkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckBoxComponent extends ControlComponent implements OnInit, DoCheck {

  @ViewChild('checkBox')
  public checkBox: MatCheckbox;

  @Output()
  public onClick: EventEmitter<any>;

  public value: boolean;
  public caption: string;
  public showCaption: boolean;
  public isEditable: boolean;

  public tabIndexAttr: number;

  public wrapperStyle: any;
  public labelStyle: any;

  public ngOnInit(): void {
    this.updateComponent();
  }

  public ngDoCheck(): void {
    this.updateStyles(this.getWrapper());
    this.updateInput();
  }

  public callOnClick(event: any): void {
    this.updateWrapper();
    if (this.getWrapper().hasOnClickEvent()) {
      this.onClick.emit(event);
    }
  }

  public onWrapperMouseDown(event: any): void {
    if (!event.target || !DomUtil.isDescentantOrSelf(this.checkBox._inputElement.nativeElement, event.target)) {
      event.preventDefault();
    }
  }

  public onLabelClick(event: any): void {
    this.setFocus();
    if (this.isEditable) {
      this.checkBox.ripple.launch(null);
      this.value = !this.value;
      this.callOnClick(event);
    }
  }

  public getWrapper(): CheckBoxWrapper {
    return super.getWrapper() as CheckBoxWrapper;
  }

  public setWrapper(wrapper: CheckBoxWrapper): void {
    super.setWrapper(wrapper);

    if (wrapper.hasOnClickEvent()) {
      this.onClick = new EventEmitter<any>();
    }
  }

  protected updateInput(): void {
    if (this.checkBox) {
      (this.checkBox._inputElement.nativeElement as HTMLInputElement).tabIndex = this.tabIndexAttr;
    }
  }

  public updateComponent(): void {
    const wrapper: CheckBoxWrapper = this.getWrapper();
    this.updateProperties(wrapper);
    this.updateStyles(wrapper);
  }

  protected updateWrapper(): void {
    this.getWrapper().setValue(this.value);
  }

  protected updateProperties(wrapper: CheckBoxWrapper): void {
    this.value = wrapper.getValue();
    this.caption = wrapper.getCaption();
    this.showCaption = wrapper.showCaption();
    this.isEditable = wrapper.getIsEditable();
    this.tabIndexAttr = this.isEditable && wrapper.getTabStop() ? null : -1;
  }

  protected updateStyles(wrapper: CheckBoxWrapper): void {
    this.wrapperStyle = this.createWrapperStyle(wrapper);
    this.labelStyle = this.createLabelStyle(wrapper);
  }

  public createWrapperStyle(wrapper: CheckBoxWrapper): any {
    const style: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'color': StyleUtil.getForeColor(wrapper.getIsEditable(), wrapper.getForeColor()),
      'background-color': wrapper.getBackColor(),
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
      'padding': StyleUtil.getFourValue('px',
        wrapper.getPaddingTop(),
        wrapper.getPaddingRight(),
        wrapper.getPaddingBottom(),
        wrapper.getPaddingLeft()),
      'font-family': wrapper.getFontFamily(),
      'font-style': StyleUtil.getFontStyle(wrapper.getFontItalic()),
      'font-size.px': wrapper.getFontSize(),
      'font-weight': StyleUtil.getFontWeight(wrapper.getFontBold()),
      'line-height.px': wrapper.getLineHeight(),
      'text-decoration': StyleUtil.getTextDecoration(wrapper.getFontUnderline())
    };

    if (wrapper.getVisibility() === ControlVisibility.Collapsed) {
      style['display'] = 'none';
    }

    return style;
  }

  public createLabelStyle(wrapper: CheckBoxWrapper): any {
    const style: any = {
      'padding-left.px': wrapper.getLabelGap(),
      'cursor': this.isEditable ? 'pointer' : 'default'
    };

    return style;
  }

  public setFocus(): void {
    this.checkBox.focus();
    this.checkBox.ripple.fadeOutAll();
  }
}
