import { ViewContainerRef } from '@angular/core';

import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';
import { VchContainer } from 'app/vch/vch-container';

export interface ILayoutableContainerWrapper extends ILayoutableControlWrapper, ILayoutableContainer {

  isLayoutableContainerWrapperInterface(): void;

  getVchContainer(): VchContainer;

  getViewContainerRef(): ViewContainerRef;

  getInvertFlowDirection(): boolean;

}
