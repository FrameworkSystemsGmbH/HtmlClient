import { Routes, RouterModule } from '@angular/router';

import { BrokerComponent } from './components/broker/broker.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: BrokerComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

export const AppRouting = RouterModule.forRoot(APP_ROUTES);
