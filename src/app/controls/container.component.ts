import { ViewContainerRef } from '@angular/core';

import { BaseComponent } from '.';
import { ContainerWrapper } from '../wrappers';

export abstract class ContainerComponent extends BaseComponent {

  public abstract getViewContainerRef(): ViewContainerRef;

}
