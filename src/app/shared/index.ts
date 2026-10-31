// Punto único de exportación de los elementos compartidos (barrel).
export * from './utils/fecha.util';
export * from './pipes/fecha-legible.pipe';
export * from './pipes/estado-cita.pipe';
export * from './pipes/edad-mascota.pipe';
export * from './pipes/tiempo-restante.pipe';
export * from './directives/resaltar-cita-proxima.directive';
export * from './directives/solo-numeros.directive';
export * from './directives/validacion-visual.directive';
export * from './validators/vetsalud.validators';
export * from './components/alerta/alerta';
export * from './components/error-campo/error-campo';
export * from './components/tarjeta-resumen/tarjeta-resumen';
export * from './components/progreso-formulario/progreso-formulario';

import { ReactiveFormsModule } from '@angular/forms';
import { Alerta } from './components/alerta/alerta';
import { ErrorCampo } from './components/error-campo/error-campo';
import { ProgresoFormulario } from './components/progreso-formulario/progreso-formulario';
import { SoloNumerosDirective } from './directives/solo-numeros.directive';
import { ValidacionVisualDirective } from './directives/validacion-visual.directive';

/** Conjunto de piezas que necesita cualquier formulario reactivo de la aplicación. */
export const FORMULARIO_SHARED = [
  ReactiveFormsModule,
  Alerta,
  ErrorCampo,
  ProgresoFormulario,
  SoloNumerosDirective,
  ValidacionVisualDirective
] as const;

export * from './services/confirmacion.service';
export * from './services/notificacion.service';
export * from './components/dialogo-confirmacion/dialogo-confirmacion';
export * from './components/contenedor-toasts/contenedor-toasts';
