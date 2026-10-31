import { Pipe, PipeTransform } from '@angular/core';
import { FechaUtil } from '../utils/fecha.util';

/**
 * Indica cuánto falta para una cita: "en 45 min", "en 3 h", "mañana", "en 5 días" o "vencida".
 *  {{ cita.fecha | tiempoRestante:cita.hora }}
 */
@Pipe({ name: 'tiempoRestante' })
export class TiempoRestantePipe implements PipeTransform {
  transform(fecha: string, hora = '00:00', ahora: Date = new Date()): string {
    const horas = FechaUtil.horasHasta(fecha, hora, ahora);

    if (horas === null) return '';
    if (horas < 0) return 'Hora vencida';
    if (horas < 1) return `En ${Math.max(1, Math.round(horas * 60))} min`;
    if (fecha === FechaUtil.hoyISO(ahora)) return `Hoy, en ${Math.round(horas)} h`;

    const manana = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    if (fecha === FechaUtil.hoyISO(manana)) return 'Mañana';

    return `En ${Math.ceil(horas / 24)} días`;
  }
}
