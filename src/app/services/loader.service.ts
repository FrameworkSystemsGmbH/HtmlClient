import { Injectable } from '@angular/core';
import { Subject, Observable, merge } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, repeat, takeUntil } from 'rxjs/operators';

@Injectable()
export class LoaderService {

  private static readonly LOADER_DELAY: number = 100;

  private _onLoadingChanged: Subject<boolean>;
  private _onLoadingChanged$: Observable<boolean>;
  private _onLoadingChangedDelayed$: Observable<boolean>;

  constructor() {
    this._onLoadingChanged = new Subject<boolean>();
    this._onLoadingChanged$ = this._onLoadingChanged.asObservable();

    const onLoadingChangedOff: Observable<boolean> = this._onLoadingChanged$.pipe(
      filter(loading => loading !== true)
    );

    this._onLoadingChangedDelayed$ = merge(
      this._onLoadingChanged$.pipe(
        auditTime(LoaderService.LOADER_DELAY),
        takeUntil(onLoadingChangedOff),
        repeat()
      ),
      onLoadingChangedOff
    ).pipe(
      distinctUntilChanged()
    );
  }

  public get onLoadingChanged(): Observable<boolean> {
    return this._onLoadingChanged$;
  }

  public get onLoadingChangedDelayed(): Observable<boolean> {
    return this._onLoadingChangedDelayed$;
  }

  public fireLoadingChanged(loading: boolean): void {
    this._onLoadingChanged.next(loading);
  }
}
