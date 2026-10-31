import { Pipe, PipeTransform } from '@angular/core';

/** Prefijo y longitud del código visible de una mascota. */
export const PREFIJO_CODIGO = 'MAS-';

export function codigoMascota(id: number): string {
  return `${PREFIJO_CODIGO}${String(id).padStart(4, '0')}`;
}

/**
 * Convierte el id de una mascota en su código de paciente.
 *  {{ 3 | codigoMascota }} → MAS-0003
 */
@Pipe({ name: 'codigoMascota' })
export class CodigoMascotaPipe implements PipeTransform {
  transform(id: number | null | undefined): string {
    return id ? codigoMascota(id) : '—';
  }
}
