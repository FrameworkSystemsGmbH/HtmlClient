import {
  Component,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ContainerComponent } from '../container.component';

@Component({
  selector: 'hc-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends ContainerComponent {

  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  public getViewContainerRef(): ViewContainerRef {
    return this.anchor;
  }
}
