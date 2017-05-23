import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { RouterModule, } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import {
  ButtonComponent,
  FormComponent,
  LabelComponent,
  TextBoxComponent,
  WrapPanelComponent
} from './controls';

import { MediaQueryDirective, MouseWheelDirective } from './directives';
import { StorageService, LocalStorageService, WindowRefService } from './services';
import { LoginService } from './components/login/login.service';

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
    WrapPanelComponent,
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
    { provide: StorageService, useClass: LocalStorageService },
    LoginService,
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
