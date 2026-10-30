
import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Mascotas } from './pages/mascotas/mascotas';
import { Citas } from './pages/citas/citas';
import { Historial } from './pages/historial/historial';
import { Duenos } from './pages/duenos/duenos';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'mascotas', component: Mascotas },
  { path: 'duenos', component: Duenos },
  { path: 'citas', component: Citas },
  { path: 'historial', component: Historial },
  { path: '**', redirectTo: '' }
];
