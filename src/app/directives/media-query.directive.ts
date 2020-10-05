import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public mediaQueryChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private mediaQueryList: MediaQueryList;

  private mediaQueryListener: (event: MediaQueryListEvent) => void;

  public ngOnInit(): void {
    this.mediaQueryListener = this.fireMediaQueryChanged.bind(this);

    this.mediaQueryList = window.matchMedia(this.mediaQuery);
    // tslint:disable-next-line: deprecation
    this.mediaQueryList.addListener(this.mediaQueryListener);

    this.mediaQueryChanged.emit(this.mediaQueryList.matches);
  }

  public ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mediaQueryList.removeListener(this.mediaQueryListener);
  }

  private fireMediaQueryChanged(event: MediaQueryListEvent): void {
    this.mediaQueryChanged.emit(event.matches);
  }
}
