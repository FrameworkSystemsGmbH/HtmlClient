import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, } from '@angular/router';

import { jqxTooltipComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtooltip';

import { BrokerService } from './components/broker/broker.service';
import { StorageService, WindowRefService } from './services';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrokerComponent } from './components/broker/broker.component';

import { MediaQueryDirective, MouseWheelDirective } from './directives';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BrokerComponent,
    jqxTooltipComponent,
    MediaQueryDirective,
    MouseWheelDirective
  ],
  imports: [
    AppRouting,
    BrowserAnimationsModule,
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
