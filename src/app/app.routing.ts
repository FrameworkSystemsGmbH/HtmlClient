import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from 'app/components/login/login.component';
import { ViewerComponent } from 'app/components/viewer/viewer.component';

const APP_ROUTES: Routes = [
  { path: 'viewer', component: ViewerComponent },
  { path: '**', component: LoginComponent }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
