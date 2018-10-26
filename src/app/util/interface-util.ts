import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';

export namespace InterfaceUtil {

  export function isLayoutableContainerWrapperInterface(instance: any): instance is ILayoutableContainerWrapper {
    return instance.isLayoutableContainerWrapperInterface !== undefined;
  }
}
