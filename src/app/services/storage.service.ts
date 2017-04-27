export abstract class StorageService {

  public abstract saveData(key: string, value: string): void;
  public abstract loadData(key: string): string;

}
