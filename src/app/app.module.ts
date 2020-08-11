import { NgModule, ErrorHandler, COMPILER_OPTIONS, CompilerFactory, Compiler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from 'env/env.dev';

import { AppComponent } from 'app/app.component';

import { ErrorService } from 'app/services/error.service';

import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';
import { MsgBoxComponent } from 'app/components/msgbox/msgbox.component';
import { RetryBoxComponent } from 'app/components/retrybox/retrybox.component';

import { APP_ROUTING } from 'app/app.routing';
import { appReducer } from 'app/store/app.reducers';

import { ALL_COMPONENTS } from 'app/components/_all.components';
import { ALL_CONTROLS } from 'app/controls/_all.controls';
import { ALL_DIRECTIVES } from 'app/directives/_all.direcives';
import { ALL_SERVICES } from 'app/services/_all.services';

import { A11yModule } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { HammerConfig } from 'app/common/hammer/hammer-config';

import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  entryComponents: [
    ErrorBoxComponent,
    MsgBoxComponent,
    RetryBoxComponent,
    ALL_CONTROLS
  ],
  declarations: [
    AppComponent,
    ALL_COMPONENTS,
    ALL_CONTROLS,
    ALL_DIRECTIVES
  ],
  imports: [
    APP_ROUTING,
    A11yModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    OverlayscrollbarsModule,
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
      logOnly: environment.production
    })
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorService
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    {
      provide: COMPILER_OPTIONS,
      useValue: {},
      multi: true
    },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    {
      provide: Compiler,
      useFactory: (factory: CompilerFactory) => factory.createCompiler(),
      deps: [CompilerFactory]
    },
    ALL_SERVICES
  ],
  bootstrap: [AppComponent]
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule { }
