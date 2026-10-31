import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DatosDemoService } from './shared/services/datos-demo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // La primera vez que se abre la app se cargan datos de ejemplo automáticamente.
    provideAppInitializer(() => inject(DatosDemoService).inicializar())
  ]
};
