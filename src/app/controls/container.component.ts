import { ViewContainerRef } from '@angular/core';

import { ControlComponent } from 'app/controls/control.component';

export abstract class ContainerComponent extends ControlComponent {

  public abstract getViewContainerRef(): ViewContainerRef;

}
