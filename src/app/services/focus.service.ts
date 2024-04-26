import { Injectable } from '@angular/core';
import { LastInput } from '@app/enums/last-input';
import * as KeyUtil from '@app/util/key-util';

/** Speichert sich die letzten Mouse/Keyboard Tätigkeiten, um getLeaveActivator()
 * korrekt zu befüllen.*/
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
}
