import { inject, Injectable } from '@angular/core';
import { IAppState } from '@app/store/app.state';
import { selectBrokerFilesUrl } from '@app/store/broker/broker.selectors';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ImageService {

  private _filesUrl: string | null = null;

  public constructor() {

    inject(Store<IAppState>).select(selectBrokerFilesUrl).subscribe({
      next: filesUrl => {
        this._filesUrl = filesUrl;
      }
    });
  }

  public getFilesUrl(): string | null {
    return this._filesUrl;
  }

  public getImageUrl(image: string): string | null {
    if (image.trim().length === 0) {
      return null;
    }

    const imgLower: string = image.toLowerCase();

    if (imgLower.startsWith('http://') || imgLower.startsWith('https://')) {
      return image;
    }

    if (this._filesUrl != null && !image.startsWith('/')) {
      return `${this._filesUrl}/${image}`;
    }

    return null;
  }
}
