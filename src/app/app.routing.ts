import { Routes, RouterModule } from '@angular/router';

import { LoadComponent } from '@app/components/load/load.component';
import { LoginComponent } from '@app/components/login/login.component';
import { ViewerComponent } from '@app/components/viewer/viewer.component';

const APP_ROUTES: Routes = [
  { path: 'viewer', component: ViewerComponent },
  { path: 'load', component: LoadComponent },
  { path: '**', component: LoginComponent }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
