import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { WindowRefService } from '../services';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input() mediaQuery: string;

  @Output() onMediaQueryChanged = new EventEmitter<MediaQueryList>();

  private _mediaQueryList: MediaQueryList;
  private _mediaQueryListener: (MediaQueryList) => void;

  constructor(private _windowRef: WindowRefService) { }

  public ngOnInit(): void {
    let window = this._windowRef.nativeWindow;
    this._mediaQueryListener = (mq) => { this.onMediaQueryChanged.emit(mq); };
    this._mediaQueryList = window.matchMedia(this.mediaQuery);
    this._mediaQueryList.addListener(this._mediaQueryListener);
    this.onMediaQueryChanged.emit(this._mediaQueryList);
  }

  public ngOnDestroy(): void {
    this._mediaQueryList.removeListener(this._mediaQueryListener);
  }
}
