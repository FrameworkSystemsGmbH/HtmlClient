import { ViewContainerRef } from '@angular/core';

import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';
import { VchContainer } from 'app/vch/vch-container';

export interface ILayoutableContainerWrapper extends ILayoutableContainer {

  getVchContainer(): VchContainer;

  getViewContainerRef(): ViewContainerRef;

  getInvertFlowDirection(): boolean;

}
