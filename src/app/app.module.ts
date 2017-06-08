import { NgModule, forwardRef } from '@angular/core';
import { HttpModule } from '@angular/http';
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
import { ButtonComponent, FormComponent, LabelComponent, TextBoxComponent, WrapPanelComponent } from './controls';
import { MediaQueryDirective, MouseWheelDirective } from './directives';
import { ResponseFormDto } from './communication/response';
import { FormWrapper } from './wrappers';
import { StorageService } from './services/storage.service';
import { LocalStorageService } from './services/local-storage.service';
import { ActionsService } from './services/actions.service';
import { BrokerService } from './services/broker.service';
import { ControlStyleService } from './services/control-style.service';
import { ControlsService } from './services/controls.service';
import { ErrorService } from './services/error.service';
import { EventsService } from './services/events.service';
import { FontService } from './services/font.service';
import { FormsService } from './services/forms.service';
import { HttpService } from './services/http.service';
import { LogService } from './services/log.service';
import { LoginService } from './services/login.service';
import { TitleService } from './services/title.service';
import { WindowRefService } from './services/windowref.service';

@NgModule({
  entryComponents: [
    FormComponent
  ],
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
    HttpModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: StorageService, useClass: LocalStorageService },
    ActionsService,
    BrokerService,
    ControlStyleService,
    ControlsService,
    ErrorService,
    EventsService,
    FontService,
    FormsService,
    HttpService,
    LoginService,
    LogService,
    TitleService,
    WindowRefService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
