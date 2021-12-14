import { A11yModule } from '@angular/cdk/a11y';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_ROUTING } from '@app/app.routing';
import { HammerConfig } from '@app/common/hammer/hammer-config';
import { ALL_COMPONENTS } from '@app/components/_all.components';
import { ALL_CONTROLS } from '@app/controls/_all.controls';
import { ALL_DIRECTIVES } from '@app/directives/_all.direcives';
import { ErrorService } from '@app/services/error.service';
import { brokerReducer } from '@app/store/broker/broker.reducers';
import { readyReducer } from '@app/store/ready/ready.reducers';
import { runtimeReducer } from '@app/store/runtime/runtime.reducers';
import { environment } from '@env/env.dev';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    ALL_COMPONENTS,
    ALL_CONTROLS,
    ALL_DIRECTIVES,
    AppComponent
  ],
  imports: [
    A11yModule,
    APP_ROUTING,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HammerModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    OverlayscrollbarsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forRoot({
      broker: brokerReducer,
      ready: readyReducer,
      runtime: runtimeReducer
    }),
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
    }
  ],
  bootstrap: [AppComponent]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule { }
