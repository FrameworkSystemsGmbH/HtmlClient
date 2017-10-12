import './prototypes.ts';
import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './env/env.dev';
import { AppModule } from './app/app.module';

const bootstrap: () => void = () => {
  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule);
};

if (!!window.cordova) {
  document.addEventListener('deviceready', () => {
    bootstrap();
  });
} else {
  bootstrap();
}
