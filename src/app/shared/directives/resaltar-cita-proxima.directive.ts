import { Directive, HostBinding, Input } from '@angular/core';
import { Cita } from '../../models/cita';
import { ClasificacionCita, FechaUtil } from '../utils/fecha.util';

/**
 * Resalta visualmente una cita según su cercanía:
 *  - hoy      → fondo ámbar y borde lateral
 *  - próxima  → borde lateral azul (dentro de las próximas `horasAviso` horas)
 *  - vencida  → texto atenuado y borde rojo (pasó la hora y sigue Pendiente/Confirmada)
 *
 * Uso: <tr [appResaltarCitaProxima]="cita" [horasAviso]="48">
 */
@Directive({ selector: '[appResaltarCitaProxima]' })
export class ResaltarCitaProximaDirective {
  @Input({ alias: 'appResaltarCitaProxima', required: true })
  cita!: Pick<Cita, 'fecha' | 'hora' | 'estado'>;

  /** Ventana (en horas) para considerar una cita como "próxima". */
  @Input() horasAviso = 48;

  private get clasificacion(): ClasificacionCita {
    return FechaUtil.clasificarCita(
      this.cita.fecha,
      this.cita.hora,
      this.cita.estado,
      this.horasAviso
    );
  }

  @HostBinding('class.cita-hoy')
  get esHoy(): boolean {
    return this.clasificacion === 'hoy';
  }

  @HostBinding('class.cita-proxima')
  get esProxima(): boolean {
    return this.clasificacion === 'proxima';
  }

  @HostBinding('class.cita-vencida')
  get estaVencida(): boolean {
    return this.clasificacion === 'vencida';
  }

  @HostBinding('attr.title')
  get descripcion(): string | null {
    const textos: Partial<Record<ClasificacionCita, string>> = {
      hoy: 'Cita programada para hoy',
      proxima: `Cita dentro de las próximas ${this.horasAviso} horas`,
      vencida: 'La hora de la cita ya pasó y no fue atendida'
    };
    return textos[this.clasificacion] ?? null;
  }
}
