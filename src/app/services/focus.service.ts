import { Injectable } from '@angular/core';
import { LastInput } from '@app/enums/last-input';
import * as InterfaceUtil from '@app/util/interface-util';
import * as KeyUtil from '@app/util/key-util';
import { ControlWrapper } from '@app/wrappers/control-wrapper';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { ILayoutableContainerWrapper } from '@app/wrappers/layout/layoutable-container-wrapper.interface';
import { ILayoutableControlWrapper } from '@app/wrappers/layout/layoutable-control-wrapper.interface';

@Injectable({ providedIn: 'root' })
export class FocusService {

  private _lastInput: LastInput | null = null;
  private _lastKeyEvent: KeyboardEvent | null = null;
  private _lastMouseEvent: MouseEvent | null = null;

  public getLeaveActivator(): string {
    if (this._lastInput === LastInput.Keyboard) {
      if (this._lastKeyEvent != null) {
        switch (KeyUtil.getKeyString(this._lastKeyEvent)) {
          case 'Tab':
            if (this._lastKeyEvent.shiftKey) {
              return 'KeyboardTabBackward';
            } else {
              return 'KeyboardTabForward';
            }
          case 'Enter':
            return 'KeyboardEnter';
          case 'ArrowUp':
          case 'ArrowLeft':
            return 'KeyboardUp';
          case 'ArrowDown':
          case 'ArrowRight':
            return 'KeyboardDown';
          case 'F2':
            return 'KeyboardF2';
          default:
            return 'Undefined';
        }
      } else {
        return 'Undefined';
      }
    } else {
      return 'Mouse';
    }
  }

  public getLastInput(): LastInput | null {
    return this._lastInput;
  }

  public getLastKeyEvent(): KeyboardEvent | null {
    return this._lastKeyEvent;
  }

  public setLastKeyEvent(lastKeyEvent: KeyboardEvent): void {
    this._lastKeyEvent = lastKeyEvent;
    this._lastInput = LastInput.Keyboard;
  }

  public getLastMouseEvent(): MouseEvent | null {
    return this._lastMouseEvent;
  }

  public setLastMouseEvent(lastMouseEvent: MouseEvent): void {
    this._lastMouseEvent = lastMouseEvent;
    this._lastInput = LastInput.Mouse;
  }

  public findPreviousKeyboardFocusableControl(current: ControlWrapper): ILayoutableControlWrapper | null {
    // Find next control in predecessor tree
    let foundControl: ILayoutableControlWrapper | null = this.findPreviousKeyboardFocusableControlInSubTreeRecursive(current);

    if (foundControl) {
      return foundControl;
    }

    // Find next control starting at form level recursively
    const form: FormWrapper | null = current.getForm();

    foundControl = this.findPreviousKeyboardFocusableControlRecursive(form);

    return foundControl;
  }

  private findPreviousKeyboardFocusableControlInSubTreeRecursive(current: ILayoutableControlWrapper): ILayoutableControlWrapper | null {
    const parent: ILayoutableContainerWrapper | null = current.getVchControl().getParent();

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

      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = this.findPreviousKeyboardFocusableControlRecursive(child);

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

  private findPreviousKeyboardFocusableControlRecursive(container: ILayoutableContainerWrapper | null): ILayoutableControlWrapper | null {
    if (container == null) {
      return null;
    }

    const children: Array<ILayoutableControlWrapper> = container.getVchContainer().getChildren();

    for (let i = children.length - 1; i >= 0; i--) {
      const child: ILayoutableControlWrapper = children[i];

      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = this.findPreviousKeyboardFocusableControlRecursive(child);

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

  public findNextKeyboardFocusableControl(current: ControlWrapper): ILayoutableControlWrapper | null {
    // Find next control in successor tree
    let foundControl: ILayoutableControlWrapper | null = this.findNextKeyboardFocusableControlInSubTreeRecursive(current);

    if (foundControl) {
      return foundControl;
    }

    // Find next control starting at form level recursively
    const form: FormWrapper | null = current.getForm();

    foundControl = this.findNextKeyboardFocusableControlRecursive(form);

    return foundControl;
  }

  private findNextKeyboardFocusableControlInSubTreeRecursive(current: ILayoutableControlWrapper): ILayoutableControlWrapper | null {
    const parent: ILayoutableContainerWrapper | null = current.getVchControl().getParent();

    if (parent == null) {
      return null;
    }

    const siblings: Array<ILayoutableControlWrapper> = parent.getVchContainer().getChildren();

    const vchIndex: number = siblings.findIndex(c => c === current);

    if (vchIndex < 0) {
      throw new Error('Parent of current control could not find the control in its children collection. That should not happen!');
    }

    // Check if current control is last in container
    if (vchIndex === siblings.length - 1) {
      return this.findNextKeyboardFocusableControlInSubTreeRecursive(parent);
    }

    for (let i = vchIndex + 1; i < siblings.length; i++) {
      const child: ILayoutableControlWrapper = siblings[i];

      if (child.canReceiveKeyboardFocus()) {
        return child;
      }

      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = this.findNextKeyboardFocusableControlRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }
    }

    return this.findNextKeyboardFocusableControlInSubTreeRecursive(parent);
  }

  private findNextKeyboardFocusableControlRecursive(container: ILayoutableContainerWrapper | null): ILayoutableControlWrapper | null {
    if (container == null) {
      return null;
    }

    if (container.canReceiveKeyboardFocus()) {
      return container;
    }

    const children: Array<ILayoutableControlWrapper> = container.getVchContainer().getChildren();

    for (const child of children) {
      if (child.canReceiveKeyboardFocus()) {
        return child;
      }

      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = this.findNextKeyboardFocusableControlRecursive(child);

        if (containerChild) {
          return containerChild;
        }
      }
    }

    return null;
  }

  public findFirstFocusableControlInContainerRecursive(container: ILayoutableContainerWrapper): ILayoutableControlWrapper | null {
    if (!container.canReceiveFocus()) {
      return null;
    }

    const children: Array<ILayoutableControlWrapper> = container.getVchContainer().getChildren();

    for (const child of children) {
      if (InterfaceUtil.isILayoutableContainerWrapper(child)) {
        const containerChild: ILayoutableControlWrapper | null = this.findFirstFocusableControlInContainerRecursive(child);

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
