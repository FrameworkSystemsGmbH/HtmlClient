/// <reference path="../../../../node_modules/cordova-plugin-file/types/index.d.ts" />

import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { StorageService } from 'app/services/storage/storage.service';

@Injectable()
export class MobileStorageService extends StorageService {

  constructor(private zone: NgZone) {
    super();
  }

  public loadData(key: string): Observable<string> {
    if (String.isNullOrWhiteSpace(key)) {
      return Observable.empty();
    }

    return this.getStorageDirectory()
      .switchMap(storageDirEntry => {
        return Observable.create((observer: Observer<string>) => {
          try {
            storageDirEntry.getFile(key + '.json', { create: false },
              storageFileEntry => {
                storageFileEntry.file(storageFile => {
                  const reader: FileReader = new FileReader();
                  reader.onloadend = e => {
                    this.zone.run(() => {
                      observer.next(reader.result);
                      observer.complete();
                    });
                  };
                  reader.onerror = e => {
                    this.zone.run(() => {
                      observer.error(e);
                    });
                  };
                  reader.readAsText(storageFile);
                });
              }
            );
          } catch (error) {
            this.zone.run(() => {
              observer.error(error);
            });
          }
        });
      });
  }

  public saveData(key: string, value: string): Observable<boolean> {
    if (String.isNullOrWhiteSpace(key) || String.isNullOrWhiteSpace(value)) {
      return Observable.of(false);
    }

    return this.getStorageDirectory()
      .switchMap(storageDirEntry => {
        return Observable.create((observer: Observer<boolean>) => {
          try {
            storageDirEntry.getFile(key + '.json', { create: true, exclusive: false },
              storageFileEntry => {
                storageFileEntry.createWriter(writer => {
                  writer.onwriteend = e => {
                    this.zone.run(() => {
                      observer.next(true);
                      observer.complete();
                    });
                  };
                  writer.onerror = e => {
                    this.zone.run(() => {
                      observer.error(e);
                    });
                  };
                  const data: Blob = new Blob([value], { type: 'text/plain' });
                  writer.write(data);
                });

              }
            );
          } catch (error) {
            this.zone.run(() => {
              observer.error(error);
            });
          }
        });
      });
  }

  public delete(key: string): Observable<boolean> {
    if (String.isNullOrWhiteSpace(key)) {
      return Observable.of(false);
    }

    return this.getStorageDirectory()
      .switchMap(storageDirEntry => {
        return Observable.create((observer: Observer<boolean>) => {
          try {
            storageDirEntry.getFile(key + '.json', { create: false },
              storageFileEntry => {
                storageFileEntry.remove(() => {
                  this.zone.run(() => {
                    observer.next(true);
                    observer.complete();
                  });
                });
              }
            );
          } catch (error) {
            this.zone.run(() => {
              observer.error(error);
            });
          }
        });
      });
  }

  private getStorageDirectory(): Observable<DirectoryEntry> {
    return Observable.create((observer: Observer<DirectoryEntry>) => {
      try {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
          dataDirEntry => {
            (dataDirEntry as DirectoryEntry).getDirectory('storage', { create: true, exclusive: false },
              storageDirEntry => {
                this.zone.run(() => {
                  observer.next(storageDirEntry);
                  observer.complete();
                });
              }
            );
          }
        );
      } catch (error) {
        this.zone.run(() => {
          observer.error(error);
        });
      }
    });
  }
}
