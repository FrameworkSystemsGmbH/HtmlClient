import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from '@app/app.component';
import { APP_PROVIDERS } from '@app/app.providers';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: APP_PROVIDERS
    }).compileComponents();
  });

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
