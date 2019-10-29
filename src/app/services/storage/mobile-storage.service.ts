/// <reference types="cordova-plugin-file" />

import { Injectable, NgZone } from '@angular/core';
import { Observable, EMPTY as obsEmpty, of as obsOf } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { StorageService } from 'app/services/storage/storage.service';

@Injectable()
export class MobileStorageService extends StorageService {

  constructor(private zone: NgZone) {
    super();
  }

  public loadData(key: string): Observable<string> {
    if (String.isNullOrWhiteSpace(key)) {
      return obsEmpty;
    }

    return this.getStorageDirectory().pipe(
      flatMap(storageDirEntry => {
        return new Observable<string>(subscriber => {
          storageDirEntry.getFile(key + '.json', { create: false },
            storageFileEntry => {
              storageFileEntry.file(storageFile => {
                const reader: FileReader = new FileReader();
                reader.onloadend = e => {
                  this.zone.run(() => {
                    const result: string | ArrayBuffer = reader.result;
                    if (typeof result === 'string') {
                      subscriber.next(result);
                    }
                    subscriber.complete();
                  });
                };
                reader.onerror = e => {
                  this.zone.run(() => {
                    subscriber.error(e);
                  });
                };
                reader.readAsText(storageFile);
              },
                error => {
                  this.zone.run(() => {
                    subscriber.error(error);
                  });
                }
              );
            },
            error => {
              this.zone.run(() => {
                if (error.code === 1) {
                  subscriber.next(null);
                  subscriber.complete();
                } else {
                  subscriber.error(error);
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
      flatMap(storageDirEntry => {
        return new Observable<boolean>(subscriber => {
          storageDirEntry.getFile(key + '.json', { create: true, exclusive: false },
            storageFileEntry => {
              storageFileEntry.createWriter(writer => {
                writer.onwriteend = e => {
                  this.zone.run(() => {
                    subscriber.next(true);
                    subscriber.complete();
                  });
                };
                writer.onerror = e => {
                  this.zone.run(() => {
                    subscriber.error(e);
                  });
                };
                const data: Blob = new Blob([value], { type: 'text/plain' });
                writer.write(data);
              },
                error => {
                  this.zone.run(() => {
                    subscriber.error(error);
                  });
                }
              );
            },
            error => {
              this.zone.run(() => {
                subscriber.error(error);
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
      flatMap(storageDirEntry => {
        return new Observable<boolean>(subscriber => {
          storageDirEntry.getFile(key + '.json', { create: false },
            storageFileEntry => {
              storageFileEntry.remove(() => {
                this.zone.run(() => {
                  subscriber.next(true);
                  subscriber.complete();
                });
              },
                error => {
                  subscriber.error(error);
                }
              );
            },
            error => {
              this.zone.run(() => {
                if (error.code === 1) {
                  subscriber.next(false);
                  subscriber.complete();
                } else {
                  subscriber.error(error);
                }
              });
            }
          );
        });
      })
    );
  }

  private getStorageDirectory(): Observable<DirectoryEntry> {
    return new Observable<DirectoryEntry>(subscriber => {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
        dataDirEntry => {
          (dataDirEntry as DirectoryEntry).getDirectory('storage', { create: true, exclusive: false },
            storageDirEntry => {
              this.zone.run(() => {
                subscriber.next(storageDirEntry);
                subscriber.complete();
              });
            },
            error => {
              this.zone.run(() => {
                subscriber.error(error);
              });
            }
          );
        },
        error => {
          this.zone.run(() => {
            subscriber.error(error);
          });
        }
      );
    });
  }
}
