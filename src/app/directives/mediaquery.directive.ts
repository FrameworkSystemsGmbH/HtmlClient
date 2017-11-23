import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { NativeService } from 'app/services/native.service';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public onMediaQueryChanged = new EventEmitter<MediaQueryList>();

  private mediaQueryList: MediaQueryList;
  private mediaQueryListener: (mediaQueryList: MediaQueryList) => void;

  constructor(private nativeService: NativeService) { }

  public ngOnInit(): void {
    this.mediaQueryListener = mq => { this.onMediaQueryChanged.emit(mq); };
    this.mediaQueryList = this.nativeService.window.matchMedia(this.mediaQuery);
    this.mediaQueryList.addListener(this.mediaQueryListener);
    this.onMediaQueryChanged.emit(this.mediaQueryList);
  }

  public ngOnDestroy(): void {
    this.mediaQueryList.removeListener(this.mediaQueryListener);
  }
}
