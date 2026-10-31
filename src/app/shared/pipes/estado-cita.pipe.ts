import { Pipe, PipeTransform } from '@angular/core';
import { Cita } from '../../models/cita';

type EstadoCita = Cita['estado'];
export type SalidaEstado = 'texto' | 'clase' | 'icono';

interface PresentacionEstado {
  icono: string;
  texto: string;
  clase: string; // clase de badge de Bootstrap
}

/**
 * Traduce el estado de una cita a su presentación visual.
 *  {{ cita.estado | estadoCita }}           → "⏳ Pendiente de confirmar"
 *  [class]="cita.estado | estadoCita:'clase'" → "badge text-bg-warning"
 */
@Pipe({ name: 'estadoCita' })
export class EstadoCitaPipe implements PipeTransform {
  private static readonly mapa: Record<EstadoCita, PresentacionEstado> = {
    Pendiente: { icono: '⏳', texto: 'Pendiente de confirmar', clase: 'text-bg-warning' },
    Confirmada: { icono: '✔', texto: 'Confirmada', clase: 'text-bg-primary' },
    Atendida: { icono: '✚', texto: 'Atendida', clase: 'text-bg-success' },
    Cancelada: { icono: '✖', texto: 'Cancelada', clase: 'text-bg-secondary' }
  };

  transform(estado: EstadoCita | null | undefined, salida: SalidaEstado = 'texto'): string {
    const datos = estado ? EstadoCitaPipe.mapa[estado] : undefined;

    if (!datos) {
      return salida === 'clase' ? 'badge text-bg-light' : 'Sin estado';
    }

    switch (salida) {
      case 'clase':
        return `badge rounded-pill ${datos.clase}`;
      case 'icono':
        return datos.icono;
      default:
        return `${datos.icono} ${datos.texto}`;
    }
  }
}
