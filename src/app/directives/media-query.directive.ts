import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public onMediaQueryChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private mediaQueryList: MediaQueryList;

  private mediaQueryListener: (event: MediaQueryListEvent) => void;

  public ngOnInit(): void {
    this.mediaQueryListener = this.fireOnMediaQueryChanged.bind(this);

    this.mediaQueryList = window.matchMedia(this.mediaQuery);
    // tslint:disable-next-line: deprecation
    this.mediaQueryList.addListener(this.mediaQueryListener);

    this.onMediaQueryChanged.emit(this.mediaQueryList.matches);
  }

  public ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mediaQueryList.removeListener(this.mediaQueryListener);
  }

  private fireOnMediaQueryChanged(event: MediaQueryListEvent): void {
    this.onMediaQueryChanged.emit(event.matches);
  }
}
