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
import { FrameComponent } from './components/frame/frame.component';
import {
  ButtonComponent,
  FormComponent,
  LabelComponent,
  TextBoxComponent,
  WrapPanelComponent
} from './controls';

import { MediaQueryDirective, MouseWheelDirective } from './directives';
import { FontService, StorageService, LocalStorageService, WindowRefService } from './services';
import { LoginService } from './components/login/login.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ViewerComponent,
    FrameComponent,
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
    FontService,
    LoginService,
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
