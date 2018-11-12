import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public onMediaQueryChanged = new EventEmitter<boolean>();

  private mediaQueryList: MediaQueryList;
  private mediaQueryListener: (mqle: MediaQueryListEvent) => any;

  public ngOnInit(): void {
    this.mediaQueryListener = mqle => this.onMediaQueryChanged.emit(mqle.matches);

    this.mediaQueryList = window.matchMedia(this.mediaQuery);
    this.mediaQueryList.addListener(this.mediaQueryListener);

    this.onMediaQueryChanged.emit(this.mediaQueryList.matches);
  }

  public ngOnDestroy(): void {
    this.mediaQueryList.removeListener(this.mediaQueryListener);
  }
}
