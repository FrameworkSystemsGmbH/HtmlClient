import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import * as DomUtil from '@app/util/dom-util';
import * as StyleUtil from '@app/util/style-util';

@Directive({ standalone: true,
  selector: '[hcDialogResize]' })
export class DialogResizeDirective implements OnInit {

  @Input()
  public minWidth: number = 300;

  @Input()
  public maxWidth: number = 900;

  @Input()
  public ignoreHeight: boolean = false;

  private readonly _elRef: ElementRef;
  private readonly _renderer: Renderer2;

  public constructor(
    elRef: ElementRef,
    renderer: Renderer2
  ) {
    this._elRef = elRef;
    this._renderer = renderer;
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

  public ngOnInit(): void {
    this.setStyles();
  }

  private setStyles(): void {
    const maxRespWidth: number = DomUtil.getViewportWidth() * 0.9;
    const maxRespHeight: number = DomUtil.getViewportHeight() * 0.9;

    this._renderer.setStyle(this._elRef.nativeElement, 'min-width', StyleUtil.pixToRemValueStr(maxRespWidth < this.minWidth ? maxRespWidth : this.minWidth));
    this._renderer.setStyle(this._elRef.nativeElement, 'max-width', StyleUtil.pixToRemValueStr(Math.max(Math.min(this.maxWidth, maxRespWidth), this.minWidth)));

    if (!this.ignoreHeight) {
      this._renderer.setStyle(this._elRef.nativeElement, 'max-height', StyleUtil.pixToRemValueStr(maxRespHeight));
    }
  }
}
