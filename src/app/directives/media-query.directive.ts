import { Directive, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[hcMediaQuery]'
})
export class MediaQueryDirective implements OnInit, OnDestroy {

  @Input()
  public mediaQuery: string | null = null;

  @Output()
  public readonly mediaQueryChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly _zone: NgZone;

  private _mediaQueryList: MediaQueryList | null = null;

  private _mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;

  public constructor(zone: NgZone) {
    this._zone = zone;
  }

  public ngOnInit(): void {
    if (this.mediaQuery != null && this.mediaQuery.trim().length > 0) {
      this._mediaQueryListener = this.fireMediaQueryChanged.bind(this);

      this._mediaQueryList = window.matchMedia(this.mediaQuery);
      this._mediaQueryList.addListener(this._mediaQueryListener);

      this._zone.run(() => {
        if (this._mediaQueryList != null) {
          this.mediaQueryChanged.emit(this._mediaQueryList.matches);
        }
      });
    }
  }

  public ngOnDestroy(): void {
    if (this._mediaQueryList && this._mediaQueryListener) {
      this._mediaQueryList.removeListener(this._mediaQueryListener);
    }
  }

  private fireMediaQueryChanged(event: MediaQueryListEvent): void {
    this._zone.run(() => {
      this.mediaQueryChanged.emit(event.matches);
    });
  }
}
