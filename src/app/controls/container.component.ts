import { ViewContainerRef } from '@angular/core';

import { BaseComponent } from './base.component';

export abstract class ContainerComponent extends BaseComponent {

  public abstract getViewContainerRef(): ViewContainerRef;

}
