import { Injectable } from '@angular/core';
import { selectBrokerFilesUrl } from '@app/store/broker/broker.selectors';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ImageService {

  private _filesUrl: string;

  public constructor(private readonly store: Store) {
    this.store.select(selectBrokerFilesUrl).subscribe(filesUrl => {
      this._filesUrl = filesUrl;
    });
  }

  public getFilesUrl(): string {
    return this._filesUrl;
  }

  public getImageUrl(image: string): string {
    if (String.isNullOrWhiteSpace(image)) {
      return null;
    }

    const imgLower: string = image.toLowerCase();

    if (imgLower.startsWith('http://') || imgLower.startsWith('https://')) {
      return image;
    }

    if (!image.startsWith('/')) {
      return `${this._filesUrl}/${image}`;
    }

    return null;
  }
}
