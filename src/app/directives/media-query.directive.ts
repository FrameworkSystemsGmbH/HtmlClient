import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public onMediaQueryChanged = new EventEmitter<boolean>();

  private mediaQueryList: MediaQueryList;

  public ngOnInit(): void {
    this.mediaQueryList = window.matchMedia(this.mediaQuery);

    this.mediaQueryList.addListener(this.fireOnMediaQueryChanged.bind(this));

    this.onMediaQueryChanged.emit(this.mediaQueryList.matches);
  }

  public ngOnDestroy(): void {
    this.mediaQueryList.removeListener(this.fireOnMediaQueryChanged.bind(this));
  }

  private fireOnMediaQueryChanged(event: MediaQueryListEvent) {
    this.onMediaQueryChanged.emit(event.matches);
  }
}
