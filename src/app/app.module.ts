import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';
import { MsgBoxComponent } from 'app/components/msgbox/msgbox.component';

import { ErrorService } from './services/error.service';

import { APP_ROUTING } from './app.routing';
import { APP_REDUCERS } from './app.reducers';

import { ALL_COMPONENTS } from './components/_all.components';
import { ALL_CONTROLS } from './controls/_all.controls';
import { ALL_DIRECTIVES } from './directives/_all.direcives';
import { ALL_SERVICES } from './services/_all.services';
import { ALL_FORMATTERS } from './services/formatter/_all.formatters';

@NgModule({
  entryComponents: [
    ErrorBoxComponent,
    MsgBoxComponent,
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
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatExpansionModule,
    RouterModule,
    ReactiveFormsModule,
    OverlayModule,
    StoreModule.forRoot(APP_REDUCERS)
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorService },
    ALL_SERVICES,
    ALL_FORMATTERS
  ],
  bootstrap: [AppComponent]
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule { }
