import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public onMediaQueryChanged = new EventEmitter<MediaQueryList>();

  private mediaQueryList: MediaQueryList;
  private mediaQueryListener: (mediaQueryList: MediaQueryList) => void;

  public ngOnInit(): void {
    this.mediaQueryListener = mq => { this.onMediaQueryChanged.emit(mq); };
    this.mediaQueryList = window.matchMedia(this.mediaQuery);
    this.mediaQueryList.addListener(this.mediaQueryListener);
    this.onMediaQueryChanged.emit(this.mediaQueryList);
  }

  public ngOnDestroy(): void {
    this.mediaQueryList.removeListener(this.mediaQueryListener);
  }
}
