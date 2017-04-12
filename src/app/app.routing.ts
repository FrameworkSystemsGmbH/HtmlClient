import { Routes, RouterModule } from '@angular/router';

import { BrokerComponent } from './broker/broker.component';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: BrokerComponent },
  { path: '**', redirectTo: '/'}
];

export const AppRouting = RouterModule.forRoot(APP_ROUTES);
