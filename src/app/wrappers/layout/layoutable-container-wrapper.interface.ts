import { ViewContainerRef } from '@angular/core';
import { ILayoutableContainer } from '@app/layout/layoutable-container.interface';
import { VchContainer } from '@app/vch/vch-container';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

export interface ILayoutableContainerWrapper extends ILayoutableControlWrapper, ILayoutableContainer {

  isILayoutableContainerWrapper: () => void;

  getVchContainer: () => VchContainer;

  getViewContainerRef: () => ViewContainerRef;

  getInvertFlowDirection: () => boolean;

}
