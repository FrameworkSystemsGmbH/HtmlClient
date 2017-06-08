import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { WindowRefService } from '../services/windowref.service';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input() mediaQuery: string;

  @Output() onMediaQueryChanged = new EventEmitter<MediaQueryList>();

  private mediaQueryList: MediaQueryList;
  private mediaQueryListener: (MediaQueryList) => void;

  constructor(private windowRef: WindowRefService) { }

  public ngOnInit(): void {
    let window = this.windowRef.nativeWindow;
    this.mediaQueryListener = (mq) => { this.onMediaQueryChanged.emit(mq); };
    this.mediaQueryList = window.matchMedia(this.mediaQuery);
    this.mediaQueryList.addListener(this.mediaQueryListener);
    this.onMediaQueryChanged.emit(this.mediaQueryList);
  }

  public ngOnDestroy(): void {
    this.mediaQueryList.removeListener(this.mediaQueryListener);
  }
}
