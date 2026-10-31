import { Pipe, PipeTransform } from '@angular/core';
import { FechaUtil } from '../utils/fecha.util';

export type FormatoFecha = 'larga' | 'corta' | 'dia';

/**
 * Convierte fechas 'YYYY-MM-DD' en texto legible en español.
 *  {{ '2026-11-03' | fechaLegible }}           → Mar, 3 nov. 2026
 *  {{ '2026-11-03' | fechaLegible:'larga' }}   → Martes, 3 de noviembre de 2026
 *  {{ '2026-11-03' | fechaLegible:'corta' }}   → 03/11/2026
 */
@Pipe({ name: 'fechaLegible' })
export class FechaLegiblePipe implements PipeTransform {
  private static readonly formatos: Record<FormatoFecha, Intl.DateTimeFormatOptions> = {
    larga: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    corta: { day: '2-digit', month: '2-digit', year: 'numeric' },
    dia: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  };

  transform(valor: string | null | undefined, formato: FormatoFecha = 'dia'): string {
    if (!valor) {
      return '—';
    }

    const fecha = FechaUtil.aDate(valor);

    if (!fecha) {
      return valor;
    }

    const texto = new Intl.DateTimeFormat('es-PE', FechaLegiblePipe.formatos[formato]).format(fecha);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
