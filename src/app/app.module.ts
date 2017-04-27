import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, } from '@angular/router';

import { LoginService } from './components/login/login.service';
import { StorageService, LocalStorageService, WindowRefService } from './services';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import {
  ButtonComponent,
  FormComponent,
  LabelComponent,
  TextBoxComponent
} from './controls';

import { MediaQueryDirective, MouseWheelDirective } from './directives';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ViewerComponent,
    LoginComponent,
    ButtonComponent,
    FormComponent,
    LabelComponent,
    TextBoxComponent,
    MediaQueryDirective,
    MouseWheelDirective
  ],
  imports: [
    AppRouting,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: StorageService, useClass: LocalStorageService },
    LoginService,
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
