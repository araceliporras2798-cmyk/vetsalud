import { Component, inject } from '@angular/core';
import { NotificacionService, TipoNotificacion } from '../../services/notificacion.service';

/** Contenedor de toasts de Bootstrap (esquina inferior derecha). */
@Component({
  selector: 'app-contenedor-toasts',
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite" aria-atomic="true">
      @for (n of servicio.notificaciones(); track n.id) {
        <div class="toast show border-0 shadow" role="status">
          <div class="toast-header text-white bg-{{ n.tipo }}">
            <span class="me-2" aria-hidden="true">{{ iconos[n.tipo] }}</span>
            <strong class="me-auto">{{ n.titulo }}</strong>
            <small class="opacity-75">ahora</small>
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Cerrar"
                    (click)="servicio.cerrar(n.id)"></button>
          </div>
          <div class="toast-body">{{ n.mensaje }}</div>
        </div>
      }
    </div>
  `,
  styles: `
    .toast { animation: entrar .25s ease-out; }
    @keyframes entrar { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  `
})
export class ContenedorToasts {
  protected readonly servicio = inject(NotificacionService);
  protected readonly iconos: Record<TipoNotificacion, string> = {
    success: '✔', danger: '⛔', warning: '⚠', info: 'ℹ'
  };
}
