import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { ContainerComponent } from '..';
import { FormWrapper } from '../../wrappers';

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
}
