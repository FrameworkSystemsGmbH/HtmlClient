import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({ selector: '[hcMouseWheel]' })
export class MouseWheelDirective {

  @Output() mouseWheelUp = new EventEmitter();
  @Output() mouseWheelDown = new EventEmitter();

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
    let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

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
