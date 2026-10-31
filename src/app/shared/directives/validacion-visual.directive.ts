import { Directive, HostBinding, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Refleja el estado de un control de ReactiveForms con las clases de Bootstrap
 * `is-invalid` / `is-valid`, sólo después de que el usuario interactúa con el campo.
 *
 * Uso: <input formControlName="nombre" appValidacionVisual>
 */
@Directive({ selector: '[appValidacionVisual]' })
export class ValidacionVisualDirective {
  private readonly ngControl = inject(NgControl, { self: true });

  private get interactuado(): boolean {
    return !!(this.ngControl.touched || this.ngControl.dirty);
  }

  @HostBinding('class.is-invalid')
  get invalido(): boolean {
    return !!this.ngControl.invalid && this.interactuado;
  }

  @HostBinding('class.is-valid')
  get valido(): boolean {
    const tieneValor = this.ngControl.value !== '' && this.ngControl.value !== null;
    return !!this.ngControl.valid && this.interactuado && tieneValor;
  }

  @HostBinding('attr.aria-invalid')
  get ariaInvalido(): 'true' | null {
    return this.invalido ? 'true' : null;
  }
}
