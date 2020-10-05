import { ErrorHandler } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from 'app/app.component';

import { ErrorService } from 'app/services/error.service';

import { APP_ROUTING } from 'app/app.routing';
import { appReducer } from 'app/store/app.reducers';

import { ALL_COMPONENTS } from 'app/components/_all.components';
import { ALL_CONTROLS } from 'app/controls/_all.controls';
import { ALL_DIRECTIVES } from 'app/directives/_all.direcives';
import { ALL_SERVICES } from 'app/services/_all.services';

import { A11yModule } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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
        NoopAnimationsModule,
        OverlayscrollbarsModule,
        StoreModule.forRoot(appReducer)
      ],
      providers: [
        {
          provide: ErrorHandler,
          useClass: ErrorService
        },
        ALL_SERVICES
      ]
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
