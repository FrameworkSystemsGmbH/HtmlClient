import { Observable, of as obsOf } from 'rxjs';
import { take } from 'rxjs/operators';

export namespace RxJsUtil {

  export function voidObs(): Observable<void> {
    return obsOf(null).pipe(
      take(1)
    );
  }

}
