import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectBrokerFilesUrl } from 'app/store/broker/broker.selectors';

@Injectable()
export class ImageService {

  private filesUrl: string;

  constructor(private store: Store) {
    this.store.select(selectBrokerFilesUrl).subscribe(filesUrl => this.filesUrl = filesUrl);
  }

  public getFilesUrl(): string {
    return this.filesUrl;
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
      return this.filesUrl + '/' + image;
    }

    return null;
  }
}
