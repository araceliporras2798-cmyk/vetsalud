import { Routes } from '@angular/router';

/**
 * Rutas con carga diferida (lazy loading): cada módulo funcional se descarga
 * solo cuando el usuario entra a él, lo que reduce el tamaño inicial de la app.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Inicio · VetSalud',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'duenos',
    title: 'Dueños · VetSalud',
    loadComponent: () => import('./pages/duenos/duenos').then(m => m.Duenos)
  },
  {
    path: 'mascotas',
    title: 'Mascotas · VetSalud',
    loadComponent: () => import('./pages/mascotas/mascotas').then(m => m.Mascotas)
  },
  {
    path: 'citas',
    title: 'Citas · VetSalud',
    loadComponent: () => import('./pages/citas/citas').then(m => m.Citas)
  },
  {
    path: 'historial',
    title: 'Historial clínico · VetSalud',
    loadComponent: () => import('./pages/historial/historial').then(m => m.Historial)
  },
  { path: '**', redirectTo: '' }
];
