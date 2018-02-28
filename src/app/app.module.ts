import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from 'app/app.component';
import { ErrorBoxComponent } from 'app/components/errorbox/errorbox.component';
import { MsgBoxComponent } from 'app/components/msgbox/msgbox.component';

import { ErrorService } from 'app/services/error.service';

import { APP_ROUTING } from 'app/app.routing';
import { APP_REDUCERS } from 'app/app.reducers';

import { ALL_COMPONENTS } from 'app/components/_all.components';
import { ALL_CONTROLS } from 'app/controls/_all.controls';
import { ALL_DIRECTIVES } from 'app/directives/_all.direcives';
import { ALL_SERVICES } from 'app/services/_all.services';
import { ALL_FORMATTERS } from 'app/services/formatter/_all.formatters';

import { A11yModule } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';

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
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
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
