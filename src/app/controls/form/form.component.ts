import { Component, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';

import { ContainerComponent } from '..';
import { FormWrapper } from '../../wrappers';
import { LayoutableProperties } from '../../layout';

@Component({
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends ContainerComponent {

  @ViewChild('scroller', { read: ElementRef }) scroller: ElementRef;
  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  constructor(private elRef: ElementRef) {
    super();
  }

  public getWrapper(): FormWrapper {
    return super.getWrapper() as FormWrapper;
  }

  public getContainter(): ElementRef {
    return this.elRef;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getScrollerStyles(): any {
    let wrapper: FormWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    let styles: any = {
      'overflow-x': layoutableProperties.getHBarNeeded() ? 'scroll' : 'hidden',
      'overflow-y': layoutableProperties.getVBarNeeded() ? 'scroll' : 'hidden'
    }

    return styles;
  }

  public getContentStyles(): any {
    let wrapper: FormWrapper = this.getWrapper();
    let layoutableProperties: LayoutableProperties = wrapper.getLayoutableProperties();

    let styles: any = {
      'backgroundColor': wrapper.getBackColor(),
      'width.px': layoutableProperties.getLayoutWidth(),
      'height.px': layoutableProperties.getLayoutHeight()
    }

    return styles;
  }
}
