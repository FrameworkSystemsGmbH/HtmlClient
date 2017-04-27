import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

export const AppRouting = RouterModule.forRoot(APP_ROUTES);
