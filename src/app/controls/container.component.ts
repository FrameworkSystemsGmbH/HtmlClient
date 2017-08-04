import { ViewContainerRef } from '@angular/core';

import { BaseComponent } from '.';

export abstract class ContainerComponent extends BaseComponent {

  public abstract getViewContainerRef(): ViewContainerRef;

}
