import { Directive, Input, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { DomUtil } from 'app/util/dom-util';

@Directive({ selector: '[hcDialogResize]' })
export class DialogResizeDirective implements OnInit {

  @Input()
  public minWidth: number = 300;

  @Input()
  public maxWidth: number = 900;

  @Input()
  public ignoreHeight: boolean;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
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
    const maxRespWidth: number = DomUtil.getViewportWidth() * 0.9;
    const maxRespHeight: number = DomUtil.getViewportHeight() * 0.9;

    this.renderer.setStyle(this.elRef.nativeElement, 'min-width', (maxRespWidth < this.minWidth ? maxRespWidth : this.minWidth) + 'px');
    this.renderer.setStyle(this.elRef.nativeElement, 'max-width', (Math.max(Math.min(this.maxWidth, maxRespWidth), this.minWidth)) + 'px');

    if (!this.ignoreHeight) {
      this.renderer.setStyle(this.elRef.nativeElement, 'max-height', maxRespHeight + 'px');
    }
  }
}
