import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from 'app/app.module';
import { environment } from 'env/env.dev';

import * as fa from '@fortawesome/fontawesome';

import {
  faAngleLeft,
  faAngleRight,
  faBars,
  faCaretDown,
  faCog,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faPlus,
  faQuestionCircle,
  faSignOutAlt,
  faTrash
} from '@fortawesome/fontawesome-free-solid';

fa.library.add(
  faAngleLeft,
  faAngleRight,
  faBars,
  faCaretDown,
  faCog,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faPlus,
  faQuestionCircle,
  faSignOutAlt,
  faTrash
);

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/debounceTime';

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
