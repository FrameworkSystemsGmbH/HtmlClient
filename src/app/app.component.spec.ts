import { A11yModule } from '@angular/cdk/a11y';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_ROUTING } from '@app/app.routing';
import { ALL_COMPONENTS } from '@app/components/_all.components';
import { ALL_CONTROLS } from '@app/controls/_all.controls';
import { ALL_DIRECTIVES } from '@app/directives/_all.direcives';
import { ErrorService } from '@app/services/error.service';
import { brokerReducer } from '@app/store/broker/broker.reducers';
import { readyReducer } from '@app/store/ready/ready.reducers';
import { runtimeReducer } from '@app/store/runtime/runtime.reducers';
import { StoreModule } from '@ngrx/store';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        StoreModule.forRoot({
          broker: brokerReducer,
          ready: readyReducer,
          runtime: runtimeReducer
        })
      ],
      providers: [
        {
          provide: ErrorHandler,
          useClass: ErrorService
        }
      ]
    }).compileComponents();
  });

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
