import { ILayoutableControl } from '@app/layout/layoutable-control.interface';
import { VchControl } from '@app/vch/vch-control';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';

export interface ILayoutableControlWrapper extends ILayoutableControl {

  getVchControl(): VchControl;

  attachComponent(uiContainer: ILayoutableContainerWrapper, vchContainer: ILayoutableContainerWrapper): void;

  onComponentDestroyed(): void;

  canReceiveFocus(): boolean;

  canReceiveKeyboardFocus(): boolean;

  setFocus(): void;

}
