import { Observable } from 'rxjs';

export function voidObs(): Observable<void> {
  return new Observable<void>(sub => {
    sub.next();
    sub.complete();
  });
}
