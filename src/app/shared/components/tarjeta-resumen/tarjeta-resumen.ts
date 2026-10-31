import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ColorTarjeta = 'azul' | 'turquesa' | 'ambar' | 'verde';

/**
 * Tarjeta de indicador reutilizable (dashboard, citas, historial).
 *  <app-tarjeta-resumen titulo="Citas de hoy" [valor]="3" icono="▦" color="ambar"
 *                       accion="Ver agenda" (seleccionar)="irACitas()" />
 */
@Component({
  selector: 'app-tarjeta-resumen',
  template: `
    <article class="tarjeta-resumen" [class]="'color-' + color">
      <span class="icono" aria-hidden="true">{{ icono }}</span>
      <div class="cuerpo">
        <p>{{ titulo }}</p>
        <strong>{{ valor }}</strong>
        @if (detalle) { <small>{{ detalle }}</small> }
      </div>
      @if (accion) {
        <button type="button" class="btn btn-sm btn-outline-secondary" (click)="seleccionar.emit()">
          {{ accion }}
        </button>
      }
    </article>
  `,
  styles: `
    :host { display: block; }
    .tarjeta-resumen {
      display: flex; align-items: center; gap: 16px; height: 100%;
      padding: 18px 20px; border: 1px solid #e0eaf2; border-radius: 16px;
      background: #fff; box-shadow: 0 6px 18px rgb(23 74 126 / 5%);
    }
    .icono {
      display: grid; place-items: center; flex-shrink: 0;
      width: 52px; height: 52px; border-radius: 14px; font-size: 24px;
    }
    .cuerpo { flex: 1; min-width: 0; }
    .cuerpo p { margin: 0; color: #647b8d; font-size: 13px; font-weight: 600; }
    .cuerpo strong { display: block; color: #174a7e; font-size: 28px; line-height: 1.2; }
    .cuerpo small { color: #8197a8; font-size: 12px; }
    .color-azul .icono { background: #e7f0fb; color: #174a7e; }
    .color-turquesa .icono { background: #e1f5f3; color: #0f8b80; }
    .color-ambar .icono { background: #fff4dc; color: #b7791f; }
    .color-verde .icono { background: #e6f6ec; color: #23824b; }
  `
})
export class TarjetaResumen {
  @Input({ required: true }) titulo = '';
  @Input() valor: number | string = 0;
  @Input() icono = '•';
  @Input() detalle = '';
  @Input() color: ColorTarjeta = 'azul';
  @Input() accion = '';
  @Output() seleccionar = new EventEmitter<void>();
}
