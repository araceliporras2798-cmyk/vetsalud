import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TipoAlerta = 'success' | 'danger' | 'warning' | 'info';

/**
 * Alerta reutilizable basada en el componente "alert" de Bootstrap.
 *  <app-alerta tipo="success" [mensaje]="mensaje" (cerrar)="mensaje = ''" />
 */
@Component({
  selector: 'app-alerta',
  template: `
    @if (mensaje) {
      <div class="alert alert-{{ tipo }} alert-dismissible fade show d-flex align-items-center gap-2 my-3"
           [attr.role]="tipo === 'danger' ? 'alert' : 'status'">
        <span class="fs-5" aria-hidden="true">{{ iconos[tipo] }}</span>
        <div>
          @if (titulo) { <strong>{{ titulo }}</strong>&nbsp; }
          {{ mensaje }}
        </div>
        @if (cerrable) {
          <button type="button" class="btn-close" aria-label="Cerrar" (click)="cerrar.emit()"></button>
        }
      </div>
    }
  `
})
export class Alerta {
  @Input() tipo: TipoAlerta = 'info';
  @Input() mensaje = '';
  @Input() titulo = '';
  @Input() cerrable = true;
  @Output() cerrar = new EventEmitter<void>();

  protected readonly iconos: Record<TipoAlerta, string> = {
    success: '✅',
    danger: '⛔',
    warning: '⚠️',
    info: 'ℹ️'
  };
}
