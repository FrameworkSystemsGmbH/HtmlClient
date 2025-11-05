import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, ErrorHandler, Provider, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { APP_ROUTES } from '@app/app.routes';
import { HammerConfig } from '@app/common/hammer/hammer-config';
import { ErrorService } from '@app/services/error.service';
import { brokerReducer } from '@app/store/broker/broker.reducers';
import { readyReducer } from '@app/store/ready/ready.reducers';
import { runtimeReducer } from '@app/store/runtime/runtime.reducers';
import { environment } from '@env/env.prod';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

const errorProvider: Provider = {
  provide: ErrorHandler,
  useClass: ErrorService
};

export const APP_PROVIDERS: Array<EnvironmentProviders | Provider> = [
  errorProvider,
  provideHttpClient(),
  provideRouter(APP_ROUTES, withHashLocation()),
  provideStore({
    broker: brokerReducer,
    ready: readyReducer,
    runtime: runtimeReducer
  }),
  provideStoreDevtools({
    maxAge: 10,
    logOnly: environment.production
  }),
  importProvidersFrom(
    BrowserAnimationsModule,
    HammerModule,
    MatDialogModule
  ),
  {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }
];
