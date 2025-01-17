import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { LayoutableComponent } from '@app/controls/layoutable.component';
import { Visibility } from '@app/enums/visibility';
import { ILayoutableProperties } from '@app/layout/layoutable-properties.interface';
import * as StyleUtil from '@app/util/style-util';
import { ControlLabelContainerBaseWrapper } from '@app/wrappers/control-labels/control-label-container-base-wrapper';

@Component({
    selector: 'hc-ctrl-lbl-cont',
    templateUrl: './control-label-container.component.html',
    styleUrls: ['./control-label-container.component.scss'],
    imports: [
        CommonModule
    ]
})
export class ControlLabelContainerComponent extends LayoutableComponent {

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef | null = null;

  public isVisible: boolean = true;
  public wrapperStyle: any;

  public getWrapper(): ControlLabelContainerBaseWrapper {
    return super.getWrapper() as ControlLabelContainerBaseWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    if (this.anchor == null) {
      throw new Error('Tried to access uninitialized ViewContainerRef of \'ControlLabelContainerComponent\'');
    }

    return this.anchor;
  }

  protected updateData(wrapper: ControlLabelContainerBaseWrapper): void {
    super.updateData(wrapper);
    this.isVisible = wrapper.getCurrentVisibility() === Visibility.Visible;
  }

  protected updateStyles(wrapper: ControlLabelContainerBaseWrapper): void {
    super.updateStyles(wrapper);
    this.wrapperStyle = this.createWrapperStyle(wrapper);
  }

  protected createWrapperStyle(wrapper: ControlLabelContainerBaseWrapper): any {
    const layoutableProperties: ILayoutableProperties = wrapper.getLayoutableProperties();
    const layoutWidth: number = layoutableProperties.getClientWidth();
    const layoutHeight: number = layoutableProperties.getClientHeight();
    const isSizeVisible: boolean = layoutWidth > 0 && layoutHeight > 0;

    return {
      'display': this.isVisible && isSizeVisible ? null : 'none',
      'left.rem': StyleUtil.pixToRem(layoutableProperties.getX()),
      'top.rem': StyleUtil.pixToRem(layoutableProperties.getY()),
      'width.rem': StyleUtil.pixToRem(layoutWidth),
      'height.rem': StyleUtil.pixToRem(layoutHeight)
    };
  }
}
