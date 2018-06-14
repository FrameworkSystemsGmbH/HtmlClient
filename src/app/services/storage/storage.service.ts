import { Observable } from 'rxjs';

export abstract class StorageService {

  public abstract loadData(key: string): Observable<string>;
  public abstract saveData(key: string, value: string): Observable<boolean>;
  public abstract delete(key: string): Observable<boolean>;

}
