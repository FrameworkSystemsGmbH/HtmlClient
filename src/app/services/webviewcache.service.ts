import { Injectable } from '@angular/core';
import '../types/webview-cache.interface';

@Injectable({ providedIn: 'root' })
export class WebViewCacheService {

  clearCache(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (window.WebViewCache) {
          window.WebViewCache.clearCache();
          resolve();
        } else {
          reject(new Error('WebViewCache interface not available: Native Android bridge is missing or the app is not running in the expected environment.'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
