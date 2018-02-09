import { Directive, OnInit, ElementRef, Renderer2, NgZone, HostListener } from '@angular/core';
import { DomUtil } from 'app/util/dom-util';

@Directive({ selector: '[hcDialogResize]' })
export class DialogResizeDirective implements OnInit {

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone
  ) { }

  public ngOnInit(): void {
    this.setStyles();
  }

  @HostListener('window:keyboardDidShow')
  public onKeyboardShown(): void {
    this.setStyles();
  }

  @HostListener('window:keyboardDidHide')
  public onKeyboardHidden(): void {
    this.setStyles();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.setStyles();
  }

  private setStyles(): void {
    this.zone.run(() => {
      const maxWidth: number = DomUtil.getViewportWidth() * 0.9;
      const maxHeight: number = DomUtil.getViewportHeight() * 0.9;
      this.renderer.setStyle(this.elRef.nativeElement, 'min-width', (maxWidth < 300 ? maxWidth : 300) + 'px');
      this.renderer.setStyle(this.elRef.nativeElement, 'max-width', (Math.min(900, maxWidth)) + 'px');
      this.renderer.setStyle(this.elRef.nativeElement, 'max-height', maxHeight + 'px');
    });
  }
}
