import { ILayoutableContainer } from 'app/layout/layoutable-container.interface';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

export function isILayoutableContainer(instance: any): instance is ILayoutableContainer {
  return instance.isILayoutableContainer !== undefined;
}

export function isILayoutableContainerWrapper(instance: any): instance is ILayoutableContainerWrapper {
  return instance.isILayoutableContainerWrapper !== undefined;
}
