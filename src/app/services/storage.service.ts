export interface IStorageService {

  saveData(key: string, value: string): void;
  loadData(key: string): string;

}

export abstract class StorageService {

  public abstract saveData(key: string, value: string): void;
  public abstract loadData(key: string): string;

}
