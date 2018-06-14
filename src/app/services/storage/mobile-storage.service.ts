/// <reference path="../../../../node_modules/cordova-plugin-file/types/index.d.ts" />

import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer, empty as obsEmpty, of as obsOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { StorageService } from 'app/services/storage/storage.service';

@Injectable()
export class MobileStorageService extends StorageService {

  constructor(private zone: NgZone) {
    super();
  }

  public loadData(key: string): Observable<string> {
    if (String.isNullOrWhiteSpace(key)) {
      return obsEmpty();
    }

    return this.getStorageDirectory().pipe(
      switchMap(storageDirEntry => {
        return Observable.create((observer: Observer<string>) => {
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
              },
                error => {
                  this.zone.run(() => {
                    observer.error(error);
                  });
                }
              );
            },
            error => {
              this.zone.run(() => {
                if (error.code === 1) {
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.error(error);
                }
              });
            }
          );
        });
      })
    );
  }

  public saveData(key: string, value: string): Observable<boolean> {
    if (String.isNullOrWhiteSpace(key) || String.isNullOrWhiteSpace(value)) {
      return obsOf(false);
    }

    return this.getStorageDirectory().pipe(
      switchMap(storageDirEntry => {
        return Observable.create((observer: Observer<boolean>) => {
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
              },
                error => {
                  this.zone.run(() => {
                    observer.error(error);
                  });
                }
              );
            },
            error => {
              this.zone.run(() => {
                observer.error(error);
              });
            }
          );
        });
      })
    );
  }

  public delete(key: string): Observable<boolean> {
    if (String.isNullOrWhiteSpace(key)) {
      return obsOf(false);
    }

    return this.getStorageDirectory().pipe(
      switchMap(storageDirEntry => {
        return Observable.create((observer: Observer<boolean>) => {
          storageDirEntry.getFile(key + '.json', { create: false },
            storageFileEntry => {
              storageFileEntry.remove(() => {
                this.zone.run(() => {
                  observer.next(true);
                  observer.complete();
                });
              },
                error => {
                  observer.error(error);
                }
              );
            },
            error => {
              this.zone.run(() => {
                if (error.code === 1) {
                  observer.next(false);
                  observer.complete();
                } else {
                  observer.error(error);
                }
              });
            }
          );
        });
      })
    );
  }

  private getStorageDirectory(): Observable<DirectoryEntry> {
    return Observable.create((observer: Observer<DirectoryEntry>) => {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
        dataDirEntry => {
          (dataDirEntry as DirectoryEntry).getDirectory('storage', { create: true, exclusive: false },
            storageDirEntry => {
              this.zone.run(() => {
                observer.next(storageDirEntry);
                observer.complete();
              });
            },
            error => {
              this.zone.run(() => {
                observer.error(error);
              });
            }
          );
        },
        error => {
          this.zone.run(() => {
            observer.error(error);
          });
        }
      );
    });
  }
}
