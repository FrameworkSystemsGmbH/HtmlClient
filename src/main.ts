import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from 'app/app.module';
import { environment } from 'env/env.dev';

const bootstrap: () => void = () => {
  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.log(error));
};

if (!!window.cordova) {
  document.addEventListener('deviceready', () => {
    bootstrap();
  });
} else {
  bootstrap();
}
