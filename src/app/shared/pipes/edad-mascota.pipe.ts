import { Pipe, PipeTransform } from '@angular/core';
import { FechaUtil } from '../utils/fecha.util';

/**
 * Calcula la edad de una mascota a partir de su fecha de nacimiento.
 *  {{ '2023-05-10' | edadMascota }} → "3 años y 5 meses"
 *  {{ '2026-09-01' | edadMascota }} → "1 mes"
 */
@Pipe({ name: 'edadMascota' })
export class EdadMascotaPipe implements PipeTransform {
  transform(fechaNacimiento: string | null | undefined, hoy: Date = new Date()): string {
    const nacimiento = fechaNacimiento ? FechaUtil.aDate(fechaNacimiento) : null;

    if (!nacimiento || nacimiento > hoy) {
      return 'Sin dato';
    }

    let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12
      + (hoy.getMonth() - nacimiento.getMonth());

    if (hoy.getDate() < nacimiento.getDate()) {
      meses--;
    }

    if (meses < 1) {
      return 'Menos de 1 mes';
    }

    const anios = Math.floor(meses / 12);
    const resto = meses % 12;
    const textoAnios = anios ? `${anios} ${anios === 1 ? 'año' : 'años'}` : '';
    const textoMeses = resto ? `${resto} ${resto === 1 ? 'mes' : 'meses'}` : '';

    return [textoAnios, textoMeses].filter(Boolean).join(' y ');
  }
}
