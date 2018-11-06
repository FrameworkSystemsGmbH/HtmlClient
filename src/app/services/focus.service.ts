import { LastInput } from 'app/enums/last-input';
import { ControlWrapper } from 'app/wrappers/control-wrapper';
import { VchContainer } from 'app/vch/vch-container';
import { VchControl } from 'app/vch/vch-control';
import { ILayoutableContainerWrapper } from 'app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from 'app/wrappers/layout/layoutable-control-wrapper.interface';
import { NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '../../../node_modules/@angular/core/src/view/provider';
import { InterfaceUtil } from 'app/util/interface-util';
import { FormWrapper } from 'app/wrappers/form-wrapper';

export class FocusService {

  private lastInput: LastInput;
  private lastKeyEvent: any;
  private lastMouseEvent: any;

  public getLeaveActivator(): string {
    if (this.lastInput === LastInput.Keyboard) {
      switch (this.lastKeyEvent.key.toUpperCase()) {
        case 'TAB':
          if (this.lastKeyEvent.shiftKey) {
            return 'KeyboardTabBackward';
          } else {
            return 'KeyboardTabForward';
          }
        case 'ENTER':
          return 'KeyboardEnter';
        case 'UP':
        case 'LEFT':
          return 'KeyboardUp';
        case 'DOWN':
        case 'RIGHT':
          return 'KeyboardDown';
        case 'F2':
          return 'KeyboardF2';
        default:
          return 'Undefined';
      }
    } else {
      return 'Mouse';
    }
  }

  public getLastInput(): LastInput {
    return this.lastInput;
  }

  public getLastKeyEvent(): any {
    return this.lastKeyEvent;
  }

  public setLastKeyEvent(lastKeyEvent: any): void {
    this.lastKeyEvent = lastKeyEvent;
    this.lastInput = LastInput.Keyboard;
  }

  public getLastMouseEvent(): string {
    return this.lastMouseEvent;
  }

  public setLastMouseEvent(lastMouseEvent: any): void {
    this.lastMouseEvent = lastMouseEvent;
    this.lastInput = LastInput.Mouse;
  }

  public findPreviousKeyboardFocusableControl(current: ControlWrapper): ILayoutableControlWrapper {
    // Find next control in predecessor tree
    let foundControl: ILayoutableControlWrapper = this.findPreviousKeyboardFocusableControlInSubTreeRecursive(current);

    if (foundControl) {
      return foundControl;
    }

    // Find next control starting at form level recursively
    const form: FormWrapper = current.getForm();

    foundControl = this.findPreviousKeyboardFocusableControlRecursive(form);

    return foundControl;
  }

  private findPreviousKeyboardFocusableControlInSubTreeRecursive(current: ILayoutableControlWrapper): ILayoutableControlWrapper {
    if (current == null) {
      return null;
    }

    const parent: ILayoutableContainerWrapper = current.getVchControl().getParent();

    if (parent == null) {
      return null;
    }

    const siblings: Array<ILayoutableControlWrapper> = parent.getVchContainer().getChildren();

    const vchIndex: number = siblings.findIndex(c => c === current);

    if (vchIndex < 0) {
      throw new Error('Parent of current control could not find the control in its children collection. That should not happen!');
    }

    // Check if current control is first in container
    if (vchIndex === 0) {
      return this.findPreviousKeyboardFocusableControlInSubTreeRecursive(parent);
    }

    for (let i = vchIndex - 1; i >= 0; i--) {
      const child: ILayoutableControlWrapper = siblings[i];

      if (InterfaceUtil.isLayoutableContainerWrapperInterface(child)) {
        const containerChild: ILayoutableControlWrapper = this.findPreviousKeyboardFocusableControlRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }

      if (child.canReceiveKeyboardFocus()) {
        return child;
      }
    }

    return this.findPreviousKeyboardFocusableControlInSubTreeRecursive(parent);
  }

  private findPreviousKeyboardFocusableControlRecursive(container: ILayoutableContainerWrapper): ILayoutableControlWrapper {
    if (container == null) {
      return null;
    }

    const children: Array<ILayoutableControlWrapper> = container.getVchContainer().getChildren();

    for (let i = children.length - 1; i >= 0; i--) {
      const child: ILayoutableControlWrapper = children[i];

      if (InterfaceUtil.isLayoutableContainerWrapperInterface(child)) {
        const containerChild: ILayoutableControlWrapper = this.findPreviousKeyboardFocusableControlRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }

      if (child.canReceiveKeyboardFocus()) {
        return child;
      }
    }

    if (container.canReceiveKeyboardFocus()) {
      return container;
    }

    return null;
  }

  public findNextKeyboardFocusableControl(current: ControlWrapper): ILayoutableControlWrapper {
    // Find next control in successor tree
    let foundControl: ILayoutableControlWrapper = this.findNextKeyboardFocusableControlInSubTreeRecursive(current);

    if (foundControl) {
      return foundControl;
    }

    // Find next control starting at form level recursively
    const form: FormWrapper = current.getForm();

    foundControl = this.findNextKeyboardFocusableControlRecursive(form);

    return foundControl;
  }

  private findNextKeyboardFocusableControlInSubTreeRecursive(current: ILayoutableControlWrapper): ILayoutableControlWrapper {
    if (current == null) {
      return null;
    }

    const parent: ILayoutableContainerWrapper = current.getVchControl().getParent();

    if (parent == null) {
      return null;
    }

    const siblings: Array<ILayoutableControlWrapper> = parent.getVchContainer().getChildren();

    const vchIndex: number = siblings.findIndex(c => c === current);

    if (vchIndex < 0) {
      throw new Error('Parent of current control could not find the control in its children collection. That should not happen!');
    }

    // Check if current control is last in container
    if (vchIndex === (siblings.length - 1)) {
      return this.findNextKeyboardFocusableControlInSubTreeRecursive(parent);
    }

    for (let i = vchIndex + 1; i < siblings.length; i++) {
      const child: ILayoutableControlWrapper = siblings[i];

      if (child.canReceiveKeyboardFocus()) {
        return child;
      }

      if (InterfaceUtil.isLayoutableContainerWrapperInterface(child)) {
        const containerChild: ILayoutableControlWrapper = this.findNextKeyboardFocusableControlRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }
    }

    return this.findNextKeyboardFocusableControlInSubTreeRecursive(parent);
  }

  private findNextKeyboardFocusableControlRecursive(container: ILayoutableContainerWrapper): ILayoutableControlWrapper {
    if (container == null) {
      return null;
    }

    if (container.canReceiveKeyboardFocus()) {
      return container;
    }

    const children: Array<ILayoutableControlWrapper> = container.getVchContainer().getChildren();

    for (let i = 0; i < children.length; i++) {
      const child: ILayoutableControlWrapper = children[i];

      if (child.canReceiveKeyboardFocus()) {
        return child;
      }

      if (InterfaceUtil.isLayoutableContainerWrapperInterface(child)) {
        const containerChild: ILayoutableControlWrapper = this.findNextKeyboardFocusableControlRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }
    }

    return null;
  }

  public findFirstFocusableControlInContainerRecursive(container: ILayoutableContainerWrapper): ILayoutableControlWrapper {
    if (container == null || !container.canReceiveFocus()) {
      return null;
    }

    const children: Array<ILayoutableControlWrapper> = container.getVchContainer().getChildren();

    for (let i = 0; i < children.length; i++) {
      const child: ILayoutableControlWrapper = children[i];

      if (InterfaceUtil.isLayoutableContainerWrapperInterface(child)) {
        const containerChild: ILayoutableControlWrapper = this.findFirstFocusableControlInContainerRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }

      if (child.canReceiveFocus()) {
        return child;
      }
    }

    return null;
  }
}
