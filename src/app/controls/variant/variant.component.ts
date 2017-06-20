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
      'backgroundColor': wrapper.getBackgroundColor()
    }

    return styles;
  }
}
