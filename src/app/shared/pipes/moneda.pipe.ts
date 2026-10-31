import { Pipe, PipeTransform } from '@angular/core';

/**
 * Muestra un monto en soles peruanos.
 *  {{ 50 | moneda }}      → S/ 50.00
 *  {{ 1250.5 | moneda }}  → S/ 1,250.50
 */
@Pipe({ name: 'moneda' })
export class MonedaPipe implements PipeTransform {
  private static readonly formato = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  transform(valor: number | null | undefined, simbolo = 'S/'): string {
    if (valor === null || valor === undefined || Number.isNaN(Number(valor))) {
      return '—';
    }
    return `${simbolo} ${MonedaPipe.formato.format(Number(valor))}`;
  }
}
