import { Routes } from '@angular/router';
import { BarcodeComponent } from '@app/components/barcode/barcode.component';
import { LoadComponent } from '@app/components/load/load.component';
import { LoginComponent } from '@app/components/login/login.component';
import { ViewerComponent } from '@app/components/viewer/viewer.component';

export const APP_ROUTES: Routes = [
  {
    path: 'barcode',
    component: BarcodeComponent
  },
  {
    path: 'viewer',
    component: ViewerComponent
  },
  {
    path: 'load',
    component: LoadComponent
  },
  {
    path: '**',
    component: LoginComponent
  }
];
