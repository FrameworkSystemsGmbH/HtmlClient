import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '../container.component';
import { FormWrapper } from '../../wrappers/form-wrapper';
import { LayoutableProperties } from '../../layout';

@Component({
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getWrapper(): FormWrapper {
    return super.getWrapper() as FormWrapper;
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

    let styles: any = {
      'backgroundColor': wrapper.getBackColor()
    }

    return styles;
  }
}
