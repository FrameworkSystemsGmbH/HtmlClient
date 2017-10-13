import { LastInput } from '../enums/last-input';

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
          return 'KeyboardUp';
        case 'DOWN':
          return 'KeyboardDown';
        case 'F2':
          return 'KeyboardF2';
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
}
