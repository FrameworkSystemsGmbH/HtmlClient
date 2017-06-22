import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '..';
import { VariantWrapper } from '../../wrappers';

@Component({
  selector: 'hc-variant',
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.scss']
})
export class VariantComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getWrapper(): VariantWrapper {
    return super.getWrapper() as VariantWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getStyles(): any {
    let wrapper: VariantWrapper = this.getWrapper();

    let styles: any = {
      'left.px': wrapper.getLayoutableProperties().getX(),
      'top.px': wrapper.getLayoutableProperties().getY(),
      'width.px': wrapper.getLayoutableProperties().getWidth(),
      'height.px': wrapper.getLayoutableProperties().getHeight(),
      'background-color': wrapper.getBackgroundColor(),
      'border-left': wrapper.getBorderThicknessLeft() + 'px solid',
      'border-right': wrapper.getBorderThicknessRight() + 'px solid',
      'border-top': wrapper.getBorderThicknessTop() + 'px solid',
      'border-bottom': wrapper.getBorderThicknessBottom() + 'px solid',
      'margin-left.px': wrapper.getMarginLeft(),
      'margin-right.px': wrapper.getMarginRight(),
      'margin-top.px': wrapper.getMarginTop(),
      'margin-bottom.px': wrapper.getMarginBottom(),
      'padding-left.px': wrapper.getPaddingLeft(),
      'padding-right.px': wrapper.getPaddingRight(),
      'padding-top.px': wrapper.getPaddingTop(),
      'padding-bottom.px': wrapper.getPaddingBottom()
    }

    return styles;
  }
}
