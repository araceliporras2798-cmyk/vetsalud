import { Pipe, PipeTransform } from '@angular/core';
import { DURACION_BLOQUE_MIN } from '../../models/servicio';

/**
 * Convierte la hora de inicio en el bloque de horario completo.
 *  {{ '09:00' | rangoHorario }}     → 09:00 – 09:30
 *  {{ '09:00' | rangoHorario:60 }}  → 09:00 – 10:00
 */
@Pipe({ name: 'rangoHorario' })
export class RangoHorarioPipe implements PipeTransform {
  transform(inicio: string | null | undefined, duracionMin = DURACION_BLOQUE_MIN): string {
    const partes = /^(\d{2}):(\d{2})/.exec(inicio ?? '');
    if (!partes) return inicio ?? '—';

    const total = Number(partes[1]) * 60 + Number(partes[2]) + duracionMin;
    const fin = `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    return `${partes[1]}:${partes[2]} – ${fin}`;
  }
}
