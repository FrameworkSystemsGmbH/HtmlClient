import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/** Werden nicht mehr verwendet. Früher gab es Unterschiede zw. Chrome und IE,
 * wie die Events abgefangen werden.
*/
@Directive({
  standalone: true,
  selector: '[hcMouseWheel]'
})
export class MouseWheelDirective {

  @Output()
  public readonly mouseWheelUp: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public readonly mouseWheelDown: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('mousewheel', ['$event'])
  public onMouseWheelChrome(event: any): void {
    this.mouseWheelFunc(event);
  }

  @HostListener('DOMMouseScroll', ['$event'])
  public onMouseWheelFirefox(event: any): void {
    this.mouseWheelFunc(event);
  }

  @HostListener('onmousewheel', ['$event'])
  public onMouseWheelIe(event: any): void {
    this.mouseWheelFunc(event);
  }

  private mouseWheelFunc(event: any): void {
    const delta = Math.max(-1, Math.min(1, event.wheelDelta ?? -event.detail));

    if (delta > 0) {
      this.mouseWheelUp.emit(event);
    } else if (delta < 0) {
      this.mouseWheelDown.emit(event);
    }

    // For IE
    event.returnValue = false;

    // For Chrome and Firefox
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
}
