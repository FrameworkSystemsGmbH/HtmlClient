import { ViewContainerRef } from '@angular/core';

import { ControlComponent } from './control.component';

export abstract class ContainerComponent extends ControlComponent {

  public abstract getViewContainerRef(): ViewContainerRef;

}
