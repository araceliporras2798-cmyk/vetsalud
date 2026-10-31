import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FechaUtil } from '../utils/fecha.util';

/**
 * Validadores personalizados para los formularios reactivos de VetSalud.
 * Cada validador devuelve `null` cuando el valor es válido o un objeto con la clave del error.
 */
export class VetValidators {
  /** Rechaza valores formados sólo por espacios. */
  static noSoloEspacios(control: AbstractControl<string | null>): ValidationErrors | null {
    const valor = control.value ?? '';
    return valor.length > 0 && valor.trim().length === 0 ? { soloEspacios: true } : null;
  }

  /** Sólo letras (incluye tildes y ñ), espacios, apóstrofes y guiones. */
  static soloLetras(control: AbstractControl<string | null>): ValidationErrors | null {
    const valor = (control.value ?? '').trim();
    return valor && !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(valor) ? { soloLetras: true } : null;
  }

  /** DNI peruano: exactamente 8 dígitos. */
  static dni(control: AbstractControl<string | null>): ValidationErrors | null {
    const valor = control.value ?? '';
    return valor && !/^\d{8}$/.test(valor) ? { dni: true } : null;
  }

  /** Celular peruano: 9 dígitos y empieza con 9. */
  static celularPeru(control: AbstractControl<string | null>): ValidationErrors | null {
    const valor = control.value ?? '';
    return valor && !/^9\d{8}$/.test(valor) ? { celular: true } : null;
  }

  /** La fecha no puede ser anterior a hoy (citas). */
  static fechaNoPasada(control: AbstractControl<string | null>): ValidationErrors | null {
    const valor = control.value;
    return valor && valor < FechaUtil.hoyISO() ? { fechaPasada: true } : null;
  }

  /** La fecha no puede ser posterior a hoy (nacimientos, consultas ya realizadas). */
  static fechaNoFutura(control: AbstractControl<string | null>): ValidationErrors | null {
    const valor = control.value;
    return valor && valor > FechaUtil.hoyISO() ? { fechaFutura: true } : null;
  }

  /** La hora debe estar dentro del horario de atención de la clínica. */
  static horarioAtencion(apertura: string, cierre: string): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;
      return valor < apertura || valor > cierre
        ? { fueraDeHorario: { apertura, cierre } }
        : null;
    };
  }

  /** Evita registrar un valor que ya existe (por ejemplo, un DNI repetido). */
  static valorUnico(obtenerExistentes: () => string[], clave = 'duplicado'): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const valor = (control.value ?? '').trim().toLowerCase();
      if (!valor) return null;
      const existe = obtenerExistentes().some(item => item.trim().toLowerCase() === valor);
      return existe ? { [clave]: true } : null;
    };
  }

  /**
   * Validador de grupo: la combinación fecha + hora debe estar libre y no puede haber pasado.
   * Recibe una función para consultar la disponibilidad (desacoplado del servicio).
   */
  static horarioDisponible(
    estaDisponible: (fecha: string, hora: string) => boolean
  ): ValidatorFn {
    return (grupo: AbstractControl): ValidationErrors | null => {
      const fecha: string = grupo.get('fecha')?.value ?? '';
      const hora: string = grupo.get('hora')?.value ?? '';

      if (!fecha || !hora) return null;

      const horas = FechaUtil.horasHasta(fecha, hora);
      if (horas !== null && horas < 0) {
        return { horaPasada: true };
      }

      return estaDisponible(fecha, hora) ? null : { horarioOcupado: { fecha, hora } };
    };
  }
}
