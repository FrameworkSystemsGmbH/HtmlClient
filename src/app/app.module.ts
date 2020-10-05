import { A11yModule } from '@angular/cdk/a11y';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_ROUTING } from '@app/app.routing';
import { ErrorBoxComponent } from '@app/components/errorbox/errorbox.component';
import { MsgBoxComponent } from '@app/components/msgbox/msgbox.component';
import { RetryBoxComponent } from '@app/components/retrybox/retrybox.component';
import { ALL_COMPONENTS } from '@app/components/_all.components';
import { ALL_CONTROLS } from '@app/controls/_all.controls';
import { ALL_DIRECTIVES } from '@app/directives/_all.direcives';
import { ErrorService } from '@app/services/error.service';
import { ALL_SERVICES } from '@app/services/_all.services';
import { appReducer } from '@app/store/app.reducers';
import { environment } from '@env/env.dev';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
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
    FontAwesomeModule,
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
    ALL_SERVICES
  ],
  bootstrap: [AppComponent]
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule { }
