import { Component, ElementRef, HostListener, effect, inject, viewChild } from '@angular/core';
import { ConfirmacionService } from '../../services/confirmacion.service';

/**
 * Modal de confirmación construido con las clases de Bootstrap (modal, modal-dialog,
 * modal-content, btn...). Se coloca una sola vez en app.html y lo controla ConfirmacionService.
 */
@Component({
  selector: 'app-dialogo-confirmacion',
  template: `
    @if (servicio.dialogo(); as d) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true"
           aria-labelledby="titulo-dialogo" (click)="clickFondo($event)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header border-0 pb-0">
              <span class="icono me-2 text-{{ d.tipo }}" aria-hidden="true">{{ iconos[d.tipo] }}</span>
              <h5 class="modal-title fw-bold" id="titulo-dialogo">{{ d.titulo }}</h5>
              <button type="button" class="btn-close" aria-label="Cerrar" (click)="servicio.responder(false)"></button>
            </div>
            <div class="modal-body">
              <p class="mb-2">{{ d.mensaje }}</p>
              @if (d.detalle) {
                <div class="alert alert-light border small mb-0">{{ d.detalle }}</div>
              }
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-outline-secondary" (click)="servicio.responder(false)">
                {{ d.textoCancelar }}
              </button>
              <button #confirmar type="button" class="btn btn-{{ d.tipo }}" (click)="servicio.responder(true)">
                {{ d.textoConfirmar }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .icono { font-size: 1.4rem; line-height: 1; }
    .modal-content { border-radius: 16px; }
  `
})
export class DialogoConfirmacion {
  protected readonly servicio = inject(ConfirmacionService);
  private readonly botonConfirmar = viewChild<ElementRef<HTMLButtonElement>>('confirmar');

  protected readonly iconos: Record<string, string> = { danger: '🗑️', warning: '⚠️', primary: 'ℹ️' };

  constructor() {
    // Al abrirse el diálogo, el foco va al botón principal (accesibilidad).
    effect(() => this.botonConfirmar()?.nativeElement.focus());
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.servicio.responder(false);
  }

  clickFondo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) {
      this.servicio.responder(false);
    }
  }
}
