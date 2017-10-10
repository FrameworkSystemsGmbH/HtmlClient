import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../app.reducers';

@Injectable()
export class ImageService {

  private filesUrl: string;

  constructor(private store: Store<fromApp.State>) {
    this.store.select(state => state.broker).subscribe(broker => {
      this.filesUrl = broker.activeBrokerFilesUrl;
    });
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
