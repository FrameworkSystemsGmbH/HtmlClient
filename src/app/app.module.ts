import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, } from '@angular/router';

import { jqxTooltipComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtooltip';

import { BrokerService } from './broker/broker.service';
import { StorageService } from './services/storage.service';
import { WindowRefService } from './services/windowref.service';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { NavbarComponent } from './navbar/navbar.component';
import { BrokerComponent } from './broker/broker.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BrokerComponent,
    jqxTooltipComponent
  ],
  imports: [
    AppRouting,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BrokerService,
    StorageService,
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
