import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, repeat, takeUntil } from 'rxjs/operators';

@Injectable()
export class LoaderService {

  private static readonly LOADER_DELAY: number = 500;

  private readonly _onLoadingChanged$$: Subject<boolean>;
  private readonly _onLoadingChangedDelayed$: Observable<boolean>;

  public constructor() {
    this._onLoadingChanged$$ = new Subject<boolean>();

    const onLoadingChanged$: Observable<boolean> = this._onLoadingChanged$$.pipe(
      distinctUntilChanged()
    );

    const onLoadingChangedOff: Observable<boolean> = onLoadingChanged$.pipe(
      filter(loading => !loading)
    );

    this._onLoadingChangedDelayed$ = merge(
      onLoadingChanged$.pipe(
        auditTime(LoaderService.LOADER_DELAY),
        takeUntil(onLoadingChangedOff),
        repeat()
      ),
      onLoadingChangedOff
    ).pipe(
      distinctUntilChanged()
    );
  }

  public get onLoadingChangedDelayed(): Observable<boolean> {
    return this._onLoadingChangedDelayed$;
  }

  public fireLoadingChanged(loading: boolean): void {
    this._onLoadingChanged$$.next(loading);
  }
}
