import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAppReducers from '../app.reducers';

@Injectable()
export class ImageService {

  private filesUrl: string;

  constructor(private store: Store<fromAppReducers.AppState>) {
    this.store.select(appState => appState.broker.activeBrokerFilesUrl).subscribe(imageUrl => {
      this.filesUrl = imageUrl;
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
