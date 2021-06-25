import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({ selector: '[hcMediaQuery]' })
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string;

  @Output()
  public mediaQueryChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _mediaQueryList: MediaQueryList;

  private _mediaQueryListener: (event: MediaQueryListEvent) => void;

  public ngOnInit(): void {
    this._mediaQueryListener = this.fireMediaQueryChanged.bind(this);

    this._mediaQueryList = window.matchMedia(this.mediaQuery);
    this._mediaQueryList.addListener(this._mediaQueryListener);

    this.mediaQueryChanged.emit(this._mediaQueryList.matches);
  }

  public ngOnDestroy(): void {
    this._mediaQueryList.removeListener(this._mediaQueryListener);
  }

  private fireMediaQueryChanged(event: MediaQueryListEvent): void {
    this.mediaQueryChanged.emit(event.matches);
  }
}
