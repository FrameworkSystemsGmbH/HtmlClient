import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { AppModule } from 'app/app.module';
import { environment } from 'env/env.dev';

const bootstrap: () => void = () => {
  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.log(error));

  defineCustomElements(window);
};

if (!!(window as any).cordova) {
  document.addEventListener('deviceready', () => { bootstrap(); }, false);
} else {
  bootstrap();
}
