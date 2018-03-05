import { Observable } from 'rxjs/Observable';

export abstract class StorageService {

  public abstract saveData(key: string, value: string): Observable<boolean>;
  public abstract loadData(key: string): Observable<string>;
  public abstract delete(key: string): Observable<boolean>;

}
