import { Subject, Observable } from 'rxjs';

export class LoaderService {

  private _onLoadingChanged: Subject<boolean>;
  private _onLoadingChanged$: Observable<boolean>;

  constructor() {
    this._onLoadingChanged = new Subject<boolean>();
    this._onLoadingChanged$ = this._onLoadingChanged.asObservable();
  }

  public get onLoadingChanged(): Observable<boolean> {
    return this._onLoadingChanged$;
  }

  public fireLoadingChanged(loading: boolean): void {
    this._onLoadingChanged.next(loading);
  }
}
