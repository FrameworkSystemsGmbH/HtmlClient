import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class LoaderService {

  private _onLoadingChanged: Subject<boolean>;
  private _onLoadingChanged$: Observable<boolean>;

  constructor() {
    this._onLoadingChanged = new Subject<boolean>();
    this._onLoadingChanged$ = this._onLoadingChanged.pipe(distinctUntilChanged());
  }

  public get onLoadingChanged(): Observable<boolean> {
    return this._onLoadingChanged$;
  }

  public fireLoadingChanged(loading: boolean): void {
    this._onLoadingChanged.next(loading);
  }
}
