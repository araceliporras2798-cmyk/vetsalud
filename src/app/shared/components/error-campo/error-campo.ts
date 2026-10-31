import { ChangeDetectorRef, Component, DestroyRef, Input, inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Muestra el primer mensaje de error de un control de ReactiveForms
 * cuando el usuario ya interactuó con el campo.
 *  <app-error-campo [control]="form.controls.dni" etiqueta="El DNI" />
 */
@Component({
  selector: 'app-error-campo',
  template: `
    @if (mensaje) {
      <div class="invalid-feedback d-block" role="alert">{{ mensaje }}</div>
    }
  `
})
export class ErrorCampo {
  private readonly cdr = inject(ChangeDetectorRef);
  private suscripcion?: Subscription;
  private _control: AbstractControl | null = null;

  /**
   * Los componentes son OnPush por defecto en Angular 22: se escuchan los eventos
   * del control (valor, estado, touched) para volver a pintar el mensaje.
   */
  @Input({ required: true })
  set control(control: AbstractControl | null) {
    this._control = control;
    this.suscripcion?.unsubscribe();
    this.suscripcion = control?.events.subscribe(() => this.cdr.markForCheck());
  }
  get control(): AbstractControl | null {
    return this._control;
  }

  @Input() etiqueta = 'Este campo';

  constructor() {
    inject(DestroyRef).onDestroy(() => this.suscripcion?.unsubscribe());
  }

  get mensaje(): string | null {
    const control = this.control;

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    return this.traducir(control.errors);
  }

  /** Concordancia de género y número: "El DNI es obligatorio", "La fecha es obligatoria". */
  private obligatorio(etiqueta: string): string {
    if (/^Las /.test(etiqueta)) return 'obligatorias';
    if (/^Los /.test(etiqueta)) return 'obligatorios';
    if (/^La /.test(etiqueta)) return 'obligatoria';
    return 'obligatorio';
  }

  private traducir(errores: ValidationErrors): string {
    const [clave, detalle] = Object.entries(errores)[0];
    const e = this.etiqueta;

    const mensajes: Record<string, string> = {
      required: `${e} es ${this.obligatorio(e)}.`,
      minlength: `${e} debe tener al menos ${detalle?.requiredLength} caracteres.`,
      maxlength: `${e} admite como máximo ${detalle?.requiredLength} caracteres.`,
      min: `${e} debe ser mayor o igual a ${detalle?.min}.`,
      max: `${e} debe ser menor o igual a ${detalle?.max}.`,
      email: 'Ingresa un correo válido (ejemplo: nombre@correo.com).',
      soloEspacios: `${e} no puede contener sólo espacios.`,
      soloLetras: `${e} sólo admite letras y espacios.`,
      dni: 'El DNI debe tener exactamente 8 dígitos.',
      dniDuplicado: 'Ya existe un propietario registrado con este DNI.',
      celular: 'El celular debe tener 9 dígitos y empezar con 9.',
      fechaPasada: 'La fecha no puede ser anterior a hoy.',
      fechaFutura: 'La fecha no puede ser posterior a hoy.',
      fueraDeHorario: `Horario de atención: ${detalle?.apertura} a ${detalle?.cierre}.`
    };

    return mensajes[clave] ?? `${e} no es válido.`;
  }
}
