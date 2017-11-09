import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '../container.component';
import { FormWrapper } from '../../wrappers/form-wrapper';
import { LayoutablePropertiesScrollable } from 'app/wrappers/layout/layoutable-properties-scrollable';

@Component({
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef })
  public anchor: ViewContainerRef;

  public getWrapper(): FormWrapper {
    return super.getWrapper() as FormWrapper;
  }

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

  public getScrollerStyles(): any {
    const wrapper: FormWrapper = this.getWrapper();
    const layoutableProperties: LayoutablePropertiesScrollable = wrapper.getLayoutableProperties();

    const styles: any = {
      'overflow-x': layoutableProperties.getHBarNeeded() ? 'scroll' : 'hidden',
      'overflow-y': 'auto'
    };

    return styles;
  }

  public getContentStyles(): any {
    const wrapper: FormWrapper = this.getWrapper();

    const styles: any = {
      'backgroundColor': wrapper.getBackColor()
    };

    return styles;
  }
}
