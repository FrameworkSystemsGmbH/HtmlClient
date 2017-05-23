import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '..';

@Component({
  selector: 'hc-wrp-panel',
  templateUrl: './wrap-panel.component.html',
  styleUrls: ['./wrap-panel.component.scss']
})
export class WrapPanelComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }

}
